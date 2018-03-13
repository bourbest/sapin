import {isNil, get} from 'lodash'
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

export const isPositive = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  const numberValue = config.getNumber(value)
  if (isNaN(numberValue)) return config.formatError(Errors.isNumber, {value}, config)
  return numberValue >= 0 ? null : config.formatError(Errors.isPositive, {value}, config)
}

export const isNegative = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  const numberValue = config.getNumber(value)
  if (isNaN(numberValue)) return config.formatError(Errors.isNumber, {value}, config)
  return numberValue < 0 ? null : config.formatError(Errors.isNegative, {value}, config)
}

export const numberGteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    let otherValue = get(siblings, fieldName, null)
    if (config.isEmptyValue(value) || config.isEmptyValue(otherValue)) return null
    let numberValue = config.getNumber(value)
    let otherNumberValue = config.getNumber(otherValue)
    if (isNaN(numberValue) || isNaN(otherNumberValue)) return null

    return numberValue >= otherNumberValue ? null : config.formatError(Errors.numberGteToField, {
      value,
      otherFieldLabel: fieldLabel,
      otherFieldValue: otherNumberValue
    }, config)
  }
}

export const numberLteToField = (fieldName, fieldLabel) => {
  return ({value, siblings, config}) => {
    let otherValue = get(siblings, fieldName, null)
    if (config.isEmptyValue(value) || config.isEmptyValue(otherValue)) return null
    let numberValue = config.getNumber(value)
    let otherNumberValue = config.getNumber(otherValue)
    if (isNaN(numberValue) || isNaN(otherNumberValue)) return null

    return numberValue <= otherNumberValue ? null : config.formatError(Errors.numberLteToField, {
      value,
      otherFieldLabel: fieldLabel,
      otherFieldValue: otherNumberValue
    }, config)
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
    if (isNaN(numberValue)) return null
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
