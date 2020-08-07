import clonedeep from 'lodash.clonedeep'

import Handsontable from 'handsontable'
import { arrayAssign2d } from './arrayUtils'

/**
 * 转置
 * @param {[[String | Number]]} arr
 * @return {[[String | Number]]}
 */
function transposition (arr) {
  return arr[0].map((item, index) => {
    return arr.map(ele => ele[index])
  })
}

/**
 * 描述平级树型数据
 *  通过二维数组模型解决获取树形平铺数据节点关系 (x, y):(rowIndex, colIndex)
 */
function DescLevelTreeData (arr, idKey, parentIdKey) {
  console.log('//////////////////////////////////////////////////////\n', arr)
  // 根节点标识
  this.rootLevelFlag = -1
  // 二维数组模型
  this.likeSpreadsheetArr = []
  this.idKey = idKey || 'id'
  this.parentIdKey = parentIdKey || 'parentId'
  this.sourceData = clonedeep(arr)
  this.data = arr
  this.ItemsMap = null
  this.spreadsheetTreeArr = null
}
DescLevelTreeData.prototype.destroySpreadsheetModel = function () {
  delete this.rootLevelFlag
  delete this.likeSpreadsheetArr
}
DescLevelTreeData.prototype.create = function () {
  this.data.forEach(item => {
    item._id = item[this.idKey]
    item._pid = item[this.parentIdKey]
    return item
  })
}
DescLevelTreeData.prototype.destroy = function () {
  this.data.forEach(item => {
    delete item._id
    delete item._pid
    return item
  })
}
DescLevelTreeData.prototype.setLevelArr = function () {
  function addTreeDataItemLevel (id, level) {
    this[level] = this[level] ? this[level].concat(id) : [id]
  }
  // 已添加元素 _id:item
  const addedItemMap = {}
  // 父级_id没有出现的元素
  const waitItemMap = {}

  const addwaitItemFn = () => {
    Object.keys(waitItemMap).forEach((pidKey) => {
      if (addedItemMap[pidKey]) {
        addTreeDataItemLevel.call(
          this.likeSpreadsheetArr,
          waitItemMap[pidKey]._id,
          addedItemMap[pidKey].level + 1
        )
        addedItemMap[waitItemMap[pidKey]._id] = Object.assign(waitItemMap[pidKey], {
          level: addedItemMap[pidKey].level + 1
        })
        addedItemMap[pidKey].children = (addedItemMap[pidKey].children || []).concat(waitItemMap[pidKey]._id)
        delete waitItemMap[pidKey]
      }
    })
  }

  this.data.forEach(({
    _id, _pid
  }) => {
    if (_pid === this.rootLevelFlag || !!addedItemMap[_pid]) {
      const curItemLevel =
        _pid === this.rootLevelFlag ? 0 : addedItemMap[_pid].level + 1
      addTreeDataItemLevel.call(this.likeSpreadsheetArr, _id, curItemLevel)
      addedItemMap[_id] = Object.assign({
        _id,
        _pid
      }, {
        level: curItemLevel
      })
      if (addedItemMap[_pid]) addedItemMap[_pid].children = (addedItemMap[_pid].children || []).concat(_id)
      addwaitItemFn()
    } else {
      waitItemMap[_pid] = {
        _id,
        _pid
      }
    }
  })
  console.log(addedItemMap)
  this.ItemsMap = clonedeep(addedItemMap)
}
DescLevelTreeData.prototype.setSpreadsheetTreeArr = function () {
  /**
     * 非叶子节点第二次出现为undefined
     * @param {[String | Number]} baseNode
     * @param {Number} index
     * @return {[String | Number | undefined]}
     */
  function getNotRepectBaseNode (baseNode, index) {
    return baseNode.length > 0 && index === 0
      ? baseNode
      : baseNode.fill()
  }

  /**
     *
     * @param {[String | Number]} idArr
     * @param {[String | Number | [String | Number]]} baseNode
     * @return {[[String | Number]]}
     */
  const getTreeArr = (idArr, baseNode = []) => {
    return idArr.map(id => this.ItemsMap[id]).reduce((acc, item, index) => {
      const { _id } = item
      const oneRootNodeTreeArr = !item.children
        ? [getNotRepectBaseNode(baseNode, index).concat(_id)]
        : getTreeArr(item.children, baseNode.concat(_id))
      return acc.concat(oneRootNodeTreeArr)
    }, [])
  }
  const treeArr = getTreeArr(this.likeSpreadsheetArr[0])
  console.log('//////////////////////////////////////////////////////\n', this.likeSpreadsheetArr)
  // ele[0] = undefined
  const emptySpreadsheetData = Handsontable.helper.createEmptySpreadsheetData(
    treeArr.length,
    this.likeSpreadsheetArr.length // treeArr里子数组的最大长度
  ).map(ele => ele.fill())
  console.log('//////////////////////////////////////////////////////\n', arrayAssign2d(emptySpreadsheetData, treeArr))
  this.spreadsheetTreeArr = transposition(arrayAssign2d(emptySpreadsheetData, treeArr))
}
DescLevelTreeData.prototype.init = function () {
  this.setLevelArr()
  this.setSpreadsheetTreeArr()
  console.log('//////////////////////////////////////////////////////\n', this.spreadsheetTreeArr)
  // 获取当前树节点下最右侧的子节点
  const getChildrenFarRightNode = (id) => {
    return !this.ItemsMap[id].children
      ? this.ItemsMap[id]
      : getChildrenFarRightNode(this.ItemsMap[id].children[this.ItemsMap[id].children.length - 1])
  }
  const getChildrenMaxLevel = (id) => {
    return !this.ItemsMap[id].children
      ? this.ItemsMap[id].level
      : this.ItemsMap[id].children.reduce(
        (acc, item) => Math.max(acc, getChildrenMaxLevel(item)), 0
      )
  }
  this.spreadsheetTreeArr.forEach((item, colIndex) => {
    item.forEach((id, rowIndex) => {
      id && (this.ItemsMap[id].pos = [
        rowIndex,
        colIndex
      ])
    })
  })
  this.data.forEach(item => {
    item.treeDataValueRange = [
      ...this.ItemsMap[item._id].pos,
      getChildrenFarRightNode(item._id).pos[0],
      getChildrenMaxLevel(item._id)
    ]
  })
}

const setLevelTreeDataRelationshipBySpreadsheetModel = function (arr, idKey, parentIdKey) {
  const descLevelTreeData = new DescLevelTreeData(arr, idKey, parentIdKey)
  descLevelTreeData.create()
  descLevelTreeData.init()
  // descLevelTreeData.destroySpreadsheetModel()
  descLevelTreeData.destroy()
  console.log('///////////////descLevelTreeData////////////////////\n', descLevelTreeData)
}

export {
  setLevelTreeDataRelationshipBySpreadsheetModel
}
