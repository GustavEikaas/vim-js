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
  const [vim] = useState(() => createVimInstance().setContent(challenge.content.split("\n")))
  const { mappingsExecuted, content, mode, clipboard, isCommandOpen } = useVim(vim)

  useEffect(() => {
    if (typeof (challenge.expected) == "function" && challenge.expected(vim)) {
      onFinished(mappingsExecuted)
    }
    if (content.content.join("\n") == challenge.expected) {
      onFinished(mappingsExecuted)
    }
  }, [content, mode, clipboard, challenge.expected, isCommandOpen])


  return (
    <div>
      <MappingsUsed spent={mappingsExecuted} least={challenge.strokes} />
      <ProblemDescriptionContainer>{challenge.description}</ProblemDescriptionContainer>
      <Terminal vim={vim} />
    </div>
  );
};

