import { Vim } from "../vim";

function getStartIndex(line: string, index: number, char: string) {
  const before = Array.from(line.slice(0, index)).lastIndexOf(char)
  if (before !== -1) {
    return before
  }
  const ahead = Array.from(line).indexOf(char)
  if (ahead !== -1) {
    return ahead;
  }
}

function getRangeOfInnerQuotes(line: string, index: number, char: string) {
  const i = getStartIndex(line, index, char)
  if (i === undefined) {
    return;
  }
  const endIndex = Array.from(line.slice(i + 1)).indexOf(char)
  if (endIndex === -1) {
    return;
  }

  return {
    start: i + 1,
    end: endIndex + i
  }
}


export function vSelectQuote(vim: Vim, char: string, mode: "inner" | "around") {
  const [line] = vim.getCurrentLine()
  const range = getRangeOfInnerQuotes(line, vim.cursor.pos.startIndex, char)
  if (!range) return
  if (mode === "around") {
    range.start = range.start - 1
    range.end = range.end + 1
  }
  vim.setCursorPosition({
    ...vim.cursor.pos,
    startIndex: range.start,
    endIndex: range.end
  })
}
