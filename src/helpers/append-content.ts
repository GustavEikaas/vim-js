import { Vim } from "../vim/vim";

export function appendContent(vim: Vim, newContent: string = " ") {

  const [currentLine, index, lines] = vim.getCurrentLine()
  const content = currentLine.slice(0, vim.cursorPos.startIndex) + (newContent) + currentLine.slice(vim.cursorPos.startIndex)
  const newLines = content.split("\n")
  if (newLines.length == 1) {
    lines[index] = content;
    vim.setContent(lines)
  } else {
    const splicedLines = lines.slice(0, index).concat(newLines).concat(lines.slice(index + 1))
    vim.setContent(splicedLines)
  }
}
