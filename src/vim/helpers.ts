import { CursorPosition } from "./vim";

type CaptureWordResult = {
  word: string;
  cursorPos: CursorPosition;
}

function aroundWord(content: string, cursorPos: CursorPosition): CaptureWordResult {
  if (cursorPos[0] !== cursorPos[1]) {
    throw new Error(`Around word can only be used with identical cursor positions\nExpected ${cursorPos[0]}:${cursorPos[0]}, Received: ${cursorPos[0]}:${cursorPos[1]}`);
  }

  const delimiters = /[\.,!?;:(){}=\[\]]/;
  const firstBoundDelimiters = /[\ .,!?;:(){}=\[\]]/;


  const isSpecialChar = delimiters.test(content.charAt(cursorPos[0]))

  let firstBound = cursorPos[0];
  while (firstBound > 0 && (isSpecialChar && firstBoundDelimiters.test(content.charAt(firstBound)))) {
    console.log(content.charAt(firstBound))
    firstBound--;
  }

  let lastBound = cursorPos[1];
  while (lastBound < content.length && (isSpecialChar && delimiters.test(content.charAt(lastBound)))) {
    console.log("yaayjhj")
    lastBound++;
  }


  if (content == "if (cursorPos [0] !== cursorPos[1]) {") {
    console.log(`first ${firstBound}, last ${lastBound}`)
  }
  const result = content.slice(firstBound, lastBound + 1);
  console.log(`${result} `, result.length)

  return {
    word: result,
    cursorPos: [firstBound, lastBound]
  };
}


function innerWord(content: string, cursorPos: CursorPosition): CaptureWordResult {
  const innerDelimiters = /[ \.,!?;:(){}=\[\]]/;
  if (cursorPos[0] !== cursorPos[1]) {
    throw new Error(`Inner word can only be used with identical cursor positions\n Expected ${cursorPos[0]}:${cursorPos[0]}, Recieved: ${cursorPos[0]}:${cursorPos[1]}`)
  }
  if (content.charAt(cursorPos[0]) == " ") {
    return { cursorPos, word: " " }
  }

  let firstBound = cursorPos[0];
  while (firstBound > 0 && !innerDelimiters.test(content.charAt(firstBound - 1))) {
    firstBound--;
  }

  //HACK: refactor this
  let lastBound = cursorPos[1];
  while (lastBound < content.length && !innerDelimiters.test(content.charAt(lastBound))) {
    lastBound++;
  }
  if (lastBound == cursorPos[1]) {
    lastBound++;
  }
  lastBound--;

  const result = content.slice(firstBound, lastBound + 1)
  return {
    word: result,
    cursorPos: [firstBound, lastBound]
  }
}


export const helpers = {
  innerWord,
  aroundWord
}
