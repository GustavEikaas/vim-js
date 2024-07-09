import { Vim } from "../vim/vim"

export function deleteLine(vim: Vim) {
  const lines = vim.content as (string | null)[]
  const clipboard = lines[vim.cursorPos.startLine] ?? ""
  const modified = lines as (string | null)[]
  modified[vim.cursorPos.startLine] = null

  vim.setContent(modified.filter(s => s !== null))
  vim.clipboard.content = clipboard

 }

