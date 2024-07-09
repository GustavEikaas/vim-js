import styled from "styled-components";
import { Challenges } from "./Challenges";

export function Mainpage() {

  return (
    <StyledMainpage>
      <div>Im a heading</div>
      <Challenges />
      <div>Im a footing</div>
    </StyledMainpage>
  )
}

const StyledMainpage = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
