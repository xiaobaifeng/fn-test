import clonedeep from 'lodash.clonedeep'

import { isArray } from '@/libs/js-type-util'

/**
 * 一维并且每个元素都不是引用类型数组的判断
 * @param {any} obj
 */
const is1dArray = obj => {
  return isArray(obj) && !obj.some(item => item instanceof Object)
}

/**
 * 严格二维数组的判断
 * @param {any} obj
 */
const is2dArray = obj => {
  return isArray(obj) && obj.every(arr => is1dArray(arr))
}

// 暂时觉得下面两个函数 （isEff1dArray, isEff2dArray）通过了测试，但是含义不明，暂时不推荐使用
/**
 * 有效的一维数组的判断
 * @param {any} obj
 */
const isEff1dArray = obj => {
  return (
    isArray(obj) &&
    obj.length > 0 &&
    obj.some(
      item =>
        item !== '' && item !== undefined && JSON.stringify(item) !== 'null'
    )
  )
}

/**
 * 有效的二维数组的判断
 * @param {any} obj
 */
const isEff2dArray = obj => {
  return isArray(obj) && obj.length > 0 && obj.every(item => isEff1dArray(item))
}

/**
 * 判断二维数组内部最小ele === ''
 * @param {any} obj
 */
const isNullStr2dArray = obj => {
  return (
    isArray(obj) &&
    obj.length > 0 &&
    obj.every(
      item => isArray(item) && item.length > 0 && item.every(ele => ele === '')
    )
  )
}

/**
 * 通过 cols 获取二维数组 Effective
 * @param {[string[]]} target2dArray
 * @param {number} cols
 */
const getEff2dArrayByCols = (target2dArray, cols) => {
  if (!is2dArray(target2dArray)) {
    throw new Error('params target2dArray is not a strict 2dArray')
  }
  const $cols =
    cols ||
    target2dArray.reduce(
      (acc, item) => Math.max(acc, Number(getArrayTailNaEIndex(item) + 1)),
      0
    )
  // 语法 new Array(arrayLength)
  const fillEmptyArr = new Array($cols).fill('')
  return target2dArray
    .filter(row => row.some(item => Boolean(item)))
    .map(row => row.concat(fillEmptyArr).slice(0, $cols))
}

/**
 * 获取数组尾部不是空
 * [1, 2, 3, 4, '', undefined] => 4
 * @param {string[]} arr
 */
const getArrayTailNaEIndex = arr => {
  let i = arr.length - 1
  while (i > -1) {
    if (arr[i]) return i
    else if (i === 0) {
      return false
    } else i--
  }
  return false
}

// arguments变量的写法
// function sortNumbers() {
//   return Array.prototype.slice.call(arguments).sort();
// }
// rest参数的写法
// const sortNumbers = (...numbers) => numbers.sort();

/**
 * fun 运行环境：es5
 * beLikeArray [object Arguments] | FileList | ...
 */
// const beLikeArrayToArray = (beLikeArray) => {
//   return Array.apply(null, {length: beLikeArray.length}).reduce((acc, item, index) => acc.concat([beLikeArray[index]]), [])
//   // return Array.prototype.slice.call(arguments)
// }

/**
 * 一维度数组的assign
 * @param {[[]]} target2dArrays [1dArray,...]
 */
const arrayAssign1d = (...target1dArrays) => {
  const args = clonedeep(target1dArrays)
  if (args.some(arg => !isArray(arg))) {
    throw new Error('type of oneArg is not array')
  }
  const reverseArgs = args.reverse()
  return reverseArgs.reduce((acc, item, index) => {
    if (index === 0) return acc.concat(item)
    else {
      if (acc.length >= item.length) return acc
      else {
        item.splice(0, acc.length, ...acc)
        return item
      }
    }
  }, [])
}

/**
 * 当前仅仅处理严格的二维数组
 * @param {} target2dArrays [2dArray,...]
 */
const arrayAssign2d = (...target2dArrays) => {
  const args = clonedeep(target2dArrays)
  if (args.some(arg => !is2dArray(arg))) {
    throw new Error('one of target2dArrays is not a strict 2dArray')
  }
  const reverseArgs = args.reverse()
  return reverseArgs.reduce((acc, item, index) => {
    if (index === 0) return acc.concat(item)
    else {
      const oneAssign2dArr = acc.map((eleArr, index) =>
        arrayAssign1d(item[index] || [], eleArr)
      )
      if (acc.length < item.length) {
        item.splice(0, oneAssign2dArr.length, ...oneAssign2dArr)
        return item
      }
      return oneAssign2dArr
    }
  }, [])
}

/**
 * 判断两个一维数组是否相等
 * @param {[string]} a1dArray
 * @param {[string]} b1dArray
 */
const isEqual1dArray = (a1dArray, b1dArray) => {
  if (!is1dArray(a1dArray) || !is1dArray(b1dArray)) {
    console.error('传入的数组不是 1dArray')
    return false
  }
  return a1dArray.toString() === b1dArray.toString()
}

/**
 * 判断两个二维数组是否相等
 * @param {[[string]]} firstArray
 * @param {[[string]]} second2dArray
 */
const isEqual2dArray = (firstArray, second2dArray) => {
  if (!is2dArray(firstArray) || !is2dArray(second2dArray)) {
    console.error('传入的数组不是 2dArray')
    return false
  }
  if (firstArray.length !== second2dArray.length) return false
  return firstArray.every((ele, index) => {
    return isEqual1dArray(ele, second2dArray[index])
  })
}

export {
  clonedeep,
  is1dArray,
  is2dArray,
  isEff1dArray,
  isEff2dArray,
  isNullStr2dArray,
  isEqual1dArray,
  isEqual2dArray,
  getEff2dArrayByCols,
  getArrayTailNaEIndex,
  arrayAssign1d,
  arrayAssign2d
}
