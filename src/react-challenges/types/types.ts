import { Vim } from "../../vim/vim";

export type Challenge = {
  description: string;
  content: string;
  expected: string | ((vim: Vim) => boolean);
  strokes: number;
}
