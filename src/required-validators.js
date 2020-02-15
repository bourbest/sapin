import {get, isArray} from 'lodash'
import {Errors} from './errors'
import { isEmptyValue } from './utils'

// required validators
export const required = ({value}) => {
  return isEmptyValue(value) ? Errors.required : null
}

export const requiredIfOtherFieldIsTrue = (otherFieldName) => {
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, false)
    if (otherFieldValue) {
      return required(params)
    }
    return null
  }
}

export const requiredIfOtherFieldIsFalse = (otherFieldName) => {
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, true)
    if (!otherFieldValue) {
      return required(params)
    }
    return null
  }
}

// expectedFieldValue can be a single value or an array of values
export const requiredIfOtherFieldEquals = (otherFieldName, expectedFieldValue) => {
  expectedFieldValue = isArray(expectedFieldValue) ? expectedFieldValue : [expectedFieldValue]
  const expectedValues = new Set(expectedFieldValue)
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, false)
    if (expectedValues.has(otherFieldValue)) {
      return required(params)
    }
    return null
  }
}

export const requiredIfOtherFieldIsEmpty = (otherFieldName) => {
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, null)
    if (isEmptyValue(otherFieldValue)) {
      return required(params)
    }
    return null
  }
}

export const requiredIfOtherFieldIsNotEmpty = (otherFieldName) => {
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, null)
    if (!isEmptyValue(otherFieldValue)) {
      return required(params)
    }
    return null
  }
}

export const requiredIfOtherFieldIsGiven = (otherFieldName) => {
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, null)
    if (!isEmptyValue(otherFieldValue)) {
      return required(params)
    }
    return null
  }
}
