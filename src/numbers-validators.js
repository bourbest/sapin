import {isNil, eq, gt, gte, lt, lte} from 'lodash'
import {Errors} from './errors'
import {isEmptyValue} from './utils'

export const isInteger = ({value, getter}) => {
  if (isEmptyValue(value)) return null
  const numberValue = getter(value)
  return !Number.isInteger(numberValue) ? Errors.isInteger : null
}

export const isPositive = ({value, getter}) => {
  if (isEmptyValue(value)) return null
  const num = getter(value)
  return num < 0 ? Errors.isPositive : null
}

export const isNegative = ({value, getter}) => {
  if (isEmptyValue(value)) return null
  const num = getter(value)
  return num >= 0 ? Errors.isNegative : null
}

const compareWithOtherField = (value, otherFieldName, otherFieldLabel, siblings, getter, op, errorCode) => {
  if (isEmptyValue(value)) return null
  let err = null
  const val = getter(value)
  const otherVal = getter(siblings[otherFieldName])

  if (isNaN(val) || isNaN(otherVal)) return null

  err = op(val, otherVal) ? null : {
    error: errorCode,
    params: {
      value,
      otherFieldValue: otherVal,
      otherFieldLabel
    }
  }

  return err
}

const compareToThreshold = (value, op, threshold, getter, errorCode) => {
  if (isEmptyValue(value)) return null
  let err = null
  threshold = getter(threshold)
  value = getter(value)
  if (!isNaN(value) && !op(value, threshold)) {
    err = {
      error: errorCode,
      params: {value, threshold}
    }
  }
  return err
}

export const isGte = (threshold) => {
  return ({value, getter}) => {
    return compareToThreshold(value, gte, threshold, getter, Errors.isGte)
  }
}

export const isGt = (threshold) => {
  return ({value, getter}) => {
    return compareToThreshold(value, gt, threshold, getter, Errors.isGt)
  }
}

export const isLte = (threshold) => {
  return ({value, getter}) => {
    return compareToThreshold(value, lte, threshold, getter, Errors.isLte)
  }
}

export const isLt = (threshold) => {
  return ({value, getter}) => {
    return compareToThreshold(value, lt, threshold, getter, Errors.isLt)
  }
}

export const isEqualToField = (fieldName, fieldLabel) => {
  return ({value, siblings, getter}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, getter, eq, Errors.isEqualToField)
  }
}

export const isGteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, getter}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, getter, gte, Errors.isGteToField)
  }
}

export const isGtField = (fieldName, fieldLabel) => {
  return ({value, siblings, getter}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, getter, gt, Errors.isGtField)
  }
}

export const isLteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, getter}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, getter, lte, Errors.isLteToField)
  }
}

export const isLtField = (fieldName, fieldLabel) => {
  return ({value, siblings, getter}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, getter, lt, Errors.isLtField)
  }
}

const ensureRangeParamsAreValid = (minValue, maxValue) => {
  if (isNil(minValue) || isNil(maxValue)) {
    throw new Error('minValue and maxValue cannot be null')
  } else if (minValue > maxValue) {
    throw new Error('minValue > maxValue')
  } else if (typeof minValue !== typeof maxValue) {
    throw new Error('range value must be of the same type')
  }
}
export const withinRange = (minValue, maxValue) => {
  ensureRangeParamsAreValid(minValue, maxValue)

  return ({value, getter}) => {
    if (isEmptyValue(value)) return null
    const getteredValue = getter(value)
    if (getteredValue < minValue || getteredValue > maxValue) {
      return {
        error: Errors.withinRange,
        params: {value, minValue, maxValue}
      }
    }
    return null
  }
}
