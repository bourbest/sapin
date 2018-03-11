import {get, set, isObject, setWith, forOwn, forEach, isNil, isArray, isEmpty, isString, keys} from 'lodash'
import {ValidatorTypes} from './collections'

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

export const validateField = (value, validations, siblings, entity) => {
  let err = null
  if (validations.__type === ValidatorTypes.object) {
    const validator = validations.__validator
    const valueKeys = keys(value)
    for (let i = 0; i < valueKeys.length; i++) {
      const key = valueKeys[i]
      const val = value[key]
      const error = validateField(val, validator, siblings, entity)
      if (error) {
        return {[key]: error}
      }
    }
  } else {
    for (let i = 0; !err && i < validations.length; i++) {
      const validation = validations[i]
      err = validation(value, entity)
    }
  }
  return err
}

const validateCollectionOfObjects = (objectCollection, validator) => {
  const collectionErrors = {}

  if (objectCollection) {
    forEach(objectCollection, (entity, idx) => {
      let entityErrors = applyValidator(entity, validator)
      if (!isEmpty(entityErrors)) {
        collectionErrors[idx] = entityErrors
      }
    })
  }
  return collectionErrors
}

export const applyValidator = (entity, validator) => {
  const entityErrors = {}

  if (process.env.NODE_ENV !== 'production') {
    if (!isObject(validator)) {
      throw new Error('applyValidator second argument must be a validator object')
    }
    for (let prop in validator) {
      ensureValidatorIsValid(validator[prop], prop)
    }
  }

  forOwn(validator, (fieldValidations, fieldName) => {
    const fieldValue = get(entity, fieldName)
    if (isArray(fieldValidations)) {
      const fieldError = validateField(fieldValue, fieldValidations, entity)
      if (fieldError) {
        set(entityErrors, fieldName, fieldError)
      }
    } else {
      if (fieldValidations.__valueValidator) {
        const valueError = validateField(fieldValue, fieldValidations.__valueValidator)
        if (valueError) {
          set(entityErrors, `${fieldName}._error`, valueError)
        }
      }

      if (fieldValidations.__type === ValidatorTypes.collectionOfObjects) {
        const fieldError = validateCollectionOfObjects(fieldValue, fieldValidations.__validator)
        if (fieldError) {
          for (let propName in fieldError) {
            const propError = fieldError[propName]
            if (propError) {
              setWith(entityErrors, `${fieldName}.${propName}`, propError, Object)
            }
          }

        }
      } else if (fieldValidations.__type === ValidatorTypes.collectionOfValues) {
        forEach(fieldValue, (value, key) => {
          const fieldError = validateField(value, fieldValidations.__validator, entity)
          if (!isEmpty(fieldError)) {
            setWith(entityErrors, `${fieldName}[${key}]`, fieldError, Object)
          }
        })
      }
    }
  })

  return entityErrors
}
