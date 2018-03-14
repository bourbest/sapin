import {isNil, get, gte, lte} from 'lodash'
import {Errors} from './common'

export const isNumber = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  const valueToTest = config.getNumber(value)
  return isNaN(valueToTest) ? config.formatError(Errors.isNumber, {value}, config) : null
}

export const isInteger = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  const numberValue = config.getNumber(value)
  return (!Number.isInteger(numberValue)) ? config.formatError(Errors.isInteger, {value}, config) : null
}

const compareSign = (value, isPositive, config) => {
  let err = null

  if (!config.isEmptyValue(value)) {
    const numberValue = config.getNumber(value)
    if (isNaN(numberValue)) {
      err = config.formatError(Errors.isNumber, {value}, config)
    } else if (isPositive && numberValue < 0) {
      err = config.formatError(Errors.isPositive, {value}, config)
    } else if (!isPositive && numberValue >= 0) {
      err = config.formatError(Errors.isNegative, {value}, config)
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
    err = op(operands.value, operands.otherFieldValue) ? null : config.formatError(errorCode, {
      value,
      otherFieldValue: operands.otherFieldValue,
      otherFieldLabel
    }, config)
  } else if (operands.value !== undefined && isNaN(operands.value)) {
    err = config.formatError(Errors.isNumber, {value}, config)
  }

  return err
}

export const numberGteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, gte, Errors.numberGteToField)
  }
}

export const numberLteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, lte, Errors.numberLteToField)
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
export const numberWithinRange = (minValue, maxValue) => {
  if (process.env.NODE_ENV !== 'production') {
    ensureRangeParamsAreValid(minValue, maxValue)
  }

  return ({value, config}) => {
    if (config.isEmptyValue(value)) return null
    const numberValue = config.getNumber(value)
    if (isNaN(numberValue)) return config.formatError(Errors.isNumber, {value}, config)
    if (numberValue < minValue || numberValue > maxValue) {
      return config.formatError(
        Errors.numberWithinRange,
        {value, minValue, maxValue},
        config
      )
    }
    return null
  }
}
