import { expect, test } from 'vitest'
import { helpers } from "./helpers"

test("[IW] hello", () => {
  const test = "Hello im a woman"
  const index = 3; //l
  const { word, cursorPos } = helpers.innerWord(test, [index, index])
  expect(word).toBe("Hello")
  expect(cursorPos[0]).toBe(0)
  expect(cursorPos[1]).toBe(4)
})

test("[IW] whitespace", () => {
  const test = "Hello im a woman"
  const index = 5; //l
  const { word, cursorPos } = helpers.innerWord(test, [index, index])
  expect(word).toBe(" ")
  expect(cursorPos[0]).toBe(5)
  expect(cursorPos[1]).toBe(5)
})


test("[IW delimiter] .", () => {
  const test = "Hello . im a woman"
  const index = 6; //l
  const { word, cursorPos } = helpers.innerWord(test, [index, index])
  expect(word).toBe(".")
  expect(cursorPos[0]).toBe(6)
  expect(cursorPos[1]).toBe(6)
})



test("[AW delimiter] whitespace", () => {
  const test = "if (cursorPos [0] !== cursorPos[1]) {"
  const index = 4
  const { word, cursorPos } = helpers.aroundWord(test, [index, index])
  expect(word).toBe("cursorPos ")
  expect(cursorPos[0]).toBe(4)
  expect(cursorPos[1]).toBe(13)
})

test("[AW delimiter] !== ", () => {
  const test = "if (cursorPos[0] !== cursorPos[1]) {"
  const index = 17
  const { word, cursorPos } = helpers!.aroundWord(test, [index, index])
  expect(word).toBe("!== ")
  expect(cursorPos[0]).toBe(17)
  expect(cursorPos[1]).toBe(20)
})
