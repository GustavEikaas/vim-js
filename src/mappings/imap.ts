import { Vim } from "../vim/vim"

export const imap: Vim.Mapping[] = [
  {
    seq: ["Escape"],
    action: vim => {
      vim.setMode("Normal")
    }
  }
]

