import { Vim } from "../vim/vim";

function getAbsoluteIndex(count: number, length: number) {
  if (count === -1) {
    return length - 1;
  }

  if (count === 0) {
    return 0;
  }

  return (count % length + length) % length;
}

export const setLineIndexNormal = (vim: Vim, count: number = 1, mode: "relative" | "absolute" = "relative"): Vim.CursorPosition => {
  const [currLine] = vim.getCurrentLine()
  const startIndex = mode == "relative" ? vim.cursor.pos.startIndex + (count) : getAbsoluteIndex(count, currLine.length);
  const endIndex = startIndex;

  const inc = ({ ...vim.cursor.pos, startIndex, endIndex })
  inc.offset = 0
  const line = vim.content.at(inc.endLine)

  if (line === undefined) {
    console.warn(`invalid line`)
    return vim.cursor.pos
  }

  if (inc.endIndex < 0) {
    inc.endLine -= 1
    const endIndex = (vim.content.at(inc.endLine)?.length ?? 0) - 1
    inc.endIndex = endIndex
    if (vim.cursor.pos.startIndex == vim.cursor.pos.endIndex) {
      inc.startIndex = inc.endIndex;
      inc.startLine = inc.endLine;
    }
  }
  if (inc.endIndex > line.length - 1) {
    inc.endIndex = 0;
    inc.endLine += 1
    if (vim.cursor.pos.startIndex == vim.cursor.pos.endIndex) {
      inc.startIndex = inc.endIndex;
      inc.startLine = inc.endLine;
    }
  }

  return inc;
}

