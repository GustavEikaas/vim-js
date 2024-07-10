import { Vim } from "../../vim-js/vim"

const getVimModeColor = (mode: Vim.Mode) => {
  switch (mode) {
    case "Normal":
      return "bg-purple"
    case "Insert":
      return "bg-green"
    case "Visual":
    case "V-Block":
      return "bg-yellow"
  }
}


function formatSequence(keypress: Vim.SequenceHistory) {
  if (keypress.alt || keypress.ctrl || keypress.shift) {
    return `<${keypress.ctrl ? "C-" : ""}${keypress.shift ? "S-" : ""}${keypress.alt ? "A-" : ""}${keypress.key}>`
  }
  return keypress.key
}

type LualineProps = {
  mode: Vim.Mode;
  sequence: Vim.SequenceHistory[]
}
export function Lualine({ mode, sequence }: LualineProps) {

  return (
    <div className="flex justify-between w-full box-border bg-background rounded-b-lg">
      <div className={`uppercase rounded-bl-lg h-5 w-[8ch] ${getVimModeColor(mode)} text-center`}>{mode}</div>
      <div className={`rounded-br-lg h-5 w-[8ch] ${getVimModeColor(mode)} text-left`}>{sequence.map(s => formatSequence(s)).join("")}</div>
    </div>

  )
}

