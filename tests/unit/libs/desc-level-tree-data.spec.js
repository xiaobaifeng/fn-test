import { expect } from 'chai'

import DescLevelTreeData from '@/libs/desc-level-tree-data'

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
      pid: 222
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
      id: 222,
      pid: -1
    }
  ]
  // 创建对象时，key为数字的话，对象会默认用key排序
  it('乱序 waitItemMap', () => {
    // eslint-disable-next-line no-new
    new DescLevelTreeData(arr, 'id', 'pid')
    expect(1).to.equal(1)
  })
})
