import { Vim } from "../vim/vim"

export function prependLine(vim: Vim, content: string = " ") {
  const newContent = vim.content.slice(0, vim.cursorPos.startLine).concat([content]).concat(vim.content.slice(vim.cursorPos.startLine))
  vim.setContent(newContent)
}
