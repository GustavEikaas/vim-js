import { Vim } from "../vim/vim";

export function copyLine(vim: Vim) {
  vim.clipboard.setClipboardContent(vim.getCurrentLine()[0] + "\n")
}
