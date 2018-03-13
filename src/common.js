import {get, trim, isArray, isString, keys, filter} from 'lodash'

export const Errors = {
  required: 'required',
  isNumber: 'invalidNumber',
  isInteger: 'invalidInteger',
  isPositive: 'valueShouldBePositive',
  isNegative: 'valueShouldBeNegative',
  numberGteToField: 'valueShouldBeGteField',
  numberLteToField: 'valueShouldBeLteField',
  numberWithinRange: 'valueNotInRange',
  minLength: 'valueNotLongEnough',
  maxLength: 'valueTooLong',
  isEmail: 'invalidEmail'
}

export const noTrim = () => true

const internalFormatError = (error, errorParams /*, config */) => {
  return {error, params: errorParams}
}

const getValue = (entity, path, validators, config) => {
  let value = get(entity, path, undefined)
  if (typeof value === 'string' && config.useTrim) {
    if (!isArray(validators) || validators.indexOf(noTrim) === -1) {
      value = trim(value)
    }
  }
  return value
}

// caller should not pass undefined or null
const getNumber = (value) => {
  let transformedValue = value
  if (isString(transformedValue)) {
    transformedValue = transformedValue.replace(',', '.')
  }
  return Number(transformedValue)
}

const isEmptyValue = (value) => value === undefined || value === null || value === ''

export const defaultConfig = {
  formatError: internalFormatError,
  getValue,
  getNumber,
  isEmptyValue,
  useTrim: true,
  params: {}
}

export const createConfig = (newConfig) => {
  const config = Object.assign({}, defaultConfig, newConfig)
  if (process.env.NODE_ENV !== 'production') {
    const KNOWN_KEYS = new Set(keys(defaultConfig))
    const unexpectedKeys = filter(keys(newConfig), key => !KNOWN_KEYS.has(key))
    if (unexpectedKeys.length) {
      throw new Error(`createConfig received an unexpected key '${unexpectedKeys.join(', ')}'`)
    }
  }
  return config
}
