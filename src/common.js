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
  return {
    error,
    params: errorParams
  }
}

const config = {
  formatError: internalFormatError,
  formatErrorParams: null
}

export const isEmptyValue = (value) => value === undefined || value === null || value === ''

export const configureValidators = ({formatError, formatErrorParams}) => {
  config.formatError = formatError
  config.formatErrorParams = formatErrorParams
}

export const err = (error, params) => {
  return config.formatError(error, params, config.formatErrorParams)
}
