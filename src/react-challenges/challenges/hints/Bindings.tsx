export type BindingType = "change" | "motion" | "visual"

export type Bindings = keyof typeof bindings

export const bindings = {
  F: {
    binding: "F",
    type: "motion",
  },
  f: {
    binding: "f",
    type: "motion",
  },
  x: {
    binding: "x",
    type: "change",
  },
  j: {
    binding: "j",
    type: "motion",
  },
  gg: {
    binding: "gg",
    type: "motion",
  },
  yy: {
    binding: "yy",
    type: "change",
  },
  dd: {
    binding: "dd",
    type: "change",
  },
  G: {
    binding: "G",
    type: "motion",
  },
  g: {
    binding: "g",
    type: "motion",
  },
  r: {
    binding: "r",
    type: "change",
  },
  "<Left>": {
    binding: "ArrowLeft",
    type: "motion",
  },
  "<Down>": {
    binding: "ArrowDown",
    type: "motion",
  },
  "<Up>": {
    binding: "ArrowUp",
    type: "motion",
  },
  "<Right>": {
    binding: "ArrowRight",
    type: "motion",
  },
  h: {
    binding: "h",
    type: "motion",
  },
  k: {
    binding: "k",
    type: "motion",
  },
  l: {
    binding: "l",
    type: "motion",
  },
  u: {
    binding: "u",
    type: "change",
  },
  "^": {
    binding: "^",
    type: "motion",
  },
  _: {
    binding: "_",
    type: "motion",
  },
  "-": {
    binding: "-",
    type: "motion",
  },
  "0": {
    binding: "0",
    type: "motion",
  },
  "$": {
    binding: "$",
    type: "motion",
  },
  a: {
    binding: "a",
    type: "motion",
  },
  i: {
    binding: "i",
    type: "motion",
  },
  V: {
    binding: "V",
    type: "visual",
  },
  v: {
    binding: "v",
    type: "visual",
  },
  O: {
    binding: "O",
    type: "change",
  },
  o: {
    binding: "o",
    type: "change",
  },
  p: {
    binding: "p",
    type: "change",
  },
  "<c-s-q>": {
    binding: "<c-s-q>",
    type: "motion",
  },
  'a{': {
    binding: 'a{',
    type: "motion"
  },
  'a(': {
    binding: 'a(',
    type: "motion"
  },
  'a}': {
    binding: 'a}',
    type: "motion"
  },
  'a)': {
    binding: 'a)',
    type: "motion"
  },
  "a'": {
    binding: "a'",
    type: "motion"
  },
  'a`': {
    binding: 'a`',
    type: "motion"
  },
  'a"': {
    binding: 'a"',
    type: "motion"
  },
  'i{': {
    binding: 'i{',
    type: "motion"
  },
  'i}': {
    binding: 'i}',
    type: "motion"
  },
  'i(': {
    binding: 'i(',
    type: "motion"
  },
  'i)': {
    binding: 'i)',
    type: "motion"
  },
  'i"': {
    binding: 'i"',
    type: "motion"
  },
  "i'": {
    binding: "i'",
    type: "motion"
  },
  'i`': {
    binding: 'i`',
    type: "motion"
  },
} as const;

type BindingProps = {
  motion: string;
}
export const Binding = ({ motion }: BindingProps) => {
  const link = `https://vimhelp.org/${bindings[motion as Bindings].type}.txt.html#${encodeURIComponent(motion)}`
  return (<a className="text-cyan underline" href={link} target="_blank">{motion}</a>)
}
