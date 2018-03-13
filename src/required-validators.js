import {get, isArray} from 'lodash'
import {Errors} from './common'

// required validators
export const required = ({value, config}) => {
  return config.isEmptyValue(value) ? config.formatError(Errors.required, {value}, config) : null
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
  return (params) => {
    const otherFieldValue = get(params.siblings, otherFieldName, false)
    if (isArray(expectedFieldValue)) {
      if (expectedFieldValue.indexOf(otherFieldValue) > -1) {
        return required(params)
      }
    } else if (otherFieldValue === expectedFieldValue) {
      return required(params)
    }
    return null
  }
}
