import { Vim, WildcardPayload } from "../vim/vim";

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
  return []
}

const handleKeyPress = (vim: Vim, onExecuted: VoidFunction) => {
  const keyMap = getMap(vim.mode, vim)
  const mappings = matchMappings(keyMap, vim)
  if (!mappings) return
  if (mappings.length > 1) {
    console.warn("Duplicate mappings ", mappings)
  }
  const mapping = mappings[0]
  console.debug(`${vim.mode} seq match [${mapping?.mapping?.seq.join(",")}]`, mapping.wildcard)
  executeMapping(mapping.mapping, mapping.wildcard ?? {}, vim)
  onExecuted()
}

const ignoreKeys = ["Control", "Shift", "Alt"]
export function sendKey(vim: Vim, [key, modifiers]: Args, onExecuted: VoidFunction) {
  if (ignoreKeys.includes(key)) {
    return;
  }
  vim.lastKeys.push({ key, ...modifiers })
  console.log(`Key reg ${key}, keys: [${vim.lastKeys.map(s => JSON.stringify(s)).join(",")}]`)
  handleKeyPress(vim, onExecuted)
}

function tryMatchSequence(mapping: Vim.Mapping, keys: Vim.SequenceHistory[]): false | { mapping: Vim.Mapping, wildcard: WildcardPayload } {
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

  const possibleWildcard = reversedKeys.at(reversed.length);
  const possibleNumbericWildcard = Number(possibleWildcard?.key)

  //TODO: Handle negative numbers
  if (mapping.wildcards?.includes("range") && !isNaN(possibleNumbericWildcard)) {
    const totalNumber = reversedKeys.slice(reversed.length + 1).reduce((acc, curr) => {
      if (!isNaN(Number(curr))) {
        //Its reversed
        return Number(`${curr}${acc}`)
      }
      return acc
    }, possibleNumbericWildcard)

    return { mapping, wildcard: { range: totalNumber } };
  }

  return { mapping, wildcard: {} };
}

type MappingMatch = {
  mapping: Vim.Mapping;
  partial: boolean;
  wildcard: WildcardPayload;
}
function executeMapping(mapping: Vim.Mapping, modifier: WildcardPayload, vim: Vim) {
  mapping?.action(vim, modifier)
  vim.lastKeys = []
}

function matchMappings(map: Vim.Mapping[], vim: Vim) {
  const init = {
    found: false,
  } as {
    found: boolean;
    matches?: MappingMatch[]
  }

  const value = map.reduce((res, curr) => {
    const mapping = tryMatchSequence(curr, vim.lastKeys)
    if (mapping) {
      const match: MappingMatch = {
        mapping: mapping.mapping,
        wildcard: mapping.wildcard,
        partial: false
      }
      return {
        found: true,
        matches: [match].concat(res.matches ?? [])
      }
    }

    return res;
  }, init)

  return value.matches;
}
