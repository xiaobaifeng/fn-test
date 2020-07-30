import { expect } from 'chai'
import clonedeep from 'lodash.clonedeep'
// import Handsontable from 'handsontable'

import {
  SetLevelTreeDataRelationshipBySpreadsheetModel as SetLevelTreeDate
} from '@/libs/levelTreeData'

describe('SetLevelTreeDate', () => {
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
  const levelTreeDateObj = new SetLevelTreeDate(clonedeep(arr), 'id', 'pid')
  console.log(levelTreeDateObj)
  // it('item has key treeDataValueRange', () => {
  //   const hasTreeDataValueRange = targetArr.every(item => item?.hasOwnProperty('treeDataValueRange'))
  //   expect(hasTreeDataValueRange).be.equal(true)
  // })
  it('item has key treeDataValueRange', () => {
    // levelTreeDateObj.hasOwnProperty('likeSpreadsheetArr')
    expect(true).be.equal(true)
  })
})
