import { Vim } from "../vim/vim";

export function setMode(mode: Vim.Mode, vim: Vim, onModeChange: (mode: Vim.Mode, prevMode: Vim.Mode) => void) {
  switch (mode) {
    case "Normal":
      vim.setCursorPosition({
        ...vim.cursor.pos,
        endLine: vim.cursor.pos.startLine,
        endIndex: vim.cursor.pos.startIndex
      })
      break;

    case "Visual":
      break;

    case "Insert":
      break;
  }
  const prevMode = vim.mode;
  vim.mode = mode;
  onModeChange(mode, prevMode)
  return vim

}
