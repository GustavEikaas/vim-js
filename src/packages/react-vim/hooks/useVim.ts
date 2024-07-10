import { useEffect, useState } from "react";
import { Vim } from "../../vim-js/vim";

export function useVim(vim: Vim) {

  const [content, setContent] = useState(vim.content);
  const [cursorPos, setCursorPos] = useState(vim.cursor.pos);
  const [mode, setMode] = useState(vim.mode);
  const [clipboard, setClipboard] = useState(vim.clipboard.content);
  const [mappingsExecuted, setMappingsExecuted] = useState(0);

  useEffect(() => {
    const controller = new AbortController()
    vim.addSubscriber((ev) => {
      switch (ev.event) {
        case "OnModeChange":
          setMode(ev.data.mode)
          break;

        case "OnMappingExecuted":
          setMappingsExecuted(s => s + 1)
          break;

        case "OnCursorMove":
          setCursorPos(ev.data.cursorPos)
          break;

        case "OnContentChange":
          setContent(ev.data.newContent)
          break;

        case "OnClipboardContentChange":
          setClipboard(ev.data.content)
          break;
      }
    }, controller.signal)
    return () => {
      controller.abort()
    }
  }, [vim])

  return {
    content,
    cursorPos,
    clipboard,
    mode,
    mappingsExecuted,
    vim
  }
}
