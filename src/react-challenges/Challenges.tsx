import { useState } from "react";
import { Challenge } from "./Terminal";
import { Vim } from "../vim/vim";

const challenges: Challenge[] = [
  {
    strokes: 1,
    description: "Delete line 1",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: "How are you?\nIm good how bout u\nman im good aswell"
  },
  {
    strokes: 1,
    description: "Enter insert mode",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => vim.mode === "Insert"
  },
  {
    strokes: 1,
    description: "Enter visual mode",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => vim.mode === "Visual"
  },
  {
    strokes: 3,
    description: "Copy line 3",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => {
      return vim.clipboard.content === "Im good how bout u\n"
    }
  },
  {
    strokes: 1,
    description: "Create line above line 2",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => {
      return vim.content.length == 5 && vim.content[1] === " ";
    }
  },
  {
    strokes: 1,
    description: "Go to line 2",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => {
      return vim.cursorPos.startLine === 1;
    }
  },
  {
    strokes: 1,
    description: "Move cursor to the right",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => {
      return vim.cursorPos.startIndex === 1
    }
  },
  {
    strokes: 3,
    description: "Copy line 3",
    content: "Hello\nHow are you?\nIm good how bout u\nman im good aswell",
    expected: (vim: Vim) => {
      return vim.clipboard.content === "Im good how bout u\n"
    }
  },

]
export function Challenges() {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const challenge = challenges[challengeIndex]
  if (!challenge) {
    return <div>Congratulations</div>
  }
  return (
    <div>
      <div style={{ height: "20px" }}>{challengeIndex + 1}/{challenges.length}</div>
      <Challenge key={challenge.content + challenge.description} onFinished={() => {
        setChallengeIndex(challengeIndex + 1)
      }} challenge={challenge} />
    </div>
  )
}
