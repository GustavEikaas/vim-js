import { CursorPosition, Vim } from "../vim/vim";

export const setLineIndex = (vim: Vim, count: number = 1, mode: "relative" | "absolute" = "relative"): CursorPosition => {
  const startIndex = mode == "relative" ? vim.cursorPos.startIndex + (count) : count;
  const endIndex = mode == "relative" ? vim.cursorPos.endIndex + (count) : count;
  const inc = ({ ...vim.cursorPos, startIndex, endIndex })
  inc.offset = 0
  const line = vim.content.at(inc.endLine)
  if (line === undefined) {
    console.warn(`invalid line`)
    return vim.cursorPos;
  }
  if (inc.endIndex < 0) {
    inc.endLine -= 1
    const endIndex = (vim.content.at(inc.endLine)?.length ?? 0) - 1
    inc.endIndex = endIndex
    if (vim.cursorPos.startIndex == vim.cursorPos.endIndex) {
      inc.startIndex = inc.endIndex;
      inc.startLine = inc.endLine;
    }
  }
  if (inc.endIndex > line.length - 1) {
    inc.endIndex = 0;
    inc.endLine += 1
    if (vim.cursorPos.startIndex == vim.cursorPos.endIndex) {
      inc.startIndex = inc.endIndex;
      inc.startLine = inc.endLine;
    }
  }

  return inc;
}

