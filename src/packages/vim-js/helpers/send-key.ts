import { Vim, WildcardPayload } from "../vim";

type Args = Parameters<Vim["sendKey"]>
const ignoreKeys = ["Control", "Shift", "Alt", "AltGraph"]
export function registerKey(vim: Vim, [key, modifiers]: Args, onExecuted: VoidFunction) {
  if (ignoreKeys.includes(key)) {
    return;
  }
  vim.appendSequence({ key, ...modifiers })
  handleKeyPress(vim, onExecuted)
}

const handleKeyPress = (vim: Vim, onExecuted: VoidFunction) => {
  const keyMap = getMap(vim.mode, vim)

  const range = tryGetRange(vim)
  if (range && range.isFull) {
    //Sequence so far is just a number
    return
  }

  const result = tryGetMatchingMappings(keyMap, vim, range ? range.range : false)

  if (typeof result === "number") {
    return;
  }

  if (result.matches.length === 0) {
    //find partial mappings
    if (!somePartialMappings(vim, keyMap, result.range)) {
      vim.clearSequence()
    }
    return;
  }

  if (result.matches.length > 1) {
    console.error("Multiple mappings matched")
  }
  const mapping = result.matches[0]

  mapping.mapping?.action(vim, mapping.wildcard)
  onExecuted()
  vim.clearSequence()
}

function somePartialMappings(vim: Vim, map: Vim.Mapping[], range: number | false) {
  const lastKeys = range ? vim.sequence.slice(range.toString().length) : vim.sequence

  return map.some(mapping => {
    return lastKeys.every((value, i) => {
      const char = mapping.seq[i]
      return isKeyEqual(char, value) && (!range || mapping.wildcards?.includes("range"))
    })
  })
}

function tryGetMapping(mapping: Vim.Mapping, keys: Vim.SequenceHistory[], range: number | undefined): false | { mapping: Vim.Mapping, wildcard: WildcardPayload } {
  const mappingSequence = mapping.seq
  const lastKeysNoRange = keys.slice(range?.toString().length)

  const isValidMapping = (!range || mapping.wildcards?.includes("range")) && mappingSequence.every((seqDef, i) => isKeyEqual(seqDef, lastKeysNoRange[i]))

  return isValidMapping ? { mapping, wildcard: { range } } : false
}

function isKeyEqual(mappingSeqPart: string, sequenceKey: Vim.SequenceHistory | undefined): boolean {
  if (!sequenceKey) return false;
  if (!mappingSeqPart.includes("<")) {
    return (mappingSeqPart === sequenceKey?.key || mappingSeqPart === "*") && !sequenceKey.ctrl && !sequenceKey.alt
  }

  const isCtrl = mappingSeqPart.includes("C-") ? sequenceKey.ctrl : true;
  const isShift = mappingSeqPart.includes("S-") ? sequenceKey.shift : true;
  const isAlt = mappingSeqPart.includes("A-") ? sequenceKey.alt : true;

  //<C-S-r>
  const ack = mappingSeqPart.at(-2)
  if (!ack) return false
  return (ack === sequenceKey?.key || ack === "*") && isShift && isCtrl && isAlt
}


type MappingMatch = {
  mapping: Vim.Mapping;
  wildcard: WildcardPayload;
}

function tryGetMatchingMappings(map: Vim.Mapping[], vim: Vim, range: number | false): number | { matches: MappingMatch[], range: false | number } {
  const init = {
    found: false,
  } as {
    found: boolean;
    matches?: MappingMatch[]
  }

  const value = map.reduce((res, curr) => {
    const match = tryGetMapping(curr, vim.sequence, range ? range : undefined)
    if (match) {
      return {
        found: true,
        matches: [match].concat(res.matches ?? [])
      }
    }
    return res;
  }, init)

  return {
    range: range,
    matches: value.matches ?? []
  }
}

type SearchRange = {
  isFull: boolean;
  range: number;
}
function tryGetRange(vim: Vim): false | SearchRange {
  const range = vim.sequence.reduce((acc, curr, index, list) => {
    const possibleNumber = Number(curr.key)
    /**
     * possible number is defined, acc is either defined already or the number is not 0
     * valid ranges can not start with 0
     * */
    if (!isNaN(possibleNumber) && (acc || possibleNumber > 0)) {
      return acc ? { range: (acc.range * 10) + possibleNumber, isFull: list.length - 1 === index } : { range: possibleNumber, isFull: list.length - 1 === index };
    } else {
      return acc ? { isFull: false, range: acc.range } : false;
    }
  }, false as SearchRange | false)

  return range
}

const getMap = (mode: Vim.Mode, vim: Vim) => {
  switch (mode) {
    case "Normal":
      return vim.nMap

    case "Insert":
      return vim.iMap

    case "Visual":
    case "V-Block":
      return vim.vMap
  }
}

