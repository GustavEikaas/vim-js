import { useEffect, useLayoutEffect, useRef, useState } from "react"
import styled, { keyframes } from 'styled-components';
import { useVim } from "../hooks/useVim";
import { Vim } from "../vim/vim";

const draculaTheme = {
  background: '#282a36',
  currentLine: '#44475a',
  selection: '#44475a',
  foreground: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c',
};

const blink = keyframes`
  from, to {
    color: white;
  }
  50% {
    background-color: white;
    color: black;
  }
`;

const CodePreviewContainer = styled.div`
  background: ${draculaTheme.background};
  color: ${draculaTheme.foreground};
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre;
  counter-reset: line;
  position: relative;
  padding-left: 40px; /* Space for line numbers */
  min-width: 100%;
  min-height: 50%;
`;

// Styled component for syntax highlighting
const StyledCode = styled.code`
  .comment { color: ${draculaTheme.comment}; }
  .keyword { color: ${draculaTheme.pink}; }
  .string { color: ${draculaTheme.yellow}; }
  .variable { color: ${draculaTheme.orange}; }
  .function { color: ${draculaTheme.green}; }
  .operator { color: ${draculaTheme.purple}; }
  .number { color: ${draculaTheme.cyan}; }
`;

const ProblemDescriptionContainer = styled.div`
  background: ${draculaTheme.currentLine};
  color: ${draculaTheme.foreground};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
`;


const StyledHighlightRange = styled.span`
animation: ${blink} 1s step-end infinite;
`

export type Challenge = {
  description: string;
  content: string;
  expected: string | ((vim: Vim) => boolean);
}

const LineNumbers = styled.div`
  position: absolute;
  left: 0px;
  top: 16px;
  bottom: 16px;
  width: 24px;
  text-align: right;
  color: ${draculaTheme.comment};
  pointer-events: none; /* Allow text selection without interfering */
  line-height: 1.57
`;
type ChallengeProps = {
  challenge: Challenge;
  onFinished: () => void;
}
export const Challenge = ({ challenge, onFinished }: ChallengeProps) => {
  const pRef = useRef<HTMLDivElement>(null)
  const { vim, content, mode, clipboard, cursorPos } = useVim((v) => {
    v.setContent(challenge.content.split("\n"))
  })

  useEffect(() => {
    if (typeof (challenge.expected) == "function" && challenge.expected(vim)) {
      onFinished()
    }
    if (content.content.join("\n") == challenge.expected) {
      onFinished()
    }
  }, [content, mode, clipboard, challenge.expected])

  useLayoutEffect(() => {
    const abortController = new AbortController()
    addEventListener("keydown", (event) => {
      vim.sendKey(event.key)
    }, { signal: abortController.signal })

    return () => {
      abortController.abort()
    }
  }, [vim])


  useLayoutEffect(() => {
    pRef.current?.scrollIntoView({ behavior: "instant", block: "center" })
  }, [cursorPos])

  return (
    <StyledWrapper>
      <ProblemDescriptionContainer>{challenge.description}</ProblemDescriptionContainer>
      <CodePreviewContainer>
        <LineNumbers>
          {content.content.map((_, i) => `${i + 1}\n`)}
        </LineNumbers>
        <StyledCode>
          {content.before.join("\n")}
          <StyledHighlightRange ref={pRef}>{content.highlighted.at(0) == "" ? " " : content.highlighted.join("\n")}</StyledHighlightRange>
          {content.after.join("\n")}
        </StyledCode>
      </CodePreviewContainer>
      <div>{mode}</div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
display: flex;
align-items: center;
flex-direction: column;
height: 500px;
width: 500px;
`
