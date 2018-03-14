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
  if (config.isEmptyValue(value)) return null
  const numberValue = config.getNumber(value)
  if (isNaN(numberValue)) return config.formatError(Errors.isNumber, {value}, config)

  if (isPositive && numberValue < 0) {
    return config.formatError(Errors.isPositive, {value}, config)
  } else if (!isPositive && numberValue >= 0) {
    return config.formatError(Errors.isNegative, {value}, config)
  }
  return null
}

export const isPositive = ({value, config}) => {
  return compareSign(value, true, config)
}

export const isNegative = ({value, config}) => {
  return compareSign(value, false, config)
}

const compareWithOtherField = (value, otherFieldName, otherFieldLabel, siblings, config, op) => {
  if (config.isEmptyValue(value)) return null
  let numberValue = config.getNumber(value)
  if (isNaN(numberValue)) return {error: Errors.isNumber, params: {value}}

  let otherFieldValue = get(siblings, otherFieldName, null)
  if (config.isEmptyValue(otherFieldValue)) return null

  let otherNumberValue = config.getNumber(otherFieldValue)
  if (isNaN(otherNumberValue)) return null

  return op(numberValue, otherNumberValue) ? null : {
    params: {
      value,
      otherFieldValue: otherNumberValue,
      otherFieldLabel
    }
  }
}

export const numberGteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    const error = compareWithOtherField(value, fieldName, fieldLabel, siblings, config, gte)
    if (error) {
      if (!error.error) error.error = Errors.numberGteToField
      return config.formatError(error.error, error.params, config)
    }

    return null
  }
}

export const numberLteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    const error = compareWithOtherField(value, fieldName, fieldLabel, siblings, config, lte)
    if (error) {
      if (!error.error) error.error = Errors.numberLteToField
      return config.formatError(error.error, error.params, config)
    }

    return null
  }
}

export const numberWithinRange = (minValue, maxValue) => {
  if (process.env.NODE_ENV !== 'production') {
    if (isNil(minValue) || isNil(maxValue)) {
      throw new Error('minValue and maxValue cannot be null')
    } else if (minValue > maxValue) {
      throw new Error('minValue > maxValue')
    } else if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
      throw new Error('range value must be numbers')
    }
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
