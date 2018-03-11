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

const internalFormatError = (error, errorParams, formatParams) => {
  if (errorParams) {
    return {error, params: errorParams}
  }
  return error
}

export const config = {
  formatError: internalFormatError,
  formatErrorParams: null,
  useTrim: true
}

export const isEmptyValue = (value) => value === undefined || value === null || value === ''

export const configureValidators = (newConfig) => {
  if (process.env.NODE_ENV !== 'production') {
    const KNOWN_KEYS = new Set(['formatError', 'formatErrorParams', 'useTrim'])
    for (let prop in newConfig) {
      if (!KNOWN_KEYS.has(prop)) {
        throw new Error(`configureValidators received an unexpected key '${prop}'`)
      }
    }
  }
  for (let prop in newConfig) {
    config[prop] = newConfig[prop]
  }
}

export const err = (error, params) => {
  return config.formatError(error, params, config.formatErrorParams)
}
