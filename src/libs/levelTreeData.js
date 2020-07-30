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

    /**
     * 非叶子节点第二次出现为undefined
     * @param {[String | Number]} baseNode 
     * @param {Number} index 
     * @return {[String | Number | undefined]}
     */
    function getNotRepectBaseNode(baseNode, index) {
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
      return idArr.map(id => addedItemsObj[id]).reduce((acc, item, index) => {
        const { _id } = item
        const oneRootNodeTreeArr = !item.children
          ? [getNotRepectBaseNode(baseNode, index).concat(_id)]
          : getTreeArr(item.children, baseNode.concat(_id))
        return acc.concat(oneRootNodeTreeArr)
      }, [])
    }
    const treeArr = getTreeArr(this.likeSpreadsheetArr[0])
    console.log('treeArr: ', treeArr)
    
    // ele[0] = undefined
    let emptySpreadsheetData = Handsontable.helper.createEmptySpreadsheetData(
      treeArr.length,
      this.likeSpreadsheetArr.length // treeArr里子数组的最大长度
    ).map(ele => ele.fill())
    console.log('emptySpreadsheetData: ', emptySpreadsheetData)
    const spreadsheetTreeArr = arrayAssign2d(emptySpreadsheetData, treeArr)
    console.log('spreadsheetTreeArr: ', spreadsheetTreeArr)
    console.log('transposition(spreadsheetTreeArr): ', transposition(spreadsheetTreeArr))
    // function getEndIndex (id) {
    //   return !addedItemsObj[id].children
    //     ? addedItemsObj[id].index
    //     : addedItemsObj[id].index + addedItemsObj[id].children.reduce(
    //       (acc, item) => Math.max(acc, getEndIndex(item)), 0
    //     )
    // }
    // function getChildrenMaxLevel (id) {
    //   return !addedItemsObj[id].children
    //     ? addedItemsObj[id].level
    //     : addedItemsObj[id].children.reduce(
    //       (acc, item) => Math.max(acc, getChildrenMaxLevel(item)), 0
    //     )
    // }
    // this.likeSpreadsheetArr.forEach((equalLevelIds, level) => {
    //   equalLevelIds.forEach((id, index, array) => {
    //     addedItemsObj[id].index = index
    //   })
    // })
    // Object.keys(addedItemsObj).forEach(idKey => {
    //   addedItemsObj[Number(idKey)].endIndex = getEndIndex(Number(idKey))
    //   addedItemsObj[Number(idKey)].childrenMaxLevel = getChildrenMaxLevel(Number(idKey))
    // })
    // let emptySpreadsheetData = Handsontable.helper.createEmptySpreadsheetData(
    //   Math.max.apply(null, Object.values(addedItemsObj).map(item => item.childrenMaxLevel)),
    //   Object.values(addedItemsObj).map(item => item.endIndex - item.index + 1).reduce((acc, item) => acc + item, 0)
    // )
    // function getRootNodeById (id) {
    //   return addedItemsObj[id].level === 0
    //     ? addedItemsObj[id]
    //     : getRootNodeById(addedItemsObj[id]._pid)
    // }
    // const getRootNodeBaseIndex = (id) => {
    //   const rootNodeIndex = this.likeSpreadsheetArr[0].indexOf(getRootNodeById(id)._id)
    //   const rootNodeBaseIndex = rootNodeIndex > 0
    //     ? this.likeSpreadsheetArr[0]
    //       .slice(0, rootNodeIndex)
    //       .map(item => addedItemsObj[item].endIndex - addedItemsObj[item].index + 1)
    //       .reduce((acc, item) => acc + item, 0)
    //     : 0
    //   return rootNodeBaseIndex
    // }

  //   this.newArr = arr.map(item => {
  //     const rootNodeIndex = getRootNodeBaseIndex(item.id)
  //     return {
  //       ...item,
  //       treeDataValueRange: [
  //         addedItemsObj[item.id].level,
  //         rootNodeIndex + addedItemsObj[item.id].index,
  //         addedItemsObj[item.id].childrenMaxLevel,
  //         rootNodeIndex + addedItemsObj[item.id].endIndex
  //       ]
  //     }
  //   })
  }
  this.create()
  this.init()
  // this.destroySpreadsheetModel()
  // this.destroy()
  return this
  // return this.newArr
}

export {
  SetLevelTreeDataRelationshipBySpreadsheetModel
}
