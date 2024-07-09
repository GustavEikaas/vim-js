import styled from "styled-components";
import { draculaTheme } from "../theme/dracula";

export const Button = styled.button`
  background-color: ${draculaTheme.purple};
  color: ${draculaTheme.foreground};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${draculaTheme.cyan};
  }

  &:active {
    background-color: ${draculaTheme.pink};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${draculaTheme.pink};
  }
`;
