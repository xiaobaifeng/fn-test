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
 * 通过二维数组模型解决获取树形平铺数据节点关系
 * (x, y):(rowIndex, colIndex)
 *  */

const SetLevelTreeDataRelationshipBySpreadsheetModel = function (arr, idKey, parentIdKey) {
  // 根节点标识
  this.rootLevelFlag = -1
  // 二维数组模型
  this.likeSpreadsheetArr = []
  function addTreeDataItemLevel (id, level) {
    this[level] = this[level] ? this[level].concat(id) : [id]
  }
  this.destroySpreadsheetModel = () => {
    delete this.rootLevelFlag
    delete this.likeSpreadsheetArr
  }

  this.idKey = idKey || 'id'
  this.parentIdKey = parentIdKey || 'parentId'

  this.create = () => {
    arr.forEach(item => {
      item._id = item[this.idKey]
      item._pid = item[this.parentIdKey]
      return item
    })
  }
  this.destroy = () => {
    arr.forEach(item => {
      delete item._id
      delete item._pid
      return item
    })
  }
  this.init = () => {
    // 已添加元素 _id:item
    const addedItemMap = {}
    // 父级_id没有出现的元素
    const waitItemMap = {}

    const addwaitItemMap = () => {
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

    arr.forEach(({
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
        addwaitItemMap()
      } else {
        waitItemMap[_pid] = {
          _id,
          _pid
        }
      }
    })

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
    function getTreeArr (idArr, baseNode = []) {
      return idArr.map(id => addedItemMap[id]).reduce((acc, item, index) => {
        const { _id } = item
        const oneRootNodeTreeArr = !item.children
          ? [getNotRepectBaseNode(baseNode, index).concat(_id)]
          : getTreeArr(item.children, baseNode.concat(_id))
        return acc.concat(oneRootNodeTreeArr)
      }, [])
    }
    const treeArr = getTreeArr(this.likeSpreadsheetArr[0])

    // ele[0] = undefined
    const emptySpreadsheetData = Handsontable.helper.createEmptySpreadsheetData(
      treeArr.length,
      this.likeSpreadsheetArr.length // treeArr里子数组的最大长度
    ).map(ele => ele.fill())

    const spreadsheetTreeArr = transposition(arrayAssign2d(emptySpreadsheetData, treeArr))

    // 获取当前树节点下最右侧的子节点
    function getChildrenFarRightNode (id) {
      return !addedItemMap[id].children
        ? addedItemMap[id]
        : getChildrenFarRightNode(addedItemMap[id].children[addedItemMap[id].children.length - 1])
    }
    function getChildrenMaxLevel (id) {
      return !addedItemMap[id].children
        ? addedItemMap[id].level
        : addedItemMap[id].children.reduce(
          (acc, item) => Math.max(acc, getChildrenMaxLevel(item)), 0
        )
    }
    spreadsheetTreeArr.forEach((item, colIndex) => {
      item.forEach((id, rowIndex) => {
        id && (addedItemMap[id].pos = [
          rowIndex,
          colIndex
        ])
      })
    })
    arr.forEach(item => {
      console.log(`getEndIndex(${item._id})`)
      item.treeDataValueRange = [
        ...addedItemMap[item._id].pos,
        getChildrenFarRightNode(item._id).pos[0],
        getChildrenMaxLevel(item._id)
      ]
    })
  }
  this.create()
  this.init()
  this.destroySpreadsheetModel()
  this.destroy()
  console.log(this)
  return arr
}

export {
  SetLevelTreeDataRelationshipBySpreadsheetModel
}
