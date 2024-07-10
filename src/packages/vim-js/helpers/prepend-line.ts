import { Vim } from "../vim"

export function prependLine(vim: Vim, content: string = " ") {
  const newContent = vim.content.slice(0, vim.cursor.pos.startLine).concat([content]).concat(vim.content.slice(vim.cursor.pos.startLine))
  vim.setContent(newContent)
}
