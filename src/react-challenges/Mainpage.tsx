import { Challenges } from "./Challenges";

export function Mainpage() {

  return (
    <div className="flex h-screen w-full bg-selection flex-col justify-between items-center">
      <Heading />
      <Challenges />
      <div />
    </div>
  )
}

const Heading = () => {
  return (
    <div className="flex w-full h-12 justify-between items-center border-box p-2.5">
      <h1 className="text-4xl font-bold">Learn vim</h1>
    </div>
  )
}


