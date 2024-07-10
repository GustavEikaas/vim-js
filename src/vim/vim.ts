import { appendContent } from "../helpers/append-content";
import { appendLine } from "../helpers/append-line";
import { copyLine } from "../helpers/copy-line";
import { deleteLine } from "../helpers/delete-line";
import { incrementLineNumber } from "../helpers/increment-line-number";
import { paste, pasteBefore } from "../helpers/paste";
import { prependContent } from "../helpers/prepend-content";
import { prependLine } from "../helpers/prepend-line";
import { sendKey } from "../helpers/send-key";
import { setLineIndexNormal } from "../helpers/set-line-index";
import { setMode } from "../helpers/set-mode";
import { createSubscriptionChannel } from "../helpers/subscribe";
import { imap } from "../mappings/imap";
import { nmap } from "../mappings/nmap";
import { vmap } from "../mappings/vmap";
import { VimEvent } from "./events";

export type WildcardPayload = {
  range?: number | undefined;
}

type Clipboard = {
  setClipboardContent: (content: string | null) => void;
  content: string | null;
  paste: VoidFunction;
  pasteBefore: VoidFunction;
}

export type Vim = {
  lastKeys: Vim.SequenceHistory[];
  content: string[];
  mode: Vim.Mode;
  cursor: Vim.Cursor;
  clipboard: Clipboard;
  nMap: Vim.Mapping[];
  vMap: Vim.Mapping[];
  iMap: Vim.Mapping[];

  /** getCurrentLine: () =>  \[line, index, lines\]*/
  getCurrentLine: () => [string, number, string[]];
  copyCurrentLine: () => void;
  deleteCurrentLine: () => void;
  appendLine: (content?: string) => void;
  prependLine: (content?: string) => void;
  appendContent: (content?: string) => void;
  prependContent: (content?: string) => void;

  // Setters
  sendKey: (key: string, modifiers: Vim.KeyModifiers) => void;
  setContent: (val: string[]) => Readonly<Vim>
  setMode: (mode: Vim.Mode) => Readonly<Vim>
  setCursorPosition: (cursorPosition: Vim.CursorPosition) => Readonly<Vim>
  undoContentChange: VoidFunction

  // Subscribers
  addSubscriber: (cb: SubscriberEventCb, signal: AbortSignal) => Readonly<Vim>
}

type SubscriberEventCb = (ev: VimEvent) => void;

export const createVimInstance = (): Readonly<Vim> => {
  const { addSubscriber, notify } = createSubscriptionChannel<VimEvent>()

  const vim: Vim = {
    addSubscriber: (cb, signal) => {
      addSubscriber(cb, signal)
      return vim;
    },
    lastKeys: [],
    copyCurrentLine: () => copyLine(vim),
    deleteCurrentLine: () => deleteLine(vim),
    content: [],
    cursor: {
      pos: { startLine: 0, startIndex: 0, endLine: 0, endIndex: 0, offset: 0 },
      setLineIndexNormal: (count, mode) => vim.setCursorPosition(setLineIndexNormal(vim, count, mode)),
      setLineNumberNormal: (resetX, count, mode) => {
        const inc = incrementLineNumber(vim, resetX, count, mode)
        vim.setCursorPosition(inc)
      },
    },
    setContent: (newContent) => {
      vim.content = newContent
      adjustCursorPosition(vim)
      notify({ event: "OnContentChange", data: { newContent } })
      return vim;
    },
    undoContentChange: () => {
      if (undoRegister.isSet) {
        vim.setContent(undoRegister.content)
      }
    },
    setCursorPosition: (cursorPosition) => {
      if (!isValidCursorPosition(cursorPosition, vim)) {
        console.warn(`Invalid cursor position ${cursorPosition}`)
        return vim;
      }
      vim.cursor.pos = cursorPosition;
      notify({ event: "OnCursorMove", data: { cursorPos: cursorPosition } })
      return vim;
    },
    mode: "Normal",
    setMode: (mode) => setMode(mode, vim, (mode, prevMode) => notify({ event: "OnModeChange", data: { mode, prevMode } })),
    getCurrentLine: () => [vim.content[vim.cursor.pos.startLine], vim.cursor.pos.startLine, vim.content],
    prependLine: (content = " ") => prependLine(vim, content),
    appendLine: (content = " ") => appendLine(vim, content),
    appendContent: (content = " ") => appendContent(vim, content),
    prependContent: (content = " ") => prependContent(vim, content),
    clipboard: {
      setClipboardContent: (content) => {
        vim.clipboard.content = content
        notify({ event: "OnClipboardContentChange", data: { content } })
      },
      content: null,
      paste: () => paste(vim),
      pasteBefore: () => pasteBefore(vim),
    },
    nMap: nmap,
    vMap: vmap,
    iMap: imap,
    sendKey: (key, modifiers) => sendKey(vim, [key, modifiers], () => notify({ event: "OnMappingExecuted", data: {} }))
  }

  const undoRegister = {
    isSet: false,
    content: [] as string[],
    current: [] as string[]
  }
  const controller = new AbortController()

  vim.addSubscriber((ev) => {
    if (ev.event === "OnModeChange" && ev.data.mode === "Normal" && ev.data.prevMode === "Insert") {
      undoRegister.isSet = true;
      undoRegister.current = undoRegister.content;
      undoRegister.content = vim.content;
    }
  }, controller.signal)

  return vim
}

