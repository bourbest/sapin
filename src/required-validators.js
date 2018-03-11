import {get, isArray} from 'lodash'
import {
  Errors,
  isEmptyValue,
  err
} from './common'

// required validators
export const required = (value) => {
  return isEmptyValue(value) ? err(Errors.required) : null
}

export const requiredIfOtherFieldIsTrue = (otherFieldName) => {
  return (value, entity) => {
    const otherFieldValue = get(entity, otherFieldName, false)
    if (otherFieldValue) {
      return required(value, entity)
    }
    return null
  }
}

export const requiredIfOtherFieldIsFalse = (otherFieldName) => {
  return (value, entity) => {
    const otherFieldValue = get(entity, otherFieldName, true)
    if (!otherFieldValue) {
      return required(value, entity)
    }
    return null
  }
}

// expectedFieldValue can be a single value or an array of values
export const requiredIfOtherFieldEquals = (otherFieldName, expectedFieldValue) => {
  return (value, entity) => {
    const otherFieldValue = get(entity, otherFieldName, false)
    if (isArray(expectedFieldValue)) {
      if (expectedFieldValue.indexOf(otherFieldValue) > -1) {
        return required(value, entity)
      }
    } else if (otherFieldValue === expectedFieldValue) {
      return required(value, entity)
    }
    return null
  }
}
