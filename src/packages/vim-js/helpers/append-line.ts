import { Vim } from "../vim"

export function appendLine(vim: Vim, content: string = " ") {
  const newContent = vim.content.slice(0, vim.cursor.pos.startLine + 1).concat([content]).concat(vim.content.slice(vim.cursor.pos.startLine + 1))
  vim.setContent(newContent)
}
