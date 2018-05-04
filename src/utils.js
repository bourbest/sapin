import {isArray, isObject, isFunction} from 'lodash'
export const isPureObject = (value) => {
  return isObject(value) && !isArray(value) && !isFunction(value)
}

export const isEmptyValue = function (value) {
  return value === null || value === undefined || value === ''
}
