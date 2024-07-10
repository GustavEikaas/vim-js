import { useLayoutEffect, useRef, useState } from "react"
import { useVim } from './hooks/useVim'
import styled from 'styled-components';
import { Vim } from "../vim/vim";
import { draculaTheme } from "./theme/dracula";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Lualine } from "./terminal/Lualine";
import { MemoVirtualLine } from "./terminal/VirtualLine";

type TerminalProps = {
  vim: Vim;
}

export function Terminal({ vim }: TerminalProps) {
  const { content, mode, cursorPos } = useVim(vim)
  const codeContainer = useRef<HTMLElement | null>(null);
  const [isFocused, setIsFocused] = useState(false)

  const setRef = (ref: HTMLElement) => {
    if (codeContainer.current === ref) return;
    ref.onfocus = () => setIsFocused(true)
    ref.onblur = () => setIsFocused(false)
    ref.focus()
    codeContainer.current = ref
  }

  const rowVirtualizer = useVirtualizer({
    count: content.content.length,
    getScrollElement: () => codeContainer.current,
    estimateSize: () => 20,
  })

  useLayoutEffect(() => {
    rowVirtualizer.scrollToIndex(cursorPos.endLine, { align: "auto", behavior: "auto" })
  }, [cursorPos])


  return (
    <StyledWrapper $focus={isFocused}>
      <CodePreviewContainer style={{ height: `100%` }} ref={ref => ref && setRef(ref)} tabIndex={0} onKeyDown={(e) => vim.sendKey(e.key, { shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey })}>
        <VirtualContainer $height={rowVirtualizer.getTotalSize()}>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => <MemoVirtualLine virtualItem={virtualItem} cursorPosition={cursorPos} content={content.content} />)}
        </VirtualContainer>
      </CodePreviewContainer>
      <Lualine mode={mode} />
    </StyledWrapper>
  )
}

const VirtualContainer = styled.div<{ $height: number }>`
  height: ${(props) => `${props.$height}px`};
  width: 100%;
  position: relative;
`

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

const CodePreviewContainer = styled.pre`
  &:focus {
    outline: none;
  }
  background: ${draculaTheme.background};
  color: ${draculaTheme.foreground};
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
