import { Vim } from "../vim/vim"

export const vmap: Vim.Mapping[] = [
  {
    seq: ["Escape"],
    action: vim => {
      vim.setMode("Normal")
    }
  },
  {
    seq: ["I"],
    action: vim => {
      vim.cursor.setLineIndexNormal(0, "absolute")
      vim.setMode("Insert")
    }
  },
  {
    seq: ["G"],
    action: vim => {
      vim.setCursorPosition({
        ...vim.cursor.pos,
        endLine: vim.content.length - 1
      })
    }
  }
]
