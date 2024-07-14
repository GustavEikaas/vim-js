import { Vim } from "../vim";

export function getInnerPos(vim: Vim, left: string, right: string): Vim.CursorPosition | undefined {
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
    startIndex: closestPair.start.index + 1,
    startLine: closestPair.start.line,
    endIndex: closestPair.end.index - 1,
    endLine: closestPair.end.line,
    offset: 0
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
