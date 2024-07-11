import { vSelectQuote } from "../helpers/v-select-quote"
import { Vim } from "../vim"

function selectInner(vim: Vim, left: string, right: string) {
  const b = bracketPair(vim, left, right)
  if (!b) {
    return;
  }
  vim.setCursorPosition({
    startLine: b.start.line,
    startIndex: b.start.index,
    endLine: b.end.line,
    endIndex: b.end.index,
    offset: 0
  })
}

function lineIndex(line: string, char: string) {
  const i = line.indexOf(char)
  if (i !== -1) {
    return i
  }
}

function getStartIndex(vim: Vim, char: string) {
  const [_, index, all] = vim.getCurrentLine()

  const preLines = all.slice(0, index + 1).toReversed()
  const before = searchLines(preLines, char)
  if (before) {
    return before
  }

  const afterLines = all.slice(index + 1)
  const after = searchLines(afterLines, char)
  if (after) {
    return after
  }
}

const searchLines = (lines: string[], char: string) => {
  const position = lines.reduce((acc, curr, i) => {
    if (acc !== undefined) return acc;
    const pos = lineIndex(curr, char)
    if (pos !== undefined) {
      return {
        index: pos,
        line: i
      }
    }
    return;
  }, undefined as undefined | { line: number; index: number })

  if (!position) {
    return;
  }

  return position;
}

function bracketPair(vim: Vim, left: string, right: string): BracketPairMatch | undefined {
  // const startIndex = getStartIndex(vim, "{")
  // if (!startIndex) {
  // return
  // }

  //RIP performance
  const fullContent = vim.content.join("\n")
  const allBracketPairs = findMatchingBraces(fullContent, left, right)

  const closestBracketPairsOnSameLine = findClosestBracket(vim, allBracketPairs)
  console.log("choices", closestBracketPairsOnSameLine)
  if (!closestBracketPairsOnSameLine) {
    return
  }
  const closestPair = closestBracketPairsOnSameLine.reduce((closest, current) => {
    //BUG: always prioritze brackets left of cursor as you are already in a pair
    let closestDistance = Math.abs(closest.start.index - vim.cursor.pos.startIndex) +
      Math.abs(closest.start.line - vim.cursor.pos.startLine);
    let currentDistance = Math.abs(current.start.index - vim.cursor.pos.startIndex) +
      Math.abs(current.start.line - vim.cursor.pos.startLine);

    return currentDistance < closestDistance ? current : closest;
  });

  return {
    start: {
      index: closestPair.start.index + 1,
      line: closestPair.start.line
    },
    end: {
      index: closestPair.end.index - 1,
      line: closestPair.end.line
    }
  }
}


function findClosestBracket(vim: Vim, bracketPairs: BracketPairMatch[]) {
  if (bracketPairs.length === 0) {
    return;
  }

  const aboveLines = bracketPairs.filter(s => s.start.line < vim.cursor.pos.startLine)
  //if no abovelines, look forward
  if (aboveLines.length === 0) {
    const preClosestLines = findClosestLines(bracketPairs, bracketPairs, vim)
    if (preClosestLines.length === 0) {
      return []
    }

    return preClosestLines
  }

  const closestLines = findClosestLines(aboveLines, bracketPairs, vim)
  if (closestLines.length === 0) {
    return []
  }

  return closestLines
}

function findClosestLines(filteredLines: BracketPairMatch[], allLines: BracketPairMatch[], vim: Vim) {
  const closestLine = filteredLines.reduce((closest, current) => {
    return Math.abs(current.start.line - vim.cursor.pos.startLine) < Math.abs(closest.start.line - vim.cursor.pos.startLine) ? current : closest;
  });

  const closestLines = allLines.filter(s => s.start.line === closestLine.start.line)
  if (closestLines.length === 0) {
    return []
  }

  return closestLines
}


type BracketMatch = {
  index: number;
  line: number;
}

type BracketPairMatch = {
  start: BracketMatch;
  end: BracketMatch;
}

function findMatchingBraces(str: string, left: string, right: string) {
  const stack: BracketMatch[] = [];
  const pairs: { start: BracketMatch, end: BracketMatch }[] = [];
  let line = 0
  let indexOffset = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === left) {
      stack.push({ index: i - indexOffset, line });
    } else if (str[i] === right) {
      if (stack.length === 0) {
        // Unmatched closing brace, continue
        continue;
      }
      const start = stack.pop();
      if (!start) {
        continue
      }
      pairs.push({ start, end: { index: i - indexOffset, line } });
    } else if (str[i] === "\n") {
      line++
      indexOffset = i + 1
    }
  }

  if (stack.length !== 0) {
    console.log("Unmatched opening brace found.");
  }

  return pairs;
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


