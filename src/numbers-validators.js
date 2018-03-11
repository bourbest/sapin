import {isNil, get, isString} from 'lodash'
import {
  err,
  Errors,
  isEmptyValue
} from './common'

// caller should not pass undefined or null
const getTransformedNumber = (value) => {
  let transformedValue = value
  if (isString(transformedValue)) {
    transformedValue = transformedValue.replace(',', '.')
  }
  return Number(transformedValue)
}

export const isNumber = (value) => {
  if (isEmptyValue(value)) return null
  const valueToTest = getTransformedNumber(value)
  return isNaN(valueToTest) ? err(Errors.isNumber) : null
}

export const isInteger = (value) => {
  if (isEmptyValue(value)) return null
  const numberValue = getTransformedNumber(value)
  return (!Number.isInteger(numberValue)) ? err(Errors.isInteger) : null
}

export const isPositive = (value) => {
  if (isEmptyValue(value)) return null
  const numberValue = getTransformedNumber(value)
  if (isNaN(numberValue)) return err(Errors.isNumber)
  return numberValue >= 0 ? null : err(Errors.isPositive)
}

export const isNegative = (value) => {
  if (isEmptyValue(value)) return null
  const numberValue = getTransformedNumber(value)
  if (isNaN(numberValue)) return err(Errors.isNumber)
  return numberValue < 0 ? null : err(Errors.isNegative)
}

export const numberGteToField = (fieldName, fieldLabel) => {
  return (value, entity) => {
    let otherValue = get(entity, fieldName, null)
    if (isEmptyValue(value) || isEmptyValue(otherValue)) return null
    let numberValue = getTransformedNumber(value)
    let otherNumberValue = getTransformedNumber(otherValue)
    if (isNaN(numberValue) || isNaN(otherNumberValue)) return null

    return numberValue >= otherNumberValue ? null : err(Errors.numberGteToField, {
      otherFieldName: fieldLabel,
      otherFieldValue: otherNumberValue
    })
  }
}

export const numberLteToField = (fieldName, fieldLabel) => {
  return (value, entity) => {
    let otherValue = get(entity, fieldName, null)
    if (isEmptyValue(value) || isEmptyValue(otherValue)) return null
    let numberValue = getTransformedNumber(value)
    let otherNumberValue = getTransformedNumber(otherValue)
    if (isNaN(numberValue) || isNaN(otherNumberValue)) return null

    return numberValue <= otherNumberValue ? null : err(Errors.numberLteToField, {
      otherFieldName: fieldLabel,
      otherFieldValue: otherNumberValue
    })
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

  return (value) => {
    if (isEmptyValue(value)) return null
    const numberValue = getTransformedNumber(value)
    if (isNaN(numberValue)) return null
    return (numberValue >= minValue && numberValue <= maxValue) ? null : err(Errors.numberWithinRange, {minValue, maxValue})
  }
}
