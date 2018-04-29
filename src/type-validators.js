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

export const isNumber = ({value, transform}) => {
  return isNaN(transform(value)) ? Errors.isNumber : null
}

export const isOfTypeBool = ({value}) => {
  if (value === true || value === false) return null
  return Errors.isOfTypeBool
}

export const isOfTypeString = ({value}) => {
  if (!isEmptyValue(value) && !isString(value)) return Errors.isOfTypeString
  return null
}

export const isOfTypeDate = ({value, transform}) => {
  if (!isEmptyValue(value) && !isValid(transform(value))) return Errors.isOfTypeDate
  return null
}
