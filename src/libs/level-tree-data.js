import DescLevelTreeData from './desc-level-tree-data'
import SpreadsheetModelHelper from './spreadsheet-model-hleper'

const setLevelTreeDataRelationshipBySpreadsheetModel = function (arr, idKey, parentIdKey) {
  const descLevelTreeData = new DescLevelTreeData(arr, idKey, parentIdKey)
  descLevelTreeData.create()
  descLevelTreeData.init()
  // descLevelTreeData.destroySpreadsheetModel()
  descLevelTreeData.destroy()
  return new SpreadsheetModelHelper(...descLevelTreeData.data)
}

export default setLevelTreeDataRelationshipBySpreadsheetModel
