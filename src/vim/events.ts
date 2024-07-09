import { CursorPosition, VimMode } from "./vim"

export type VimEvent = [
  OnContentChange,
  OnModeChange,
  OnCursorMove,
  OnClipboardChange
][number]


export type OnContentChange = {
  event: "OnContentChange",
  data: { newContent: string[] }
}

export type OnCursorMove = {
  event: "OnCursorMove",
  data: { cursorPos: CursorPosition }
}

export type OnModeChange = {
  event: "OnModeChange",
  data: { mode: VimMode, prevMode: VimMode }
}

export type OnClipboardChange = {
  event: "OnClipboardContentChange",
  data: { content: string | null }
}

