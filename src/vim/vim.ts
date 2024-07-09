import { appendContent } from "../helpers/append-content";
import { appendLine } from "../helpers/append-line";
import { copyLine } from "../helpers/copy-line";
import { deleteLine } from "../helpers/delete-line";
import { incrementLineNumber } from "../helpers/increment-line-number";
import { paste, pasteBefore } from "../helpers/paste";
import { prependContent } from "../helpers/prepend-content";
import { prependLine } from "../helpers/prepend-line";
import { sendKey } from "../helpers/send-key";
import { setLineIndex } from "../helpers/set-line-index";
import { createSubscriptionChannel } from "../helpers/subscribe";
import { imap } from "../mappings/imap";
import { nmap } from "../mappings/nmap";
import { vmap } from "../mappings/vmap";
import { VimEvent } from "./events";

export namespace Vim {
  export type Mode = "Normal" | "Insert" | "Terminal" | "Visual" | "Replace" | "V-Block"

  export type Mapping = {
    /** An array of chars, * indicates wildcard */
    seq: string[];
    modifiers?: Partial<KeyModifiers>
    /** A list of wildcards that apply to the mapping */
    wildcards?: ["range"];
    action: (vim: Vim, wildcard: WildcardPayload) => void;
  }

  export type CursorPosition = {
    startLine: number;
    endLine: number;
    startIndex: number;
    endIndex: number;
    /** When jumping lines up and down cursor position will adjust to EOL if the next line is shorter than the previous */
    offset: number;
  }

  export type KeyModifiers = {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
  }

  export type SequenceHistory = {
    key: string
  } & KeyModifiers
}


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
  cursorPos: Vim.CursorPosition;
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
  setLineNumber: (resetX: boolean, count?: number, mode?: "relative" | "absolute") => void;
  setLineIndex: (count?: number, mode?: "relative" | "absolute") => void;
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

  function setMode(mode: Vim.Mode, vim: Vim) {
    switch (mode) {
      case "Normal":
        vim.setCursorPosition({
          ...vim.cursorPos,
          endLine: vim.cursorPos.startLine,
          endIndex: vim.cursorPos.startIndex
        })
        break;

      case "Visual":
        break;

      case "Insert":
        break;
    }
    const prevMode = vim.mode;
    vim.mode = mode;
    notify({ event: "OnModeChange", data: { mode, prevMode } })
    return vim

  }

  function adjustCursorPosition(vim: Vim) {
    if (!isValidCursorPosition(vim.cursorPos, vim)) {
      vim.setLineNumber(false, -1)
    }
  }

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
    setLineIndex: (count, mode) => vim.setCursorPosition(setLineIndex(vim, count, mode)),
    setLineNumber: (resetX, count, mode) => {
      const inc = incrementLineNumber(vim, resetX, count, mode)
      vim.setCursorPosition(inc)
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
      vim.cursorPos = cursorPosition;
      notify({ event: "OnCursorMove", data: { cursorPos: cursorPosition } })
      return vim;
    },
    mode: "Normal",
    setMode: (mode) => setMode(mode, vim),
    cursorPos: { startLine: 0, startIndex: 0, endLine: 0, endIndex: 0, offset: 0 },
    getCurrentLine: () => [vim.content[vim.cursorPos.startLine], vim.cursorPos.startLine, vim.content],
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
