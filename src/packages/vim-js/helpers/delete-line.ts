import { Vim } from "../vim"

export function deleteLine(vim: Vim) {
  const lines = vim.content as (string | null)[]
  const clipboard = lines[vim.cursor.pos.startLine] ?? ""
  const modified = lines as (string | null)[]
  modified[vim.cursor.pos.startLine] = null

  vim.setContent(modified.filter((s) => s !== null))
  vim.clipboard.content = clipboard

}

