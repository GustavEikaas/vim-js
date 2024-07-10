import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button {...props} className="rounded-lg border-none bg-purple text-foreground py-2 px-4 text-sm cursor-pointer transition-colors duration-300 ease-in-out hover:bg-background active:bg-pink focus:outline-none">
      {children}
    </button>
  )
}
