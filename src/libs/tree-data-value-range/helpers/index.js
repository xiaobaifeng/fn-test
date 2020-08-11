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
