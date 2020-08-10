class SpreadsheetModelHelper extends Array {
  // eslint-disable-next-line no-useless-constructor
  constructor (...args) {
    super(...args)
  }

  getLeafNodes () {
    return this.filter(({ treeDataValueRange }) => treeDataValueRange[0] === treeDataValueRange[2] && treeDataValueRange[1] === treeDataValueRange[3])
  }

  getNodesByLevel (level) {
    return this.filter(({ treeDataValueRange }) => treeDataValueRange[1] === level)
  }
}

export default SpreadsheetModelHelper
