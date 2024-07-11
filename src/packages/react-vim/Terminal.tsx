import { useLayoutEffect, useRef, useState } from "react"
import { useVim } from './hooks/useVim'
import styled from 'styled-components';
import { draculaTheme } from "./theme/dracula";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Lualine } from "./terminal/Lualine";
import { MemoVirtualLine } from "./terminal/VirtualLine";
import { Vim } from "../vim-js/vim";

type TerminalProps = {
  vim: Vim;
}

export function Terminal({ vim }: TerminalProps) {
  const { content, mode, cursorPos, sequence } = useVim(vim)
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
    count: content.length,
    getScrollElement: () => codeContainer.current,
    estimateSize: () => 20,
    paddingStart: 10,
  })

  useLayoutEffect(() => {
    rowVirtualizer.scrollToIndex(cursorPos.endLine, { align: "auto", behavior: "auto" })
  }, [cursorPos])


  return (
    <div style={{ filter: !isFocused ? "opacity(50%)" : undefined }} className="relative flex items-center flex-col h-500 w-full" >
      <pre
        className="focus:outline-none bg-background text-foreground box-border rounded-t-lg overflow-auto font-mono text-base leading-relaxed whitespace-pre relative min-w-full h-full"
        ref={ref => ref && setRef(ref)}
        tabIndex={0}
        onKeyDown={(e) => vim.sendKey(e.key, { shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey })}
      >
        <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => <MemoVirtualLine key={virtualItem.key} mode={mode} virtualItem={virtualItem} cursorPosition={cursorPos} content={content} />)}
        </div>
      </pre>
      <Lualine mode={mode} sequence={sequence} />
    </div>
  )
}

