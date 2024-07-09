import { useEffect, useState } from "react";
import { getContent } from "../helpers/get-content";
import { createVimInstance, Vim } from "../vim/vim";

export function useVim(init?: (vim: Vim) => void | Vim) {
  const [vim] = useState(() => {
    const vim = createVimInstance()
    init && init(vim)
    return vim;
  });

  const [content, setContent] = useState(getContent(vim));
  const [cursorPos, setCursorPos] = useState(vim.cursorPos);
  const [mode, setMode] = useState(vim.mode);
  const [clipboard, setClipboard] = useState(vim.clipboard.content);

  useEffect(() => {
    const controller = new AbortController()
    vim.addSubscriber((ev) => {
      switch (ev.event) {
        case "OnModeChange":
          setMode(ev.data.mode)
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
    vim
  }
}
