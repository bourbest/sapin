import {isObject, isArray, isFunction, keys, omit} from 'lodash'
import {defaultConfig} from './common'
import {ValidatorRunner} from './validatorRunner'

const internalProps = ['__type', '__validator', '__valueValidator']

const ensureArrayContainsOnlyFunctions = (validator, propName) => {
  for (let i = 0; i < validator.length; i++) {
    if (!isFunction(validator[i])) {
      throw new Error(`validator definition at path ${propName} expects an array of functions. Item a index ${i} isn't one`)
    }
  }
}
const ensureValidatorIsValid = (validator, propName) => {
  if (isArray(validator)) {
    ensureArrayContainsOnlyFunctions(validator, propName)
  } else if (isObject(validator)) {
    const propValidators = keys(omit(validator, internalProps))
    propValidators.forEach(prop => {
      const childPropName = `${propName}.${prop}`
      ensureValidatorIsValid(validator[prop], childPropName)
    })
  } else {
    throw new Error(`validator definition at path ${propName} must be an object or an array of validator function`)
  }
}

export const validate = (values, validator, config = null) => {
  config = config || defaultConfig
  if (process.env.NODE_ENV !== 'production') {
    if (!isObject(validator)) {
      throw new Error('validate second argument must be a validator object')
    }
    for (let prop in validator) {
      ensureValidatorIsValid(validator[prop], prop)
    }
  }

  const runner = new ValidatorRunner(values, validator, config)
  return runner.run()
}