function adjustCursorPosition(vim: Vim) {
  if (!isValidCursorPosition(vim.cursor.pos, vim)) {
    vim.cursor.setLineNumberNormal(false, -1)
  }
}

//TODO: Implement insert specific cursor pos
function isValidCursorPosition(cursorPosition: Vim.CursorPosition, vim: Vim): boolean {
  if (vim.mode === "Normal") {
    const line = vim.content.at(cursorPosition.startLine)
    if (line == undefined) {
      return false;
    }
    if (line?.length == 0) {
      return true;
    }
    return !!line.at(cursorPosition.startIndex)
  }

  return true;
}

export namespace Vim {
  /** The different vim modes*/
  export type Mode = "Normal" | "Insert" | "Visual" | "V-Block"

  /**
   * A vim keymapping
   * @example
   * ```
   * {
   *   seq: \["l"],
   *   wildcards: \["range"],
   *   action: (vim, modifier) => console.log("Lets do 'l' x ${modifier.range ?? 1} times")
   * }
   * ```
   */
  export type Mapping = {
    /**
     * An array of keystrokes
     * @example
     * seq: \["Q"]
     * seq: \["C-Q"] // Control + Q
     * supported modifiers; Control(C), Shift(S), Alt(A)
     */
    seq: string[];
    /** A list of wildcards that apply to the mapping */
    wildcards?: ["range"];
    /** The function to execute when the mapping is activated */
    action: (vim: Vim, wildcard: WildcardPayload) => void;
  }

  /**
   * The position of the Vim cursor
   */
  export type CursorPosition = {
    startLine: number;
    endLine: number;
    startIndex: number;
    endIndex: number;
    /** When jumping lines up and down cursor position will adjust to EOL if the next line is shorter than the previous */
    offset: number;
  }



  export type Cursor = {
    pos: CursorPosition;
    /** 
     * Sets a line number to the specified count
     * @param resetX - if true sets cursor index to 0
     * @param count - how many times to repeat the operation, defaults to 1
     * @param mode - relative | absolute, relative performs the operation relative to current position
     * @example
     * ```
     * setLineNumber(false, 1) //Increment line by 1
     * setLineNumber(false, -1) //Decrement line by 1
     * setLineNumber(false, 1, "absolute") //Set line to 1
     * setLineNumber(false, -1, "absolute") // Set line to last line in buffer
     * ```
     */
    setLineNumberNormal: (resetX: boolean, count?: number, mode?: "relative" | "absolute") => void;
    /** 
     * Sets a line index to the specified count or increments/decrements relative to specified count
     * @param count - how many times to repeat the operation, defaults to 1
     * @param mode - relative | absolute, relative performs the operation relative to current position
     * @example
     * ```
     * setLineIndex(1) //Increment line index by 1
     * setLineIndex(-1) //Decrement line index by 1
     * setLineIndex(1, "absolute") //Set line index to 1
     * setLineIndex(-1, "absolute") // Set line index to end of line
     * ```
     */
    setLineIndexNormal: (count?: number, mode?: "relative" | "absolute") => void;
  }
  /** Indicates which key modifiers are being held down */
  export type KeyModifiers = {
    /** Indicates if Control key is being held down*/
    ctrl: boolean;
    /** Indicates if Shift key is being held down*/
    shift: boolean;
    /** Indicates if Alt key is being held down*/
    alt: boolean;
  }

  export type SequenceHistory = {
    /**
     * The key visual name that was pressed
     * @example
     * 'Q'
     */
    key: string
  } & KeyModifiers
}
