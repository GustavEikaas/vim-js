import styled from "styled-components";
import { Challenges } from "./Challenges";

export function Mainpage() {

  return (
    <StyledMainpage>
      <Heading />
      <Challenges />
      <div />
    </StyledMainpage>
  )
}

const Heading = () => {
  return (
    <StyledHeading>
      <h1>Learn vim</h1>
    </StyledHeading>
  )
}

const StyledHeading = styled.div`
  width: 100%;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
`

const StyledMainpage = styled.div`
  background: #44475a;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

