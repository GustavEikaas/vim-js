import { Vim } from "../vim/vim"

export const incrementLineNumber = (vim: Vim, resetIndex: boolean, count: number = 1, mode: "relative" | "absolute" = "relative"): Vim.CursorPosition => {
  const startLine = mode == "relative" ? vim.cursorPos.startLine + count : count
  const endLine = mode == "relative" ? vim.cursorPos.endLine + count : count

  const inc = ({
    startLine,
    endLine,
    startIndex: resetIndex ? 0 : vim.cursorPos.startIndex += vim.cursorPos.offset,
    endIndex: resetIndex ? 0 : vim.cursorPos.endIndex += vim.cursorPos.offset,
    offset: 0
  })

  if (inc.endLine > vim.content.length - 1 || inc.startLine < 0) {
    return vim.cursorPos
  }

  const line = vim.content.at(inc.startLine)
  if (typeof(line) !== "string" && !line) {
    console.warn(`invalid line ${typeof(line)}`)
    return vim.cursorPos
  }
  if (inc.startIndex > line.length - 1) {
    inc.offset = inc.startIndex - (line.length - 1)
    inc.startIndex = line.length - 1
    inc.endIndex = inc.startIndex
  }
  return inc;
}


