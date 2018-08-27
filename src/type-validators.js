import {isArray, isObject, isString} from 'lodash'
import {isValid} from 'date-fns'
import {isEmptyValue} from './utils'
import {Errors} from './errors'

export const isOfTypeArray = ({value}) => {
  if (value && !isArray(value)) {
    return Errors.isOfTypeArray
  }
  return null
}

export const isOfTypeObject = ({value}) => {
  if (value && (isArray(value) || !isObject(value))) {
    return Errors.isOfTypeObject
  }
  return null
}

export const isNumber = ({value, getter}) => {
  return isNaN(getter(value)) ? Errors.isNumber : null
}

export const isOfTypeBool = ({value}) => {
  if ([true, false, 'true', 'false', null, undefined, ''].includes(value)) return null
  return Errors.isOfTypeBool
}

export const isOfTypeString = ({value}) => {
  if (!isEmptyValue(value) && !isString(value)) return Errors.isOfTypeString
  return null
}

export const isOfTypeDate = ({value, getter}) => {
  if (!isEmptyValue(value) && !isValid(getter(value))) return Errors.isOfTypeDate
  return null
}
