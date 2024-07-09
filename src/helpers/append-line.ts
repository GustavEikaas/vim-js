import { Vim } from "../vim/vim"

export function appendLine(vim: Vim, content: string = " ") {
  const newContent = vim.content.slice(0, vim.cursorPos.startLine + 1).concat([content]).concat(vim.content.slice(vim.cursorPos.startLine + 1))
  vim.setContent(newContent)
}
