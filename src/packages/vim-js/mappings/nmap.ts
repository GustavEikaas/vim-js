import { getInnerPos } from "../helpers/get-inner-pos"
import { Vim } from "../vim"

function charReplace(content: string, index: number, char: string) {
  return content.slice(0, index) + char + content.slice(index + 1)
}

function changeInner(vim: Vim) {
  const pos = getInnerPos(vim, "{", "}")
  if (!pos) return
  const startContent = vim.content.slice(0, pos.startLine)
  const endContent = vim.content.slice(pos.endLine + 1)

  const startLine = vim.content.at(pos.startLine)!.slice(0, pos.startIndex)
  const endline = vim.content.at(pos.endLine)!.slice(pos.endIndex + 1)
  const r = pos.startLine === pos.endLine ? [startLine + endline] : [startLine, endline]
  vim.setContent(startContent.concat(r).concat(endContent))
  vim.setCursorPosition({
    startLine: pos.startLine,
    startIndex: pos.startIndex,
    endLine: pos.startLine,
    endIndex: pos.startIndex,
    offset: 0
  })
  vim.setMode("Insert")
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
    action: (vim) => vim.cursor.setLineNumberNormal(false, -1, "absolute")
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
    seq: ["0"],
    action: vim => vim.cursor.setLineIndexNormal(0, "absolute")
  },
  {
    seq: ["$"],
    action: vim => {
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
    seq: ["<C-S-Q>"],
    action: (vim) => vim.setMode("V-Block")
  },
  {
    //viw vi" vi' vi` vi{ vi( vi[
    seq: ["c", "i", "*"],
    action: (vim) => {
      const key = vim.sequence.at(-1)?.key
      if (!key) return;
      switch (key) {

        case `"`:
        case "'":
        case "`":
          break;

        case "w":
          console.log("not implemented")
          break;

        case "{":
        case "}":
          changeInner(vim)
          break;

        case "(":
        case ")":
          break;

        case "[":
        case "]":
          break;
      }

      return;
    }
  }
]
