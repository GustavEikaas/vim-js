import { Challenge } from "../types/types";

export const challenges: Challenge[] = [
  {
    strokes: 1,
    description: "Remove char under cursor",
    content: "Once upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    expected: "nce upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
  },
  {
    strokes: 1,
    description: "Delete line 1",
    content: "Once upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    expected: "There was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward"
  },
  {
    strokes: 1,
    description: "Navigate to end of line 1",
    content: "Percy lived on a farm\nHe had many friends\nThey often played together\nLife was joyful\nThe farm was large and full of life\nThere were cows, chickens, and horses\nEach day brought new fun and games\nPercy was always the leader\nHe loved organizing adventures\nSometimes they would explore the woods\nOther times they played by the river\nNo matter what they did\nThey always had a great time\nThe bond between Percy and his friends\nWas strong and unbreakable\nThey knew they could rely on each other",
    expected: (vim) => vim.cursor.pos.startLine == 0 && vim.cursor.pos.startIndex == vim.content[0].length - 1
  },
  {
    strokes: 1,
    description: "Move cursor to start of line",
    content: "Once upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    prepare: (vim) => {
      vim.cursor.setLineIndexNormal(-1, "absolute")
    },
    expected: (vim) => {
      return vim.cursor.pos.startLine === 0 && vim.cursor.pos.startIndex === 0
    }
  },
  {
    strokes: 1,
    description: "Enter insert mode",
    content: "Percy loved to explore\nEvery day was a new adventure\nHe discovered hidden paths\nAnd secret treasures\nExploration was in his blood\nHe couldn't stay in one place for long\nThe thrill of the unknown\nAlways called out to him\nEach discovery made him happier\nHe kept a journal of his adventures\nWriting down every detail\nSo he could relive the moments\nHis friends admired his courage\nAnd often joined him on his journeys\nTogether, they made wonderful memories\nThat they would cherish forever",
    expected: (vim) => vim.mode === "Insert"
  },
  {
    strokes: 1,
    description: "Enter visual mode",
    content: "On a sunny day\nPercy found an old map\nIt led to a hidden treasure\nHis heart raced with excitement\nHe quickly gathered his friends\nThey planned their journey carefully\nThey packed food and water\nAnd set off early in the morning\nThe sun was shining brightly\nAs they walked through the fields\nThey sang songs and told stories\nThe journey was long but enjoyable\nThey faced obstacles along the way\nBut their spirits remained high\nThe thought of the treasure\nKept them motivated and eager",
    expected: (vim) => vim.mode === "Visual"
  },
  {
    strokes: 2,
    description: "Copy line 3",
    content: "The map was ancient\nIt showed a forest\nDeep within the forest\nWas a treasure marked with an X\nPercy and his friends entered the forest\nIt was dark and mysterious\nThe trees were tall and dense\nThey followed the map closely\nTheir hearts were pounding with excitement\nThey knew they were getting closer\nThe forest was full of strange sounds\nBut they stayed together and kept going\nThe treasure was somewhere ahead\nThey just had to find the X\nIt was a true test of their determination",
    expected: (vim) => { return vim.clipboard.content === "Deep within the forest\n" }
  },
  {
    strokes: 1,
    description: "Create line above line 2",
    content: "Percy gathered his friends\nThey were excited\nTogether they set off\nOn a grand adventure\nThey followed the map's directions\nEach step brought them closer\nThe journey was tough but rewarding\nThey encountered many challenges\nBut their friendship kept them strong\nThey shared stories and laughter\nMaking the trip enjoyable\nThey knew they would reach the treasure\nBecause they had each other\nTheir bond was their greatest strength\nAnd it helped them overcome every obstacle",
    expected: (vim) => { return vim.content.length == 16 && vim.content[1] === " "; }
  },
  {
    strokes: 1,
    description: "Go to line 2",
    content: "The journey was long\nBut they were determined\nThey faced many challenges\nAnd overcame them all\nWith each obstacle, they grew stronger\nTheir teamwork was impeccable\nThey navigated through forests\nClimbed steep mountains\nAnd crossed wide rivers\nEvery step brought them closer\nTo the treasure they sought\nTheir hard work and perseverance\nPaid off in the end\nThey knew the treasure was near\nAnd that kept their spirits high\nThey were ready for whatever lay ahead",
    expected: (vim) => { return vim.cursor.pos.startLine === 1; }
  },
  {
    strokes: 1,
    description: "Move cursor to the right",
    content: "At last, they arrived\nThe treasure was real\nThey couldn't believe their eyes\nIt was a dream come true\nThe chest was filled with gold\nAnd precious gems of all kinds\nThey celebrated their success\nHugging and cheering with joy\nAll their hard work had paid off\nThey had found the treasure\nThat was thought to be a myth\nTheir adventure was a huge success\nThey would tell this story\nFor generations to come\nThe treasure was valuable\nBut the journey was priceless",
    expected: (vim) => { return vim.cursor.pos.startIndex === 1; }
  },
  {
    strokes: 1,
    description: "Navigate to end of buffer",
    content: "With the treasure found\nThey returned home\nTheir adventure was complete\nBut memories would last forever\nThey shared the treasure\nWith everyone in their village\nTheir story inspired many\nTo pursue their own adventures\nThey became legends in their own right\nPercy's name was known far and wide\nFor his bravery and leadership\nHe proved that with determination\nAnd good friends by your side\nYou can achieve anything\nTheir journey was over\nBut their legacy would live on\nIn the hearts of those who heard their talePercy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures\nPercy never shied away from a challenge\nHe believed in facing fears head-on\nEvery new place he discovered\nBrought him immense joy\nHe had a natural sense of direction\nWhich always amazed his friends\nThey trusted him completely\nAnd were always ready to follow\nNo matter how tough the journey\nPercy's leadership shone through\nTogether, they created unforgettable memories\nAnd shared countless joyous moments",
    expected: (vim) => vim.cursor.pos.startLine === vim.content.length - 1
  },
  {
    strokes: 2,
    description: "Navigate to end of line 3",
    content: "Percy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures\nPercy never shied away from a challenge\nHe believed in facing fears head-on\nEvery new place he discovered\nBrought him immense joy\nHe had a natural sense of direction\nWhich always amazed his friends\nThey trusted him completely\nAnd were always ready to follow\nNo matter how tough the journey\nPercy's leadership shone through\nTogether, they created unforgettable memories\nAnd shared countless joyous moments",
    expected: (vim) => vim.cursor.pos.startLine == 2 && vim.cursor.pos.startIndex == vim.content[2].length - 1
  },
  {
    strokes: 1,
    description: "Enter Visual block mode",
    content: "Percy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures\nPercy never shied away from a challenge\nHe believed in facing fears head-on\nEvery new place he discovered\nBrought him immense joy\nHe had a natural sense of direction\nWhich always amazed his friends\nThey trusted him completely\nAnd were always ready to follow\nNo matter how tough the journey\nPercy's leadership shone through\nTogether, they created unforgettable memories\nAnd shared countless joyous moments",
    expected: (vim) => vim.mode === "V-Block"
  },
  {
    strokes: 1,
    description: "Char replace p with l",
    content: "Spepling is important",
    prepare: (vim) => {
      vim.cursor.setLineIndexNormal(3, "absolute")
    },
    expected: "Spelling is important"
  },
  {
    strokes: 2,
    description: "Visual select around ''",
    content: "'Once' upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    expected: vim => {
      return vim.mode === "Visual" && vim.cursor.pos.startIndex === 0 && vim.cursor.pos.endIndex === 5
    }
  },
  {
    strokes: 1,
    description: "Move 5 chars right",
    content: "With the treasure found\nThey returned home\nTheir adventure was complete\nBut memories would last forever\nThey shared the treasure\nWith everyone in their village\nTheir story inspired many\nTo pursue their own adventures\nThey became legends in their own right\nPercy's name was known far and wide\nFor his bravery and leadership\nHe proved that with determination\nAnd good friends by your side\nYou can achieve anything\nTheir journey was over\nBut their legacy would live on\nIn the hearts of those who heard their talePercy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures\nPercy never shied away from a challenge\nHe believed in facing fears head-on\nEvery new place he discovered\nBrought him immense joy\nHe had a natural sense of direction\nWhich always amazed his friends\nThey trusted him completely\nAnd were always ready to follow\nNo matter how tough the journey\nPercy's leadership shone through\nTogether, they created unforgettable memories\nAnd shared countless joyous moments",
    expected: (vim) => {
      return vim.cursor.pos.startIndex === 5
    },
  },
  {
    strokes: 1,
    description: "Move 8 lines down",
    content: "With the treasure found\nThey returned home\nTheir adventure was complete\nBut memories would last forever\nThey shared the treasure\nWith everyone in their village\nTheir story inspired many\nTo pursue their own adventures\nThey became legends in their own right\nPercy's name was known far and wide\nFor his bravery and leadership\nHe proved that with determination\nAnd good friends by your side\nYou can achieve anything\nTheir journey was over\nBut their legacy would live on\nIn the hearts of those who heard their talePercy was a brave pig\nHe loved discovering new places\nHis friends admired his courage\nThey often followed him on adventures\nPercy never shied away from a challenge\nHe believed in facing fears head-on\nEvery new place he discovered\nBrought him immense joy\nHe had a natural sense of direction\nWhich always amazed his friends\nThey trusted him completely\nAnd were always ready to follow\nNo matter how tough the journey\nPercy's leadership shone through\nTogether, they created unforgettable memories\nAnd shared countless joyous moments",
    expected: (vim) => {
      return vim.cursor.pos.startLine === 8
    },
  },
  {
    strokes: 2,
    description: "Visual select inside \"\"",
    content: "\"Once\" upon a time\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    expected: vim => {
      return vim.mode === "Visual" && vim.cursor.pos.startIndex === 1 && vim.cursor.pos.endIndex === 4
    }
  },
  {
    strokes: 1,
    description: "Enter visual line mode",
    content: "Once{ upon a time}\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    expected: (vim) => {
      return vim.mode === "V-Line"
    }
  },
  {
    strokes: 2,
    description: "Select inner {}",
    content: "Once{ upon a time}\nThere was a little pig named Percy\nPercy loved adventures\nOne day, he found a map\nThe map was very old and tattered\nBut it showed a path to a hidden treasure\nPercy's heart raced with excitement\nHe couldn't wait to follow the map\nPercy knew it would be dangerous\nBut he was ready for the adventure\nHe packed his bag and set off\nWith determination in his eyes\nHe traveled through forests and over mountains\nFacing many challenges along the way\nBut he never gave up\nAnd kept moving forward",
    expected: (vim) => {
      return vim.cursor.pos.startLine == 0 && vim.cursor.pos.endLine == 0 && vim.cursor.pos.startIndex === 5 && vim.cursor.pos.endIndex === 16
    }
  },
  {
    strokes: 1,
    description: "Move to first non-whitespace character on the current line",
    content: `function test(){
  const vimIsFun = true;
  return vimIsFun;
}`,
    prepare: (vim) => {
      vim.setCursorPosition({
        startLine: 1,
        endLine: 1,
        offset: 0,
        startIndex: 8,
        endIndex: 8
      })
    },
    expected: (vim) => {
      const { startLine, startIndex } = vim.cursor.pos
      return startLine === 1 && startIndex === 2
    }
  },
  {
    strokes: 1,
    description: "Move to first non-whitespace character on the previous line",
    content: `function test(){
  const vimIsFun = true;
  return vimIsFun;
}`,
    prepare: (vim) => {
      vim.setCursorPosition({
        startLine: 2,
        endLine: 2,
        offset: 0,
        startIndex: 9,
        endIndex: 9
      })
    },
    expected: (vim) => {
      const { startLine, startIndex } = vim.cursor.pos
      return startLine === 1 && startIndex === 2
    }
  }
]
