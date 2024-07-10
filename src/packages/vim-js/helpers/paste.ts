import { Vim } from "../vim"

export function paste(vim: Vim) {
  if (vim.clipboard.content) {
    vim.appendContent(vim.clipboard.content)
  }
}

export function pasteBefore(vim: Vim) {
  if (vim.clipboard.content) {
    vim.prependContent(vim.clipboard.content)
  }
}

