import { Mapping } from "../vim/vim"

export const vmap: Mapping[] = [
  {
    seq: ["Escape"],
    action: vim => {
      vim.setMode("Normal")
    }
  }
]
