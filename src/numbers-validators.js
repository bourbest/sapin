import {isNil, gt, gte, lt, lte} from 'lodash'
import {Errors} from './errors'
import {isEmptyValue} from './utils'

export const isInteger = ({value, transform}) => {
  if (isEmptyValue(value)) return null
  const numberValue = transform(value)
  return !Number.isInteger(numberValue) ? Errors.isInteger : null
}

export const isPositive = ({value, transform}) => {
  if (isEmptyValue(value)) return null
  const num = transform(value)
  return num < 0 ? Errors.isPositive : null
}

export const isNegative = ({value, transform}) => {
  if (isEmptyValue(value)) return null
  const num = transform(value)
  return num >= 0 ? Errors.isNegative : null
}

const compareWithOtherField = (value, otherFieldName, otherFieldLabel, siblings, transform, op, errorCode) => {
  if (isEmptyValue(value)) return null
  let err = null
  const val = transform(value)
  const otherVal = transform(siblings[otherFieldName])

  if (!isNaN(val) && !isNaN(otherVal) && typeof val === typeof otherVal) {
    err = op(val, otherVal) ? null : {
      error: errorCode,
      params: {
        value,
        otherFieldValue: otherVal,
        otherFieldLabel
      }
    }
  }

  return err
}

const compareToThreshold = (value, op, threshold, transform, errorCode) => {
  if (isEmptyValue(value)) return null
  let err = null
  threshold = transform(threshold)
  value = transform(value)
  if (!isNaN(value) && !op(value, threshold)) {
    err = {
      error: errorCode,
      params: {value, threshold}
    }
  }
  return err
}

export const isGte = (threshold) => {
  return ({value, transform}) => {
    return compareToThreshold(value, gte, threshold, transform, Errors.isGte)
  }
}

export const isGt = (threshold) => {
  return ({value, transform}) => {
    return compareToThreshold(value, gt, threshold, transform, Errors.isGt)
  }
}

export const isLte = (threshold) => {
  return ({value, transform}) => {
    return compareToThreshold(value, lte, threshold, transform, Errors.isLte)
  }
}

export const isLt = (threshold) => {
  return ({value, transform}) => {
    return compareToThreshold(value, lt, threshold, transform, Errors.isLt)
  }
}

export const isGteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, transform}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, transform, gte, Errors.isGteToField)
  }
}

export const isGtField = (fieldName, fieldLabel) => {
  return ({value, siblings, transform}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, transform, gt, Errors.isGtField)
  }
}

export const isLteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, transform}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, transform, lte, Errors.isLteToField)
  }
}

export const isLtField = (fieldName, fieldLabel) => {
  return ({value, siblings, transform}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, transform, lt, Errors.isLtField)
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

  return ({value, transform}) => {
    if (isEmptyValue(value)) return null
    const transformedValue = transform(value)
    if (transformedValue < minValue || transformedValue > maxValue) {
      return {
        error: Errors.withinRange,
        params: {value, minValue, maxValue}
      }
    }
    return null
  }
}
