import { Vim } from "../vim";

export function copyLine(vim: Vim) {
  vim.clipboard.setClipboardContent(vim.getCurrentLine()[0] + "\n")
}
