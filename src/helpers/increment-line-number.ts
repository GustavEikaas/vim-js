import { Vim } from "../vim/vim"

function getAbsoluteIndex(count: number, length: number) {
  if (count === -1) {
    return length - 1;
  }

  if (count === 0) {
    return 0;
  }

  return (count % length + length) % length;
}


export const incrementLineNumber = (vim: Vim, resetIndex: boolean, count: number = 1, mode: "relative" | "absolute" = "relative"): Vim.CursorPosition => {
  const totalLines = vim.content.length
  const startLine = mode == "relative" ? vim.cursor.pos.startLine + count : getAbsoluteIndex(count, totalLines)
  const endLine = startLine

  const inc = ({
    startLine,
    endLine,
    startIndex: resetIndex ? 0 : vim.cursor.pos.startIndex += vim.cursor.pos.offset,
    endIndex: resetIndex ? 0 : vim.cursor.pos.endIndex += vim.cursor.pos.offset,
    offset: 0
  })

  if (inc.endLine > vim.content.length - 1 || inc.startLine < 0) {
    return vim.cursor.pos
  }

  const line = vim.content.at(inc.startLine)
  if (typeof (line) !== "string" && !line) {
    console.warn(`invalid line ${typeof (line)}`)
    return vim.cursor.pos
  }
  if (inc.startIndex > line.length - 1) {
    inc.offset = inc.startIndex - (line.length - 1)
    inc.startIndex = line.length - 1
    inc.endIndex = inc.startIndex
  }
  return inc;
}


