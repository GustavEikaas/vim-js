import { useLayoutEffect, useRef, useState } from "react"
import { useVim } from './hooks/useVim'
import styled, { keyframes } from 'styled-components';
import { Vim } from "../vim/vim";
import { draculaTheme } from "./theme/dracula";

const blink = keyframes`
  from, to {
    color: white;
  }
  50% {
    background-color: white;
    color: black;
  }
`;

const StyledWrapper = styled.div<{ $focus: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 500px;
  min-width: 50vw;
  filter: ${({ $focus }) => !$focus ? "opacity(50%)" : undefined};
  position: relative;
}
`

const CodePreviewContainer = styled.div`
  &:focus {
    outline: none;
  }
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

const LineNumbers = styled.div`
  position: absolute;
  left: 0px;
  top: 16px;
  bottom: 16px;
  width: 24px;
  text-align: right;
  color: ${draculaTheme.comment};
  pointer-events: none; /* Allow text selection without interfering */
  line-height: 1.5669
`;

const StyledCode = styled.code`
  .comment { color: ${draculaTheme.comment}; }
  .keyword { color: ${draculaTheme.pink}; }
  .string { color: ${draculaTheme.yellow}; }
  .variable { color: ${draculaTheme.orange}; }
  .function { color: ${draculaTheme.green}; }
  .operator { color: ${draculaTheme.purple}; }
  .number { color: ${draculaTheme.cyan}; }
`;

type TerminalProps = {
  vim: Vim;
}

export function Terminal({ vim }: TerminalProps) {
  const pRef = useRef<HTMLDivElement>(null)
  const { content, mode, cursorPos, isCommandOpen } = useVim(vim)
  const cRef = useRef<HTMLDivElement | null>(null);
  const commandRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false)

  const setRef = (ref: HTMLDivElement) => {
    if (cRef.current === ref) return;
    ref.onfocus = () => setIsFocused(true)
    ref.onblur = () => {
      if (!isCommandOpen) {
        setIsFocused(false)
      }
    }
    ref.focus()
    cRef.current = ref
  }

  useLayoutEffect(() => {
    pRef.current?.scrollIntoView({ behavior: "instant", block: "center" })
  }, [cursorPos])


  return (
    <StyledWrapper $focus={isFocused}>
      <CodePreviewContainer ref={ref => ref && setRef(ref)} tabIndex={0} onKeyDown={(e) => !vim.commandWindow.isOpen && vim.sendKey(e.key, { shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey })}>
        {isCommandOpen && (
          <StyledCommandWindow ref={ref => {
            if (!ref) return;
            if (commandRef.current == ref) return
            ref.onfocus = () => setIsFocused(true)
            ref.onblur = () => vim.commandWindow.toggle(false)
            ref.focus()
            commandRef.current = ref;
          }} />
        )}
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
  )
}
const StyledCommandWindow = styled.input`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 40px;
  border: 1px solid ${draculaTheme.cyan};
  outline: 1px solid ${draculaTheme.cyan};
  color: white;
  background: ${draculaTheme.background};
  display: flex;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
`
const getVimModeColor = (mode: Vim.Mode) => {
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
const StyledMode = styled.div<{ $mode: Vim.Mode }>`
  text-transform: uppercase;
  border-bottom-left-radius: inherit;
  height: 20px;
  width: 8ch;
  background-color: ${(props) => getVimModeColor(props.$mode)};
  text-align: center;
`

