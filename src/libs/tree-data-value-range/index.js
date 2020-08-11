import * as helpers from './helpers'

class TreeDataValueRangeArr extends Array {
  // eslint-disable-next-line no-useless-constructor
  constructor (...args) {
    super(...args)
  }

  getLeafNodes () {
    return this.filter(({ treeDataValueRange }) => helpers.isLeafNode(treeDataValueRange))
  }

  getNodesByLevel (level) {
    return this.filter(({ treeDataValueRange }) => helpers.isLevelNumber(treeDataValueRange, level))
  }
}

TreeDataValueRangeArr.helpers = helpers
console.log('TreeDataValueRangeArr:\n', TreeDataValueRangeArr)
console.log('TreeDataValueRangeArr.helpers:\n', TreeDataValueRangeArr.helpers)

export default TreeDataValueRangeArr
