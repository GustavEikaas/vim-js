import { Vim } from "../vim/vim";

export function getContent(vim: Vim) {
  const content = vim.content;
  const before = content.slice(0, vim.cursor.pos.startLine + 1)
  let a = before.at(-1)
  if (a) {
    before[before.length - 1] = a.slice(0, vim.cursor.pos.startIndex)
  }
  const highlighted = content.slice(vim.cursor.pos.startLine, vim.cursor.pos.endLine + 1)

  let b = highlighted.at(-1)
  if (b) {
    highlighted[highlighted.length - 1] = b.slice(vim.cursor.pos.startIndex, vim.cursor.pos.endIndex + 1)
  }

  const after = content.slice(vim.cursor.pos.endLine)
  let c = after[0]
  if (c) {
    after[0] = c.slice(vim.cursor.pos.endIndex + 1)
  }

  return {
    content: vim.content,
    before,
    highlighted,
    after
  }
}


