import { Vim } from "../../packages/vim-js/vim";

export type Challenge = {
  description: string;
  content: string;
  expected: string | ((vim: Vim) => boolean);
  strokes: number;
  prepare?: (vim: Vim) => void;
}
