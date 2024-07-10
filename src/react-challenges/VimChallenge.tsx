import { useEffect, useState } from "react";
import { Challenge } from "./types/types";
import { MappingsUsed } from "./components/MappingsUsed";
import { createVimInstance } from "../packages/vim-js/vim";
import { Terminal } from "../packages/react-vim/Terminal";
import { useVim } from "../packages/react-vim/hooks/useVim";

type ChallengeProps = {
  challenge: Challenge;
  onFinished: (mappings: number) => void;
}

export const VimChallenge = ({ challenge, onFinished }: ChallengeProps) => {
  const [vim] = useState(() => {
    const i = createVimInstance().setContent(challenge.content.split("\n"))
    challenge.prepare && challenge.prepare(i)
    return i;
  })

  const { mappingsExecuted, cursorPos, content, mode, clipboard } = useVim(vim)

  useEffect(() => {
    if (typeof (challenge.expected) == "function" && challenge.expected(vim)) {
      onFinished(mappingsExecuted)
    }
    if (content.join("\n") == challenge.expected) {
      onFinished(mappingsExecuted)
    }
  }, [content, cursorPos, mode, clipboard, challenge.expected])


  return (
    <div style={{ width: "clamp(400px, 50vw, 70vw)" }}>
      <MappingsUsed spent={mappingsExecuted} least={challenge.strokes} />
      <div className="bg-current text-foreground p-4 text-xl">{challenge.description}</div>
      <Terminal vim={vim} />
    </div>
  );
};

