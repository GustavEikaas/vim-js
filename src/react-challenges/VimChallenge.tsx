import { useEffect, useState } from "react";
import { createVimInstance } from "../vim/vim";
import { useVim } from "./hooks/useVim";
import { Terminal } from "./Terminal";
import { draculaTheme } from "./theme/dracula";
import styled from "styled-components";
import { Challenge } from "./types/types";
import { MappingsUsed } from "./components/MappingsUsed";

const ProblemDescriptionContainer = styled.div`
  background: ${draculaTheme.currentLine};
  color: ${draculaTheme.foreground};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
`;

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
      <ProblemDescriptionContainer>{challenge.description}</ProblemDescriptionContainer>
      <Terminal vim={vim} />
    </div>
  );
};

