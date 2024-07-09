import { Vim } from "../vim/vim"

export const vmap: Vim.Mapping[] = [
  {
    seq: ["Escape"],
    action: vim => {
      vim.setMode("Normal")
    }
  }
]
