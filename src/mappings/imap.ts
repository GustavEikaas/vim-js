import { Mapping } from "../vim/vim"

export const imap: Mapping[] = [
  {
    seq: ["Escape"],
    action: vim => {
      vim.setMode("Normal")
    }
  }
]

