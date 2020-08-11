import * as helpers from './helpers'

class TreeDataValueRangeArr extends Array {
  // eslint-disable-next-line no-useless-constructor
  constructor (...args) {
    super(...args)
  }

  getLeafNodes () {
    return this.filter(({ treeDataValueRange }) => helpers.isLeafNode(treeDataValueRange))
  }

  getNodesByLevel (level = 0) {
    return this.filter(({ treeDataValueRange }) => helpers.isLevelNumber(treeDataValueRange, level))
  }

  getChildrenNodes (id) {
    const targetNode = this.find(item => item.id === id)
    return helpers.isLeafNode(targetNode.treeDataValueRange)
      ? null
      : this.filter(item => item.id !== id && helpers.isCover(targetNode.treeDataValueRange, item.treeDataValueRange))
  }
}

TreeDataValueRangeArr.helpers = helpers
console.log('TreeDataValueRangeArr:\n', TreeDataValueRangeArr)
console.log('TreeDataValueRangeArr.helpers:\n', TreeDataValueRangeArr.helpers)

export default TreeDataValueRangeArr
