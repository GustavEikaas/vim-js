import { useEffect, useRef, useState } from "react";
import { Challenge } from "./types/types";
import { MappingsUsed } from "./components/MappingsUsed";
import { createVimInstance } from "../packages/vim-js/vim";
import { Terminal } from "../packages/react-vim/Terminal";
import { useVim } from "../packages/react-vim/hooks/useVim";
import { Binding } from "./challenges/hints/Bindings";

type ChallengeProps = {
  challenge: Challenge;
  onFinished: (mappings: number) => void;
}

export const VimChallenge = ({ challenge, onFinished }: ChallengeProps) => {
  const [vim] = useState(() => {
    const i = createVimInstance().setContent(challenge.content.split("\n"))
    challenge.prepare && challenge.prepare(i)
    return i;
  })

  const { mappingsExecuted, cursorPos, content, mode, clipboard } = useVim(vim)

  useEffect(() => {
    if (typeof (challenge.expected) == "function" && challenge.expected(vim)) {
      onFinished(mappingsExecuted)
    }
    if (content.join("\n") == challenge.expected) {
      onFinished(mappingsExecuted)
    }
  }, [content, cursorPos, mode, clipboard, challenge.expected])


  return (
    <div style={{ width: "clamp(400px, 50vw, 70vw)" }}>
      <MappingsUsed spent={mappingsExecuted} least={challenge.strokes} />
      <span className="flex items-center justify-between">
        <div className="bg-current text-foreground p-4 text-xl">{challenge.description}</div>
        {mappingsExecuted > challenge.strokes && challenge.hint && (
          <Popover bindings={challenge.hint}>Hint</Popover>
        )}
      </span>
      <Terminal vim={vim} />
    </div>
  );
};

const Popover = ({ bindings, children }: React.PropsWithChildren<{ bindings: string[] }>) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-white bg-foreground rounded-md focus:outline-none"
      >
        {children}
      </button>
      {isOpen && (
        <div className="absolute whitespace-break-spaces z-10 w-64 p-4 mt-2 bg-background text-foreground rounded-md shadow-lg">
          Bindings:
          <br />
          {bindings.map(s => <><Binding motion={s} /><br /></>)}
        </div>
      )}
    </div>
  );
};
