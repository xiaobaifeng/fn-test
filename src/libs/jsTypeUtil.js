/**
 * util-lang.js - The minimal language enhancement
 */

function isType (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']'
  }
}

const isObject = isType('Object')
const isString = isType('String')
const isArray = Array.isArray || isType('Array')
const isFunction = isType('Function')

export { isObject, isString, isArray, isFunction }
