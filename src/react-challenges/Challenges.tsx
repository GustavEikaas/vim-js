import { useState } from "react";
import { Button } from "./components/Button";
import { challenges } from './challenges/challenges'
import { MappingsUsed } from "./components/MappingsUsed";
import { VimChallenge } from "./VimChallenge";

export function Challenges() {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [animation, setAnimation] = useState(true)
  const isFinished = challengeIndex == challenges.length
  const [mappingsUsed, setMappingsUsed] = useState(0);
  const challenge = challenges[challengeIndex]

  if (isFinished) {
    const leastPossibleMappings = challenges.reduce((acc, curr) => acc + curr.strokes, 0 as number)
    return (
      <div className="flex flex-col gap-2.5">
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
    <div className="h-full flex w-full justify-center items-center flex-col">
      <div>Challenge: {challengeIndex + 1}/{challenges.length}</div>
      <VimChallenge key={challenge.content + challenge.description} onFinished={(mappings) => {
        const inc = () => {
          setChallengeIndex(challengeIndex + 1)
          setMappingsUsed(s => s + mappings)
        }
        animation ? setTimeout(inc, 300) : inc()
      }} challenge={challenge} />
      <Button onClick={() => setChallengeIndex(challenges.length)}>Speedrun</Button>
      <AnimationSelector animation={animation} setAnimation={setAnimation} />
    </div>
  )
}

type AnimationSelectorProps = {
  animation: boolean;
  setAnimation: (animation: boolean) => void;
}
const AnimationSelector = ({ animation, setAnimation }: AnimationSelectorProps) => {
  return (
    <div className="flex flex-col absolute bottom-0 right-0">
      Animation
      <span>
        <input type="radio" checked={!!animation} onChange={() => setAnimation(true)} /> Smooth
      </span>
      <span>
        <input type="radio" checked={!animation} onChange={() => setAnimation(false)} /> Instant
      </span>
    </div>

  )
}
