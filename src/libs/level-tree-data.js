import DescLevelTreeData from './desc-level-tree-data'
import TreeDataValueRangeArr from './tree-data-value-range'

const setLevelTreeDataRelationshipBySpreadsheetModel = function (arr, idKey, parentIdKey) {
  const descLevelTreeData = new DescLevelTreeData(arr, idKey, parentIdKey)
  return new TreeDataValueRangeArr(...descLevelTreeData.data)
}

export default setLevelTreeDataRelationshipBySpreadsheetModel
