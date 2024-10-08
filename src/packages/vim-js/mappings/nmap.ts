import { Vim } from "../vim"

function charReplace(content: string, index: number, char: string) {
  return content.slice(0, index) + char + content.slice(index + 1)
}

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
    wildcards: ["range"],
    action: (vim, wildcard) => {
      if (wildcard.range && wildcard.range <= vim.content.length) {
        vim.cursor.setLineNumberNormal(false, wildcard.range - 1, "absolute")
      } else {
        vim.cursor.setLineNumberNormal(false, -1, "absolute")
      }
    }
  },
  {
    seq: ["g", "g"],
    action: (vim) => vim.cursor.setLineNumberNormal(false, 0, "absolute")
  },
  {
    seq: ["x"],
    action: (vim) => {
      const newContent = vim.content
      const lineIndex = vim.cursor.pos.startLine;
      const charIndex = vim.cursor.pos.startIndex
      newContent[lineIndex] = charReplace(newContent[lineIndex], charIndex, "")
      vim.setContent([...newContent])
    }
  },
  {
    seq: ["F", "*"],
    action: (vim) => {
      const v = vim.sequence.at(-1)
      if (!v?.key || v.key.length > 1) return;
      const [line] = vim.getCurrentLine()
      const index = vim.cursor.pos.startIndex
      const i = line.slice(0, index).lastIndexOf(v.key);
      if (i === -1) return;
      vim.cursor.setLineIndexNormal(i, "absolute")
    }
  },
  {
    seq: ["f", "*"],
    action: (vim) => {
      const v = vim.sequence.at(-1)
      if (!v?.key || v.key.length > 1) return;
      const index = vim.cursor.pos.startIndex
      const [line] = vim.getCurrentLine()
      const i = line.slice(index + 1).indexOf(v.key);
      if (i === -1) return;
      vim.cursor.setLineIndexNormal(i + index + 1, "absolute")
    }
  },
  {
    seq: ["r", "*"],
    action: (vim) => {
      const v = vim.sequence.at(-1)
      if (!v?.key || v.key.length > 1) return;
      const newContent = vim.content
      const lineIndex = vim.cursor.pos.startLine;
      const charIndex = vim.cursor.pos.startIndex
      newContent[lineIndex] = charReplace(newContent[lineIndex], charIndex, v.key)
      vim.setContent([...newContent])
    }
  },
  {
    seq: ["ArrowLeft"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineIndexNormal(-count)
    }
  },
  {
    seq: ["ArrowDown"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineNumberNormal(false, count)
    }
  },
  {
    seq: ["ArrowUp"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineNumberNormal(false, -count)
    }
  },
  {
    seq: ["ArrowRight"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineIndexNormal(count)
    }
  },
  {
    seq: ["h"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineIndexNormal(-count)
    }
  },
  {
    seq: ["j"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineNumberNormal(false, count)
    }
  },
  {
    seq: ["k"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineNumberNormal(false, -count)
    }
  },
  {
    seq: ["l"],
    wildcards: ["range"],
    action: (vim, modifier) => {
      const count = modifier.range ?? 1
      vim.cursor.setLineIndexNormal(count)
    }
  },
  {
    seq: ["u"],
    action: vim => vim.undoContentChange()
  },
  {
    seq: ["^"],
    action: vim => {
      const [line] = vim.getCurrentLine()
      const chars = new Array(...line)
      const firstCharWithoutWhitespace = chars.findIndex(s => s !== " ")
      if (firstCharWithoutWhitespace === -1) {
        return
      }
      vim.cursor.setLineIndexNormal(firstCharWithoutWhitespace, "absolute")
    }
  },
  {
    seq: ["_"],
    wildcards: ["range"],
    action: (vim, wildcard) => {
      if (wildcard.range && wildcard.range > 1) {
        vim.cursor.setLineNumberNormal(false, wildcard.range - 1)
      }
      const [line] = vim.getCurrentLine()
      const chars = new Array(...line)
      const firstCharWithoutWhitespace = chars.findIndex(s => s !== " ")
      if (firstCharWithoutWhitespace === -1) {
        return
      }
      vim.cursor.setLineIndexNormal(firstCharWithoutWhitespace, "absolute")

    }
  },
  {
    seq: ["-"],
    wildcards: ["range"],
    action: (vim, wildcard) => {
      if (wildcard.range) {
        vim.cursor.setLineNumberNormal(false, -(wildcard.range))
      } else {
        vim.cursor.setLineNumberNormal(false, -1)
      }
      const [line] = vim.getCurrentLine()
      const chars = new Array(...line)
      const firstCharWithoutWhitespace = chars.findIndex(s => s !== " ")
      if (firstCharWithoutWhitespace === -1) {
        return
      }
      vim.cursor.setLineIndexNormal(firstCharWithoutWhitespace, "absolute")

    }
  },
  {
    seq: ["0"],
    action: vim => vim.cursor.setLineIndexNormal(0, "absolute")
  },
  {
    seq: ["$"],
    wildcards: ["range"],
    action: (vim, wildcard) => {
      if (wildcard.range) {
        vim.cursor.setLineNumberNormal(false, wildcard.range - 1)
      }
      vim.cursor.setLineIndexNormal(-1, "absolute")

    }
  },
  {
    seq: ["a"],
    action: (vim) => {
      vim.cursor.setLineIndexNormal(1)
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
      vim.cursor.setLineIndexNormal(0, "absolute")
      vim.setMode("Insert")
    }
  },
  {
    seq: ["V"],
    action: vim => vim.setMode("V-Line")
  },
  {
    seq: ["v"],
    action: vim => vim.setMode("Visual")
  },
  {
    seq: ["o"],
    action: (vim) => {
      vim.appendLine()
      vim.cursor.setLineNumberNormal(false, 1)
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
    seq: ["<C-v>"],
    action: (vim) => vim.setMode("V-Block")
  },
  {
    seq: ["<C-S-Q>"],
    action: (vim) => vim.setMode("V-Block")
  }
]
