import { Vim } from "../vim"

function getStartIndex(line: string, index: number, char: string) {
  const before = Array.from(line.slice(0, index)).lastIndexOf(char)
  if (before !== -1) {
    return before
  }
  const ahead = Array.from(line).indexOf(char)
  if (ahead !== -1) {
    return ahead;
  }
}

function getRangeOfInnerQuotes(line: string, index: number, char: string) {
  const i = getStartIndex(line, index, char)
  if (i === undefined) {
    return;
  }
  const endIndex = Array.from(line.slice(i + 1)).indexOf(char)
  if (endIndex === -1) {
    return;
  }

  return {
    start: i + 1,
    end: endIndex + i
  }
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
    //viw vi" vi' vi` vi{ vi( vi[
    seq: ["a", "*"],
    action: (vim) => {
      const key = vim.sequence.at(-1)?.key
      if (!key) return;
      switch (key) {

        case `"`:
        case "'":
        case "`": {
          const [line] = vim.getCurrentLine()
          const range = getRangeOfInnerQuotes(line, vim.cursor.pos.startIndex, key)
          if (!range) return
          vim.setCursorPosition({
            ...vim.cursor.pos,
            startIndex: range.start - 1,
            endIndex: range.end + 1
          })
          break;
        }

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
        case "`": {
          const [line] = vim.getCurrentLine()
          const range = getRangeOfInnerQuotes(line, vim.cursor.pos.startIndex, key)
          if (!range) return
          vim.setCursorPosition({
            ...vim.cursor.pos,
            startIndex: range.start,
            endIndex: range.end
          })
          break;
        }

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
]


