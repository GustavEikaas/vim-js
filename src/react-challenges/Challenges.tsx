import { useState } from "react";
import { Button } from "./components/Button";
import { challenges } from './challenges/challenges'
import { MappingsUsed } from "./components/MappingsUsed";
import { VimChallenge } from "./VimChallenge";

export function Challenges() {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const isFinished = challengeIndex == challenges.length
  const [mappingsUsed, setMappingsUsed] = useState(0);
  const challenge = challenges[challengeIndex]

  if (isFinished) {
    const leastPossibleMappings = challenges.reduce((acc, curr) => acc + curr.strokes, 0 as number)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2>Finished</h2>
        <MappingsUsed least={leastPossibleMappings} spent={mappingsUsed} />
        <div>
          <Button onClick={() => setChallengeIndex(0)}>Try again</Button>
        </div>
      </div>)
  }

  if (!challenge) {
    return <div>Something went wrong</div>
  }

  return (
    <div>
      <div style={{ height: "20px" }}>{challengeIndex + 1}/{challenges.length}</div>
      <VimChallenge key={challenge.content + challenge.description} onFinished={(mappings) => {
        setChallengeIndex(challengeIndex + 1)
        setMappingsUsed(s => s + mappings)
      }} challenge={challenge} />
    </div>
  )
}
