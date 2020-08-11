// treeDataValueRange: [startRowIndex, startColIndex, endRowIndex, endColIndex]

/**
 * @param {[String | Number]} treeDataValueRange
 * @return {Boolean}
 */
export function isLeafNode (treeDataValueRange) {
  return treeDataValueRange[0] === treeDataValueRange[2] && treeDataValueRange[1] === treeDataValueRange[3]
}
/**
 * @param {[String | Number]} treeDataValueRange
 * @param {Number} level
 */
export function isLevelNumber (treeDataValueRange, level) {
  return treeDataValueRange[1] === level
}

export function isCover (treeDataValueRangeA, treeDataValueRangeB) {
  return (treeDataValueRangeA[0] <= treeDataValueRangeB[0] && treeDataValueRangeA[1] <= treeDataValueRangeB[1]) &&
  (treeDataValueRangeA[2] >= treeDataValueRangeB[2] && treeDataValueRangeA[3] >= treeDataValueRangeB[3])
}
