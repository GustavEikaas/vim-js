import { Vim } from "../vim"

export const imap: Vim.Mapping[] = [
  {
    seq: ["Escape"],
    action: vim => {
      vim.setMode("Normal")
    }
  }
]

