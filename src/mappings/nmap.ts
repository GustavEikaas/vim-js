import { Vim } from "../vim/vim"

export const nmap: Vim.Mapping[] = [
  {
    seq: ["y", "y"],
    action: (vim) => vim.copyCurrentLine()
  },
  {
    seq: ["d", "d"],
    action: (vim) => vim.deleteCurrentLine()
  },
  {
    seq: ["G"],
    action: (vim) => vim.setLineNumber(false, vim.content.length - 1, "absolute")
  },
  {
    seq: ["g", "g"],
    action: (vim) => vim.setLineNumber(false, 0, "absolute")
  },
  {
    seq: ["h"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.setLineIndex(-count)
    }
  },
  {
    seq: ["j"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.setLineNumber(false, count)
    }
  },
  {
    seq: ["k"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.setLineNumber(false, -count)
    }
  },
  {
    seq: ["l"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.setLineIndex(count)
    }
  },
  {
    seq: ["u"],
    action: vim => vim.undoContentChange()
  },
  {
    seq: ["0"],
    action: vim => vim.setLineIndex(0, "absolute")
  },
  {
    seq: ["$"],
    action: vim => {
      const i = vim.content[vim.cursorPos.endLine].length - 1
      vim.setLineIndex(i, "absolute")
    }
  },
  {
    seq: ["a"],
    action: (vim) => {
      vim.setLineIndex(1)
      vim.setMode("Insert")
    }
  },
  {
    seq: ["i"],
    action: (vim) => vim.setMode("Insert")
  },
  {
    seq: ["I"],
    action: (vim) => {
      vim.setLineIndex(0, "absolute")
      vim.setMode("Insert")
    }
  },
  {
    seq: ["v"],
    action: vim => vim.setMode("Visual")
  },
  {
    seq: ["o"],
    action: (vim) => {
      vim.appendLine()
      vim.setLineNumber(false, 1)
      vim.setMode("Insert")
    }
  },
  {
    seq: ["O"],
    action: (vim) => {
      vim.prependLine()
      vim.setMode("Insert")
    }
  },
  {
    seq: ["P"],
    action: vim => vim.clipboard.pasteBefore()
  },
  {
    seq: ["p"],
    action: vim => vim.clipboard.paste()
  },
  {
    seq: ["<C-S-Q>"],
    action: (vim) => vim.setMode("V-Block")
  }
]
