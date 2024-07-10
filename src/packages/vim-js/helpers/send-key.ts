import { Vim, WildcardPayload } from "../vim";

type Args = Parameters<Vim["sendKey"]>

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

function somePartialMappings(vim: Vim, map: Vim.Mapping[], range: number | false) {
  const lastKeys = range ? vim.sequence.slice(range.toString().length) : vim.sequence
  const res = map.some(mapping => {
    return lastKeys.every((value, i) => mapping.seq[i] === value.key && (!range || mapping.wildcards?.includes("range")))
  })
  return res;
}

const handleKeyPress = (vim: Vim, onExecuted: VoidFunction) => {
  const keyMap = getMap(vim.mode, vim)
  const result = matchMappings(keyMap, vim)

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

  executeMapping(mapping.mapping, mapping.wildcard ?? {}, vim)
  onExecuted()
  vim.clearSequence()
}

const ignoreKeys = ["Control", "Shift", "Alt", "AltGraph"]
export function sendKey(vim: Vim, [key, modifiers]: Args, onExecuted: VoidFunction) {
  console.log(key)
  if (ignoreKeys.includes(key)) {
    return;
  }
  vim.appendSequence({ key, ...modifiers })
  handleKeyPress(vim, onExecuted)
}

function tryMatchSequence(mapping: Vim.Mapping, keys: Vim.SequenceHistory[], range: number | undefined): false | { mapping: Vim.Mapping, wildcard: WildcardPayload } {
  if (range && !mapping.wildcards?.includes("range")) {
    return false;
  }

  const reversed = mapping.seq.toReversed()
  const reversedKeys = keys.toReversed()

  const isValidMapping = reversed.every((s, i) => {

    // No modifiers
    if (!s.includes("<")) {
      return s === reversedKeys.at(i)?.key
    }
    const isCtrl = s.includes("C-") ? reversedKeys.at(i)?.ctrl : true;
    const isShift = s.includes("S-") ? reversedKeys.at(i)?.shift : true;
    const isAlt = s.includes("A-") ? reversedKeys.at(i)?.alt : true;

    return s.at(-2) === reversedKeys.at(i)?.key && isShift && isCtrl && isAlt
  })

  if (!isValidMapping) return false;

  return { mapping, wildcard: {} };
}

type MappingMatch = {
  mapping: Vim.Mapping;
  wildcard: WildcardPayload;
}
function executeMapping(mapping: Vim.Mapping, modifier: WildcardPayload, vim: Vim) {
  mapping?.action(vim, modifier)
  vim.sequence = []
}

type SearchRange = {
  isFull: boolean;
  range: number;
}
function tryGetRange(vim: Vim): false | { isFull: boolean; range: number } {
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

function matchMappings(map: Vim.Mapping[], vim: Vim): number | { matches: MappingMatch[], range: false | number } {
  const range = tryGetRange(vim)
  if (range && range.isFull) {
    return range.range
  }

  const init = {
    found: false,
  } as {
    found: boolean;
    matches?: MappingMatch[]
  }

  const value = map.reduce((res, curr) => {
    const match = tryMatchSequence(curr, vim.sequence, range ? range.range : undefined)
    if (match) {
      return {
        found: true,
        matches: [match].concat(res.matches ?? [])
      }
    }
    return res;
  }, init)

  return {
    range: range ? range.range : false,
    matches: value.matches ? value.matches.map(s => ({ ...s, wildcard: { range: range ? range.range : undefined } })) : []
  }
}
