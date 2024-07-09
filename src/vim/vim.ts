import { appendContent } from "../helpers/append-content";
import { appendLine } from "../helpers/append-line";
import { copyLine } from "../helpers/copy-line";
import { deleteLine } from "../helpers/delete-line";
import { incrementLineNumber } from "../helpers/increment-line-number";
import { paste, pasteBefore } from "../helpers/paste";
import { prependContent } from "../helpers/prepend-content";
import { prependLine } from "../helpers/prepend-line";
import { setLineIndex } from "../helpers/set-line-index";
import { createSubscriptionChannel } from "../helpers/subscribe";
import { imap } from "../mappings/imap";
import { nmap } from "../mappings/nmap";
import { vmap } from "../mappings/vmap";
import { VimEvent } from "./events";

export type VimMode = "Normal" | "Insert" | "Terminal" | "Visual" | "Replace" | "V-Block"

type ModifierPayload = {
  range?: number | undefined;
}
export type Mapping = {
  /** An array of chars, * indicates wildcard */
  seq: string[];
  /** A list of modifiers that apply to the mapping */
  modifiers?: ["range"];
  action: (vim: Vim, modifier: ModifierPayload) => void;
}

export type MappingReturn = Partial<Pick<Vim, "cursorPos" | "content" | "clipboard">>;

export type CursorPosition = {
  startLine: number;
  endLine: number;
  startIndex: number;
  endIndex: number;
  /** When jumping lines up and down cursor position will adjust to EOL if the next line is shorter than the previous */
  offset: number;
}

type Clipboard = {
  setClipboardContent: (content: string | null) => void;
  content: string | null;
  paste: VoidFunction;
  pasteBefore: VoidFunction;
}

export type Vim = {
  lastKeys: string[];
  content: string[];
  mode: VimMode;
  cursorPos: CursorPosition;
  clipboard: Clipboard;
  nMap: Mapping[];
  vMap: Mapping[];
  iMap: Mapping[];

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
  sendKey: (key: string) => void;
  setContent: (val: string[]) => Readonly<Vim>
  setMode: (mode: VimMode) => Readonly<Vim>
  setCursorPosition: (cursorPosition: CursorPosition) => Readonly<Vim>
  undoContentChange: VoidFunction

  // Subscribers
  addSubscriber: (cb: SubscriberEventCb, signal: AbortSignal) => Readonly<Vim>
}

type SubscriberEventCb = (ev: VimEvent) => void;


function tryMatchSequence(mapping: Mapping, keys: string[]): false | { mapping: Mapping, modifier: ModifierPayload } {
  const reversed = mapping.seq.toReversed()
  const reversedKeys = keys.toReversed()

  const isValidMapping = reversed.every((s, i) => {
    return s === reversedKeys[i]
  })

  if (!isValidMapping) return false;

  const possibleModifier = reversedKeys.at(reversed.length);
  const possibleNumbericModifier = Number(possibleModifier)

  //TODO: Handle negative numbers
  if (mapping.modifiers?.includes("range") && !isNaN(possibleNumbericModifier)) {
    const totalNumber = reversedKeys.slice(reversed.length + 1).reduce((acc, curr) => {
      if (!isNaN(Number(curr))) {
        //Its reversed
        return Number(`${curr}${acc}`)
      }
      return acc
    }, possibleNumbericModifier)

    return { mapping, modifier: { range: totalNumber } };
  }

  return { mapping, modifier: {} };
}

export const createVimInstance = (): Readonly<Vim> => {

  function executeMapping(mapping: Mapping, modifier: ModifierPayload) {
    mapping?.action(vim, modifier)
    vim.lastKeys = []
  }

  function matchMapping(map: Mapping[], vim: Vim) {
    const init = {
      found: false,
    } as {
      found: boolean;
      mapping?: Mapping;
      modifier?: ModifierPayload;
    }
    const value = map.reduce((res, curr) => {
      if (res.found) {
        return res;
      }

      const mapping = tryMatchSequence(curr, vim.lastKeys)
      if (mapping) {
        return {
          found: true,
          mapping: mapping.mapping,
          modifier: mapping.modifier
        }
      }

      return res;
    }, init)

    return value;
  }


  const handleKeyPress = () => {
    switch (vim.mode) {
      case "Normal": {
        //TODO: handle more likely mappings
        const mapping = matchMapping(vim.nMap, vim)
        if (!mapping.mapping) return
        console.debug(`Normal seq match [${mapping?.mapping?.seq.join(",")}]`, mapping.modifier)
        executeMapping(mapping.mapping, mapping.modifier ?? {})
        break;
      }

      case "Insert":
        const mapping = matchMapping(vim.iMap, vim)
        if (!mapping.mapping) return
        console.debug(`Normal seq match [${mapping?.mapping?.seq.join(",")}]`, mapping.modifier)
        executeMapping(mapping.mapping, mapping.modifier ?? {})
        break;

      case "Visual":
      case "V-Block": {
        const mapping = matchMapping(vim.vMap, vim)
        if (!mapping.mapping) return
        console.debug(`Visual seq match [${mapping?.mapping?.seq.join(",")}]`, mapping.modifier)
        executeMapping(mapping.mapping, mapping.modifier ?? {})
      }
    }
  }



  function setMode(mode: VimMode, vim: Vim) {
    switch (mode) {
      case "Normal":
        vim.cursorPos.endLine = vim.cursorPos.startLine
        vim.cursorPos.endIndex = vim.cursorPos.startIndex
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
    sendKey: (key) => {
      vim.lastKeys.push(key)
      console.log(`Key reg ${key}, keys: [${vim.lastKeys.join(",")}]`)
      handleKeyPress()
    }
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

function isValidCursorPosition(cursorPosition: CursorPosition, vim: Vim): boolean {
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
