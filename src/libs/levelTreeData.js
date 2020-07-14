// import Handsontable from 'handsontable'

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
  this.newArr = null
  this.init = () => {
    // 已添加元素 _id:item
    const addedItemsObj = {}
    // 父级_id没有出现的元素
    const waitItemsObj = {}

    const addWaitItemsObj = () => {
      Object.keys(waitItemsObj).forEach((pidKey) => {
        if (addedItemsObj[pidKey]) {
          addTreeDataItemLevel.call(
            this.likeSpreadsheetArr,
            waitItemsObj[pidKey]._id,
            addedItemsObj[pidKey].level + 1
          )
          addedItemsObj[waitItemsObj[pidKey]._id] = Object.assign(waitItemsObj[pidKey], {
            level: addedItemsObj[pidKey].level + 1
          })
          addedItemsObj[pidKey].children = (addedItemsObj[pidKey].children || []).concat(waitItemsObj[pidKey]._id)
          delete waitItemsObj[pidKey]
        }
      })
    }

    arr.forEach(({
      _id, _pid
    }) => {
      if (_pid === this.rootLevelFlag || !!addedItemsObj[_pid]) {
        const curItemLevel =
          _pid === this.rootLevelFlag ? 0 : addedItemsObj[_pid].level + 1
        addTreeDataItemLevel.call(this.likeSpreadsheetArr, _id, curItemLevel)
        addedItemsObj[_id] = Object.assign({
          _id,
          _pid
        }, {
          level: curItemLevel
        })
        if (addedItemsObj[_pid]) addedItemsObj[_pid].children = (addedItemsObj[_pid].children || []).concat(_id)
        addWaitItemsObj()
      } else {
        waitItemsObj[_pid] = {
          _id,
          _pid
        }
      }
    })
    function getEndIndex (id) {
      return !addedItemsObj[id].children
        ? addedItemsObj[id].index
        : addedItemsObj[id].index + addedItemsObj[id].children.reduce(
          (acc, item) => Math.max(acc, getEndIndex(item)), 0
        )
    }
    function getChildrenMaxLevel (id) {
      return !addedItemsObj[id].children
        ? addedItemsObj[id].level
        : addedItemsObj[id].children.reduce(
          (acc, item) => Math.max(acc, getChildrenMaxLevel(item)), 0
        )
    }
    this.likeSpreadsheetArr.forEach((equalLevelIds, level) => {
      equalLevelIds.forEach((id, index, array) => {
        addedItemsObj[id].index = index
      })
    })
    Object.keys(addedItemsObj).forEach(idKey => {
      addedItemsObj[Number(idKey)].endIndex = getEndIndex(Number(idKey))
      addedItemsObj[Number(idKey)].childrenMaxLevel = getChildrenMaxLevel(Number(idKey))
    })
    // let emptySpreadsheetData = Handsontable.helper.createEmptySpreadsheetData(
    //   Math.max.apply(null, Object.values(addedItemsObj).map(item => item.childrenMaxLevel)),
    //   Object.values(addedItemsObj).map(item => item.endIndex - item.index + 1).reduce((acc, item) => acc + item, 0)
    // )
    function getRootNodeById (id) {
      return addedItemsObj[id].level === 0
        ? addedItemsObj[id]
        : getRootNodeById(addedItemsObj[id]._pid)
    }
    const getRootNodeBaseIndex = (id) => {
      const rootNodeIndex = this.likeSpreadsheetArr[0].indexOf(getRootNodeById(id)._id)
      const rootNodeBaseIndex = rootNodeIndex > 0
        ? this.likeSpreadsheetArr[0]
          .slice(0, rootNodeIndex)
          .map(item => addedItemsObj[item].endIndex - addedItemsObj[item].index + 1)
          .reduce((acc, item) => acc + item, 0)
        : 0
      return rootNodeBaseIndex
    }

    this.newArr = arr.map(item => {
      const rootNodeIndex = getRootNodeBaseIndex(item.id)
      return {
        ...item,
        // startRowIndex: addedItemsObj[item.id].level,
        // startColIndex: getRootNodeBaseIndex(item.id) + addedItemsObj[item.id].index,
        // endRowIndex: addedItemsObj[item.id].childrenMaxLevel,
        // endColIndex: getRootNodeBaseIndex(item.id) + addedItemsObj[item.id].endIndex,
        treeDataValueRange: [
          addedItemsObj[item.id].level,
          rootNodeIndex + addedItemsObj[item.id].index,
          addedItemsObj[item.id].childrenMaxLevel,
          rootNodeIndex + addedItemsObj[item.id].endIndex
        ]
      }
    })
    // console.log('addedItemsObj', addedItemsObj)
    // console.log('newArr', newArr)
  }
  this.create()
  this.init()
  this.destroySpreadsheetModel()
  this.destroy()
  // 临时
  return this.newArr
}

export {
  SetLevelTreeDataRelationshipBySpreadsheetModel
}
