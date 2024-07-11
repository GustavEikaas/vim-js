import { VirtualItem } from "@tanstack/react-virtual"
import styled, { css, keyframes } from "styled-components";
import { draculaTheme } from "../theme/dracula";
import { Vim } from "../../vim-js/vim";

type VirtualLineProps = {
  virtualItem: VirtualItem<Element>;
  content: string[];
  cursorPosition: Vim.CursorPosition
  mode: Vim.Mode;
}
function VirtualLine({ virtualItem, mode, content, cursorPosition }: VirtualLineProps) {
  const line = content[virtualItem.index]
  const { pre, hl, post } = getHl(cursorPosition, line, virtualItem.index)
  return (
    <StyledVirtualLine
      $height={virtualItem.size}
      $start={virtualItem.start}
      $line={`${virtualItem.index + 1}`}
      key={virtualItem.key}
    >
      {pre}<StyledHighlightRange $single={mode === "Normal"}>{hl.at(0) === "" ? " " : hl}</StyledHighlightRange>{post}
    </StyledVirtualLine>
  )
}

//TODO: should be memoed at some point, not doing it yet to avoid bugs and confusion
export const MemoVirtualLine = VirtualLine

function getHl(pos: Vim.CursorPosition, line: string, index: number) {
  if (index === 7) {
    // debugger;
  }
  if (pos.startLine < index && pos.endLine > index) {
    return {
      pre: "",
      hl: line,
      post: ""
    }
  }
  if (pos.startLine <= index && pos.endLine >= index) {
    const end = pos.endLine > index ? undefined : pos.endIndex + 1
    const startIndex = pos.startLine !== pos.endLine && index === pos.endLine ? 0 : pos.startIndex 
    return {
      pre: line.slice(0, startIndex),
      hl: line.slice(startIndex, end),
      post: end ? line.slice(end) : ""
    }
  }
  return {
    pre: line,
    hl: "",
    post: ""
  }
}

const StyledVirtualLine = styled.code<{ $height: number; $start: number; $line: string; }>`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: ${(props) => `${props.$height}px`};
  transform: translateY(${({ $start }) => `${$start}px`});

  &:before {
    position: relative;
    top: 0;
    left: 0;
    width: 30px;
    display: inline-flex;
    justify-content: end;
    padding-right: 7px;
    color: ${draculaTheme.comment};
    height: ${(props) => `${props.$height}px`};
    content: '${(props) => props.$line}';
  }
`

const blink = keyframes`
  from, to {
    color: white;
  }
  50% {
    background-color: white;
    color: black;
  }
`;

const normalModeCursor = css`
  animation: ${blink} 1s step-end infinite;
`

const visualSelection = css`
  background-color: white;
  color: black;
`

const StyledHighlightRange = styled.span<{ $single: boolean }>`
  ${props => (props.$single ? normalModeCursor : visualSelection)};
`
