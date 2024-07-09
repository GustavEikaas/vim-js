import { useEffect, useLayoutEffect, useRef } from "react"
import styled, { keyframes } from 'styled-components';
import { useVim } from "../hooks/useVim";
import { Vim, VimMode } from "../vim/vim";

export const draculaTheme = {
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
  &:focus {
    outline: none;
    box-shadow: none;
  }
  box-shadow: 0px 0px 2px red;
  background: ${draculaTheme.background};
  color: ${draculaTheme.foreground};
  padding: 16px;
  box-sizing: border-box;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
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

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: ${draculaTheme.background};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${draculaTheme.comment};
    border-radius: 10px;
    border: 3px solid ${draculaTheme.selection};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${draculaTheme.green};
  }
`;

const StyledHighlightRange = styled.span`
animation: ${blink} 1s step-end infinite;
`

export type Challenge = {
  description: string;
  content: string;
  expected: string | ((vim: Vim) => boolean);
  strokes: number;
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
  font-size: 14px;
  line-height: 1.5;
`;

export const Challenge = ({ challenge, onFinished }: ChallengeProps) => {
  const pRef = useRef<HTMLDivElement>(null)
  const { vim, content, mode, clipboard, cursorPos, mappingsExecuted } = useVim((v) => v.setContent(challenge.content.split("\n")))

  useEffect(() => {
    if (typeof (challenge.expected) == "function" && challenge.expected(vim)) {
      onFinished()
    }
    if (content.content.join("\n") == challenge.expected) {
      onFinished()
    }
  }, [content, mode, clipboard, challenge.expected])

  useLayoutEffect(() => {
    pRef.current?.scrollIntoView({ behavior: "instant", block: "center" })
  }, [cursorPos])

  return (
    <StyledWrapper>
      <MappingsUsed mappingsExecuted={mappingsExecuted} challenge={challenge} />
      <ProblemDescriptionContainer>{challenge.description}</ProblemDescriptionContainer>
      <CodePreviewContainer ref={ref => { ref && ref.focus() }} tabIndex={0} onKeyDown={(e) => {
        e.preventDefault()
        vim.sendKey(e.key)
      }}>
        <LineNumbers>
          {content.content.map((_, i) => `${i + 1}\n`)}
        </LineNumbers>
        <StyledCode>
          {content.before.join("\n")}
          <StyledHighlightRange ref={pRef}>{content.highlighted.at(0) == "" ? " " : content.highlighted.join("\n")}</StyledHighlightRange>
          {content.after.join("\n")}
        </StyledCode>
      </CodePreviewContainer>
      <StyledLuaLine>
        <StyledMode $mode={mode}>{mode}</StyledMode>
      </StyledLuaLine>
    </StyledWrapper>
  );
};

type MappingsUsedProps = {
  mappingsExecuted: number;
  challenge: Challenge;
}
const MappingsUsed = ({ mappingsExecuted, challenge }: MappingsUsedProps) => {
  return (<div>Mappings used: <span style={{ color: mappingsExecuted > challenge.strokes ? draculaTheme.red : "inherit" }}>{mappingsExecuted}</span>/{challenge.strokes}</div>)
}

const getVimModeColor = (mode: VimMode) => {
  switch (mode) {
    case "Normal":
      return draculaTheme.purple;
    case "Insert":
      return draculaTheme.green;
    case "Visual":
      return draculaTheme.yellow;
  }
  return draculaTheme.cyan;
}

const StyledLuaLine = styled.div`
  display: flex;
  justifyContent: flex-start;
  width: 100%;
  box-sizing: border-box;
  background-color: ${draculaTheme.background};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`
const StyledMode = styled.div<{ $mode: VimMode }>`
border-bottom-left-radius: inherit;
height: 20px;
width: 8ch;
background-color: ${(props) => getVimModeColor(props.$mode)};
text-align: center;
`

const StyledWrapper = styled.div`
display: flex;
align-items: center;
flex-direction: column;
height: 500px;
min-width: 50vw;
`
