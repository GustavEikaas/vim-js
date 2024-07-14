import { getInnerPos } from "../helpers/get-inner-pos";
import { vSelectQuote } from "../helpers/v-select-quote"
import { Vim } from "../vim"

function selectInner(vim: Vim, left: string, right: string) {
  const position = getInnerPos(vim, left, right)
  if (!position) {
    return;
  }
  vim.setCursorPosition(position)
}

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
  },
  {
    seq: ["$"],
    action: (vim) => {
      const [line] = vim.getCurrentLine()
      vim.setCursorPosition({
        ...vim.cursor.pos,
        endIndex: line.length - 1
      })
    }
  },
  {
    //viw vi" vi' vi` vi{ vi( vi[
    seq: ["a", "*"],
    action: (vim) => {
      const key = vim.sequence.at(-1)?.key
      if (!key) return;
      switch (key) {

        case `"`:
        case "'":
        case "`":
          vSelectQuote(vim, key, "around")
          break;

        case "w":
          console.log("not implemented")
          break;

        case "{":
        case "}":
          console.log("not implemented")
          break;

        case "(":
        case ")":
          console.log("not implemented")
          break;

        case "[":
        case "]":
          console.log("not implemented")
          break;
      }

      return;
    }
  },
  {
    //viw vi" vi' vi` vi{ vi( vi[
    seq: ["i", "*"],
    action: (vim) => {
      const key = vim.sequence.at(-1)?.key
      if (!key) return;
      switch (key) {

        case `"`:
        case "'":
        case "`":
          vSelectQuote(vim, key, "inner")
          break;

        case "w":
          console.log("not implemented")
          break;

        case "{":
        case "}":
          selectInner(vim, "{", "}")
          break;

        case "(":
        case ")":
          selectInner(vim, "(", ")")
          break;

        case "[":
        case "]":
          selectInner(vim, "[", "]")
          break;
      }

      return;
    }
  },
]


