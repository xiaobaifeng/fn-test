import { expect } from 'chai'
import {
  is1dArray,
  is2dArray,
  isEff1dArray,
  isEff2dArray,
  isNullStr2dArray,
  isEqual1dArray,
  isEqual2dArray,
  arrayAssign1d,
  arrayAssign2d
} from '@/libs/arrayUtils'

describe('arrayUtils', () => {
  // test is1dArray
  const testIs1dArray = ({ params, result, describe }) => {
    it('is1dArray.params:' + (describe || JSON.stringify(params)), () => {
      expect(is1dArray(params)).to.equal(result)
    })
  }
  const is1dArrayTests = [
    {
      params: [],
      result: true
    },
    {
      params: [1, 2, 3],
      result: true
    },
    {
      params: [1, '', null, undefined],
      result: true
    },
    {
      params: [[]],
      result: false
    },
    {
      params: [{}],
      result: false
    },
    {
      params: [
        function () {
          console.log(1)
        }
      ],
      describe: '[function () { console.log(1) }]',
      result: false
    }
  ]
  is1dArrayTests.map(item => testIs1dArray(item))
  // test is2dArray
  const testIs2dArray = ({ params, result, describe }) => {
    it('is2dArray.params:' + (describe || JSON.stringify(params)), () => {
      expect(is2dArray(params)).to.equal(result)
    })
  }
  ;[
    {
      params: [[]],
      result: true
    },
    {
      params: [[1, 2, 3], [], [1]],
      result: true
    }
  ].map(item => testIs2dArray(item))
  // test isEff1dArray
  const testIsEff1dArray = ({ params, result, describe }) => {
    it('isEff1dArray.params:' + (describe || JSON.stringify(params)), () => {
      expect(isEff1dArray(params)).to.equal(result)
    })
  }
  ;[
    {
      params: [],
      result: false
    },
    {
      params: [''],
      result: false
    },
    {
      params: [undefined],
      result: false
    },
    {
      params: [0],
      result: true
    },
    {
      params: [null],
      result: false
    },
    {
      params: [{}],
      result: true
    }
  ].map(item => testIsEff1dArray(item))
  // test isEff2dArray
  const testIsEff2dArray = ({ params, result, describe }) => {
    it('isEff2dArray.params:' + (describe || JSON.stringify(params)), () => {
      expect(isEff2dArray(params)).to.equal(result)
    })
  }
  ;[
    {
      params: [[]],
      result: false
    },
    {
      params: [[1, ''], []],
      result: false
    },
    {
      params: [[1, ''], [0]],
      result: true
    }
  ].map(item => testIsEff2dArray(item))
  // test isNullStr2dArray
  const testIsNullStr2dArray = ({ params, result, describe }) => {
    it(
      'isNullStr2dArray.params:' + (describe || JSON.stringify(params)),
      () => {
        expect(isNullStr2dArray(params)).to.equal(result)
      }
    )
  }
  ;[
    {
      params: [[]],
      result: false
    },
    {
      params: [['', ''], []],
      result: false
    },
    {
      params: [['', ''], ['']],
      result: true
    }
  ].map(item => testIsNullStr2dArray(item))
  // test isEqual1dArray
  const testIsEqual1dArray = ({ params, result, describe }) => {
    it('isEqual1dArray.params:' + (describe || JSON.stringify(params)), () => {
      expect(isEqual1dArray(...params)).to.equal(result)
    })
  }
  ;[
    {
      params: [
        [1, 2, 3],
        [1, 2, 3]
      ],
      result: true
    },
    {
      params: [
        [1, 2, 3],
        [1, 3, 2]
      ],
      result: false
    },
    {
      params: [
        [1, 2, 3],
        [1, 2]
      ],
      result: false
    }
  ].map(item => testIsEqual1dArray(item))
  // test isEqual2dArray
  const testIsEqual2dArray = ({ params, result, describe }) => {
    it('isEqual2dArray.params:' + (describe || JSON.stringify(params)), () => {
      expect(isEqual2dArray(...params)).to.equal(result)
    })
  }
  ;[
    {
      params: [[[1, 2, 3]], [[1, 2, 3]]],
      result: true
    },
    {
      params: [
        [[1, 2, 3], [], [1]],
        [[1, 2, 3], [], [1]]
      ],
      result: true
    },
    {
      params: [[[1, 2, 3]], [[1, 2, 3], []]],
      result: false
    },
    {
      params: [[[1, 2, 3]], [[1, 2]]],
      result: false
    }
  ].map(item => testIsEqual2dArray(item))

  it('arrayAssign1d.params [], [1] ', () => {
    const result = arrayAssign1d([], [1])
    expect(result).to.be.an('array')
    expect(result.length).to.equal(1)
    expect(result[0]).to.equal(1)
  })
  it('arrayAssign1d.params [1, 2, 3], ["aa"] ', () => {
    const result = arrayAssign1d([1, 2, 3], ['aa'])
    expect(result).to.be.an('array')
    expect(result.length).to.equal(3)
    expect(result[0]).to.equal('aa')
    expect(result[1]).to.equal(2)
    expect(result[2]).to.equal(3)
  })
  const array2dA = [
    ['A1', 'A2', 'A3'],
    [1, 2, 3]
  ]
  const array2dB = [
    ['B1', 'B2', 'B3'],
    [10, 20, 30]
  ]
  it('arrayAssign2d rows,cols is equal', () => {
    const result = arrayAssign2d(array2dA, array2dB)
    expect(result).to.be.an('array')
    expect(result.length).to.equal(2)
    expect(JSON.stringify(result)).to.equal(JSON.stringify(array2dB))
  })
  it('arrayAssign2d arg1:array(1,3); arg2:array(2,3)', () => {
    const result = arrayAssign2d([array2dA[0]], array2dB)
    expect(result).to.be.an('array')
    expect(result.length).to.equal(2)
    expect(JSON.stringify(result)).to.equal(JSON.stringify(array2dB))
  })
  it('arrayAssign2d arg1:array(2,3); arg2:array(1,3)', () => {
    const result = arrayAssign2d(array2dA, [array2dB[0]])
    expect(result).to.be.an('array')
    expect(result.length).to.equal(2)
    expect(JSON.stringify(result)).to.equal(
      JSON.stringify([array2dB[0], array2dA[1]])
    )
  })
  it('arrayAssign2d 特殊', () => {
    const arr1 = [
      ['a1', 'a2'],
      ['a11', 'a22']
    ]
    const arr2 = [['b1', 'b2', 'b3'], ['b11'], ['b31']]
    const result = arrayAssign2d(arr1, arr2)
    expect(result).to.be.an('array')
    expect(result.length).to.equal(3)
    expect(JSON.stringify(result)).to.equal(
      JSON.stringify([['b1', 'b2', 'b3'], ['b11', 'a22'], ['b31']])
    )
    // 测试 arrayAssign2d 2dArray参数（引用类型）是否发生变化
    expect(JSON.stringify(arr1)).to.equal(
      JSON.stringify([
        ['a1', 'a2'],
        ['a11', 'a22']
      ])
    )
  })
})
