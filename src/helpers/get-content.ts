import { Vim } from "../vim/vim";

export function getContent(vim: Vim) {
  const content = vim.content;
  const before = content.slice(0, vim.cursorPos.startLine + 1)
  let a = before.at(-1)
  if (a) {
    before[before.length - 1] = a.slice(0, vim.cursorPos.startIndex)
  }
  const highlighted = content.slice(vim.cursorPos.startLine, vim.cursorPos.endLine + 1)

  let b = highlighted.at(-1)
  if (b) {
    highlighted[highlighted.length - 1] = b.slice(vim.cursorPos.startIndex, vim.cursorPos.endIndex + 1)
  }

  const after = content.slice(vim.cursorPos.endLine)
  let c = after[0]
  if (c) {
    after[0] = c.slice(vim.cursorPos.endIndex + 1)
  }

  return {
    content: vim.content,
    before,
    highlighted,
    after
  }
}


