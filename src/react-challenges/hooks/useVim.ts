import { useEffect, useState } from "react";
import { Vim } from "../../vim/vim";
import { getContent } from "../../helpers/get-content";

export function useVim(vim: Vim) {
  const [isCommandOpen, setIsCommandOpen] = useState(vim.commandWindow.isOpen);
  const [content, setContent] = useState(getContent(vim));
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

        case "OnCommandToggle":
          setIsCommandOpen(ev.data.open)
          break;

        case "OnMappingExecuted":
          setMappingsExecuted(s => s + 1)
          break;

        case "OnCursorMove":
          setCursorPos(ev.data.cursorPos)
          setContent(getContent(vim))
          break;

        case "OnContentChange":
          setContent(getContent(vim))
          break;

        case "OnClipboardContentChange":
          console.log("Clipboard change")
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
    isCommandOpen,
    vim
  }
}
