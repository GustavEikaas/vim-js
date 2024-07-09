import { Vim } from "../vim/vim";

export function setMode(mode: Vim.Mode, vim: Vim, onModeChange: (mode: Vim.Mode, prevMode: Vim.Mode) => void) {
  switch (mode) {
    case "Normal":
      vim.setCursorPosition({
        ...vim.cursorPos,
        endLine: vim.cursorPos.startLine,
        endIndex: vim.cursorPos.startIndex
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
