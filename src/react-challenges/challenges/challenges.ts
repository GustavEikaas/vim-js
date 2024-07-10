import { Challenge } from "../types/types";

export const challenges: Challenge[] = [
  {
    strokes: 1,
    description: "Delete line 1",
    content: "Once upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map",
    expected: "There was a little pig named Percy\nPercy loved adventures\nOne day, he found a map"
  },
  {
    strokes: 1,
    description: "Navigate to end of line 1",
    content: "Percy lived on a farm\nHe had many friends\nThey often played together\nLife was joyful",
    expected: (vim) => vim.cursor.pos.startLine == 0 && vim.cursor.pos.startIndex == vim.content[0].length - 1
  },
  {
    strokes: 1,
    description: "Enter insert mode",
    content: "Percy loved to explore\nEvery day was a new adventure\nHe discovered hidden paths\nAnd secret treasures",
    expected: (vim) => vim.mode === "Insert"
  },
  {
    strokes: 1,
    description: "Enter visual mode",
    content: "On a sunny day\nPercy found an old map\nIt led to a hidden treasure\nHis heart raced with excitement",
    expected: (vim) => vim.mode === "Visual"
  },
  {
    strokes: 2,
    description: "Copy line 3",
    content: "The map was ancient\nIt showed a forest\nDeep within the forest\nWas a treasure marked with an X",
    expected: (vim) => {
      return vim.clipboard.content === "Deep within the forest\n"
    }
  },
  {
    strokes: 1,
    description: "Create line above line 2",
    content: "Percy gathered his friends\nThey were excited\nTogether they set off\nOn a grand adventure",
    expected: (vim) => {
      return vim.content.length == 5 && vim.content[1] === " ";
    }
  },
  {
    strokes: 1,
    description: "Go to line 2",
    content: "The journey was long\nBut they were determined\nThey faced many challenges\nAnd overcame them all",
    expected: (vim) => {
      return vim.cursor.pos.startLine === 1;
    }
  },
  {
    strokes: 1,
    description: "Move cursor to the right",
    content: "At last, they arrived\nThe treasure was real\nThey couldn't believe their eyes\nIt was a dream come true",
    expected: (vim) => {
      return vim.cursor.pos.startIndex === 1
    }
  },
  {
    strokes: 1,
    description: "Navigate to end of buffer",
    content: "With the treasure found\nThey returned home\nTheir adventure was complete\nBut memories would last forever",
    expected: (vim) => vim.cursor.pos.startLine === vim.content.length - 1
  },
  {
    strokes: 2,
    description: "Navigate to end of line 3",
    content: "Percy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures",
    expected: (vim) => vim.cursor.pos.startLine == 2 && vim.cursor.pos.startIndex == vim.content[2].length - 1
  },
  {
    strokes: 1,
    description: "Open the command window",
    content: "Percy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures",
    expected: (vim) => vim.commandWindow.isOpen
  }
]
