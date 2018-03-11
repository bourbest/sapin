import {get, set, isObject, setWith, forOwn, forEach, isNil, isArray, isEmpty, isString, keys, trim} from 'lodash'
import {ValidatorTypes} from './collections'
import {config} from './common'

const internalProps = new Set(['__type', '__validator', '__valueValidator'])
const ensureValidatorIsValid = (validator, propName) => {
  if (isObject(validator)) {
    for (let prop in validator) {
      if (!internalProps.has(prop)) {
        const childPropName = `${propName}.${prop}`
        ensureValidatorIsValid(validator[prop], childPropName)
      }
    }
  } else if (isArray(validator)) {
    for (let i = 0; i < validator.length; i++) {
      if (!isFunction(validator[i])) {
        throw new Error(`validator definition at path ${propName} expects an array of functions. Item a index ${i} isn't one`)
      }
    }
  } else {
    throw new Error(`validator definition at path ${propName} must be an object or an array of validator function`)
  }
}

const getValue = (entity, path, validators) => {
  let value = get(entity, path, null)
  if (typeof value === 'string' && config.useTrim) {
    if (!isArray(validators) && validators.indexOf(noTrim) === -1) {
      value = trim(value)
    }
  }
  return value
}

export const validateField = (value, validations, siblings, entity) => {
  let err = null

  for (let i = 0; !err && i < validations.length; i++) {
    const validation = validations[i]
    err = validation(value, siblings, entity)
  }

  return err
}

const validateCollectionOfObjects = (objectCollection, validator, siblings, entity) => {
  const collectionErrors = {}

  if (objectCollection) {
    forEach(objectCollection, (value, idx) => {
      const entityErrors = applyValidator(value, validator, value, entity)
      if (!isEmpty(entityErrors)) {
        collectionErrors[idx] = entityErrors
      }
    })
  }
  return collectionErrors
}

export const applyValidator = (value, validator, siblings, entity) => {
  siblings = siblings || value
  entity = entity || value
  const entityErrors = {}

  if (process.env.NODE_ENV !== 'production') {
    if (!isObject(validator)) {
      throw new Error('applyValidator second argument must be a validator object')
    }
    for (let prop in validator) {
      ensureValidatorIsValid(validator[prop], prop)
    }
  }

  for (let fieldName in validator) {
    const fieldValidations = validator[fieldName]
    const fieldValue = getValue(value, fieldName, fieldValidations)

    if (isArray(fieldValidations)) {
      const fieldError = validateField(fieldValue, fieldValidations, siblings, entity)
      if (fieldError) {
        set(entityErrors, fieldName, fieldError)
      }
    } else {
      if (fieldValidations.__valueValidator) {
        const valueError = validateField(fieldValue, fieldValidations.__valueValidator, siblings, entity)
        if (valueError) {
          set(entityErrors, `${fieldName}._error`, valueError)
        }
      }

      if (fieldValidations.__type === ValidatorTypes.collectionOfObjects) {
        const fieldError = validateCollectionOfObjects(fieldValue, fieldValidations.__validator, siblings, entity)
        if (fieldError) {
          for (let propName in fieldError) {
            const propError = fieldError[propName]
            if (propError) {
              setWith(entityErrors, `${fieldName}.${propName}`, propError, Object)
            }
          }
        }
      } else if (fieldValidations.__type === ValidatorTypes.collectionOfValues) {
        for (let key in fieldValue) {
          const valueToValidate = getValue(fieldValue, key, fieldValidations.__validator)

          const fieldError = validateField(valueToValidate, fieldValidations.__validator, siblings, entity)
          if (!isEmpty(fieldError)) {
            setWith(entityErrors, `${fieldName}.${key}`, fieldError, Object)
          }
        }
      }
    }
  }

  return entityErrors
}
