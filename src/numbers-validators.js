import {isNil, get, gt, gte, lt, lte} from 'lodash'
import {Errors} from './common'

export const isNumber = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  const valueToTest = config.getNumber(value)
  return isNaN(valueToTest) ? Errors.isNumber : null
}

export const isInteger = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  const numberValue = config.getNumber(value)
  return (!Number.isInteger(numberValue)) ? Errors.isInteger : null
}

const compareSign = (value, isPositive, config) => {
  let err = null

  if (!config.isEmptyValue(value)) {
    const numberValue = config.getNumber(value)
    if (isNaN(numberValue)) {
      err = Errors.isNumber
    } else if (isPositive && numberValue < 0) {
      err = Errors.isPositive
    } else if (!isPositive && numberValue >= 0) {
      err = Errors.isNegative
    }
  }
  return err
}

export const isPositive = ({value, config}) => {
  return compareSign(value, true, config)
}

export const isNegative = ({value, config}) => {
  return compareSign(value, false, config)
}

const getNumbers = (value, otherFieldName, siblings, config) => {
  const ret = {value: undefined, otherFieldValue: undefined}
  if (!config.isEmptyValue(value)) {
    ret.value = config.getNumber(value)
  }
  let otherFieldValue = get(siblings, otherFieldName)
  if (!config.isEmptyValue(otherFieldValue)) {
    ret.otherFieldValue = config.getNumber(otherFieldValue)
  }
  return ret
}

const compareWithOtherField = (value, otherFieldName, otherFieldLabel, siblings, config, op, errorCode) => {
  let err = null
  const operands = getNumbers(value, otherFieldName, siblings, config)
  if (!isNaN(operands.value) && !isNaN(operands.otherFieldValue)) {
    err = op(operands.value, operands.otherFieldValue) ? null : {
      error: errorCode,
      params: {
        value,
        otherFieldValue: operands.otherFieldValue,
        otherFieldLabel
      }
    }
  } else if (operands.value !== undefined && isNaN(operands.value)) {
    err = Errors.isNumber
  }

  return err
}

const compareToThreshold = (value, op, threshold, config, errorCode) => {
  let err = null
  let numberValue = NaN
  if (!config.isEmptyValue(value)) {
    numberValue = config.getNumber(value)
    if (isNaN(numberValue)) {
      err = Errors.isNumber
    } else if (!op(numberValue, threshold)) {
      err = {
        error: errorCode,
        params: {value, threshold}
      }
    }
  }
  return err
}

export const isGte = (threshold) => {
  return ({value, config}) => {
    return compareToThreshold(value, gte, threshold, config, Errors.isGte)
  }
}

export const isGt = (threshold) => {
  return ({value, config}) => {
    return compareToThreshold(value, gt, threshold, config, Errors.isGt)
  }
}

export const isLte = (threshold) => {
  return ({value, config}) => {
    return compareToThreshold(value, lte, threshold, config, Errors.isLte)
  }
}

export const isLt = (threshold) => {
  return ({value, config}) => {
    return compareToThreshold(value, lt, threshold, config, Errors.isLt)
  }
}

export const isGteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, gte, Errors.isGteToField)
  }
}

export const isGtField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, gt, Errors.isGtField)
  }
}

export const isLteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, lte, Errors.isLteToField)
  }
}

export const isLtField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, lt, Errors.isLtField)
  }
}

const ensureRangeParamsAreValid = (minValue, maxValue) => {
  if (isNil(minValue) || isNil(maxValue)) {
    throw new Error('minValue and maxValue cannot be null')
  } else if (minValue > maxValue) {
    throw new Error('minValue > maxValue')
  } else if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
    throw new Error('range value must be numbers')
  }
}
export const withinRange = (minValue, maxValue) => {
  if (process.env.NODE_ENV !== 'production') {
    ensureRangeParamsAreValid(minValue, maxValue)
  }

  return ({value, config}) => {
    if (config.isEmptyValue(value)) return null
    const numberValue = config.getNumber(value)
    if (isNaN(numberValue)) return Errors.isNumber
    if (numberValue < minValue || numberValue > maxValue) {
      return {
        error: Errors.withinRange,
        params: {value, minValue, maxValue}
      }
    }
    return null
  }
}
