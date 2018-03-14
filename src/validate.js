import {set, isObject, setWith, forEach, isArray, isEmpty, isFunction, keys, omit} from 'lodash'
import {ValidatorTypes} from './collections'
import {defaultConfig} from './common'

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

export const validateField = (value, validations, siblings, entity, config) => {
  let err = null

  for (let i = 0; !err && i < validations.length; i++) {
    const validation = validations[i]
    err = validation({value, siblings, entity, config})
  }

  return err
}

const validateCollectionOfObjects = (objectCollection, validator, siblings, entity, config) => {
  const collectionErrors = {}

  if (objectCollection) {
    forEach(objectCollection, (value, idx) => {
      const entityErrors = applyValidator(value, validator, value, entity, config)
      if (!isEmpty(entityErrors)) {
        collectionErrors[idx] = entityErrors
      }
    })
  }
  return collectionErrors
}

const applyValidator = (value, validator, siblings, entity, config) => {
  const entityErrors = {}

  for (let fieldName in validator) {
    const fieldValidations = validator[fieldName]
    const fieldValue = config.getValue(value, fieldName, fieldValidations, config)

    if (isArray(fieldValidations)) {
      const fieldError = validateField(fieldValue, fieldValidations, siblings, entity, config)
      if (fieldError) {
        set(entityErrors, fieldName, fieldError)
      }
    } else {
      if (fieldValidations.__valueValidator) {
        const valueError = validateField(fieldValue, fieldValidations.__valueValidator, siblings, entity, config)
        if (valueError) {
          set(entityErrors, `${fieldName}._error`, valueError)
        }
      }

      if (fieldValidations.__type === ValidatorTypes.collectionOfObjects) {
        const fieldError = validateCollectionOfObjects(fieldValue, fieldValidations.__validator, siblings, entity, config)
        for (let propName in fieldError) {
          const propError = fieldError[propName]
          setWith(entityErrors, `${fieldName}.${propName}`, propError, Object)
        }
      } else if (fieldValidations.__type === ValidatorTypes.collectionOfValues) {
        for (let key in fieldValue) {
          const valueToValidate = config.getValue(fieldValue, key, fieldValidations.__validator, config)

          const fieldError = validateField(valueToValidate, fieldValidations.__validator, siblings, entity, config)
          if (!isEmpty(fieldError)) {
            setWith(entityErrors, `${fieldName}.${key}`, fieldError, Object)
          }
        }
      } else {
        const valueError = applyValidator(fieldValue, fieldValidations, fieldValue, entity, config)
        if (!isEmpty(valueError)) {
          set(entityErrors, fieldName, valueError)
        }
      }
    }
  }

  return entityErrors
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
  return applyValidator(values, validator, values, values, config)
}
