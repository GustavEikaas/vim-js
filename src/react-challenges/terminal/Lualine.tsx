import styled from "styled-components";
import { Vim } from "../../vim/vim";
import { draculaTheme } from "../theme/dracula";

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

type LualineProps = {
  mode: Vim.Mode;
}
export function Lualine({ mode }: LualineProps) {
  return (
    <StyledLuaLine>
      <StyledMode $mode={mode}>{mode}</StyledMode>
    </StyledLuaLine>

  )
}

