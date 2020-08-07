import { expect } from 'chai'
// import Handsontable from 'handsontable'

import {
  setLevelTreeDataRelationshipBySpreadsheetModel as setLevelTreeDate
} from '@/libs/levelTreeData'

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
  setLevelTreeDate(arr, 'id', 'pid')
  it('item has key treeDataValueRange', () => {
    const hasTreeDataValueRange = arr.every(item => item?.hasOwnProperty('treeDataValueRange'))
    expect(hasTreeDataValueRange).be.equal(true)
  })
})
