import { expect } from 'chai'
// import Handsontable from 'handsontable'

import setLevelTreeDate from '@/libs/level-tree-data'

describe('setLevelTreeDate', () => {
  const arr = [
    {
      id: 1,
      pid: -1
    },
    {
      id: 11,
      pid: 1
    },
    {
      id: 111,
      pid: 11
    },
    {
      id: 112,
      pid: 11
    },
    {
      id: 21,
      pid: 2
    },
    {
      id: 211,
      pid: 21
    },
    {
      id: 12,
      pid: 1
    },
    {
      id: 2,
      pid: -1
    }]
  const spreadsheetModelTreeArr = setLevelTreeDate(arr, 'id', 'pid')
  it('item has key treeDataValueRange', () => {
    const hasTreeDataValueRange = spreadsheetModelTreeArr.every(item => item?.hasOwnProperty('treeDataValueRange'))
    expect(hasTreeDataValueRange).be.equal(true)
  })
  function itemIsEqual1dArray (arr, targetResult) {
    expect(arr.length).be.equal(targetResult.length)
    expect(arr.every(item => targetResult.indexOf(item) > -1)).be.equal(true)
  }
  const leafNodes = spreadsheetModelTreeArr.getLeafNodes()
  // getLeafNodes
  it('getLeafNodes()', () => {
    itemIsEqual1dArray(
      leafNodes.map(item => item.id),
      [111, 112, 12, 211]
    )
  })
  // test getNodesByLevel
  const testGetNodesByLevel = ({ level, result, describe }) => {
    it('getNodesByLevel.level:' + (describe || JSON.stringify(level)), () => {
      itemIsEqual1dArray(spreadsheetModelTreeArr.getNodesByLevel(level).map(item => item.id), result)
    })
  }
  [
    {
      level: 0,
      result: [1, 2]
    },
    {
      level: 1,
      result: [11, 12, 21]
    },
    {
      level: 2,
      result: [111, 112, 211]
    }
  ].map(item => testGetNodesByLevel(item))
  // getLeafNodes().getNodesByLevel()
  it('getLeafNodes().getNodesByLevel(2)', () => {
    itemIsEqual1dArray(
      leafNodes.getNodesByLevel(2).map(item => item.id),
      [111, 112, 211]
    )
  })
})
