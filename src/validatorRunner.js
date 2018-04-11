import {setWith, forEach, isArray, assign, isObject, omit, size, isNil, isFunction} from 'lodash'
import {ValidatorTypes} from './collections'

export const ValidatorRunner = function (entity, validators, config) {
  this.entity = entity
  this.validators = validators
  assign(this, config)
}

ValidatorRunner.prototype.run = function () {
  this.errors = {}
  this.validateObject(null, this.entity, this.validators, this.entity)
  return this.errors
}

ValidatorRunner.prototype.runFunctions = function (value, validations, siblings) {
  let err = null
  for (let i = 0; !err && i < validations.length; i++) {
    const validation = validations[i]
    err = validation({value, siblings, entity: this.entity, config: this})
  }
  return err
}

const ensureValidatorErrorIsValid = (error) => {
  if (isObject(error)) {
    if (isNil(error.error)) {
      throw new Error('a custom validator returned an error object without specifying the error property')
    }
    const purgedError = omit(error, ['error', 'params'])
    if (size(purgedError) > 0) {
      throw new Error('a custom validator returned an error object with unexpected properties. Additional properties should be added to the params attribute')
    }
  }
}

ValidatorRunner.prototype.setError = function (path, error, value) {
  if (process.env.NODE_ENV !== 'production') {
    ensureValidatorErrorIsValid(error)
  }
  const errorObject = isObject(error) ? error : {error, params: {value}}
  const formattedError = this.formatError(errorObject)
  setWith(this.errors, path, formattedError, Object)
}

ValidatorRunner.prototype.validateField = function (propPath, value, validations, siblings) {
  validations = isFunction(validations) ? [validations] : validations
  const error = this.runFunctions(value, validations, siblings)
  if (error) {
    this.setError(propPath, error, value)
  }
}

ValidatorRunner.prototype.applyValueValidatorOnObject = function (propPath, value, valueValidator, siblings) {
  const valueError = this.runFunctions(value, valueValidator, siblings)
  if (valueError) {
    this.setError(`${propPath}._error`, valueError, value)
  }
}

ValidatorRunner.prototype.validateCollectionOfObjects = function (propPath, objectsCollection, validator) {
  forEach(objectsCollection, (object, idx) => {
    const objectPath = `${propPath}.${idx}`
    this.validateObject(objectPath, object, validator, object, objectsCollection)
  })
}

ValidatorRunner.prototype.validateCollectionOfValues = function (propPath, valuesCollection, validator, siblings) {
  forEach(valuesCollection, (value, idx) => {
    const valuePath = `${propPath}.${idx}`
    const valueToValidate = this.getValue(valuesCollection, idx, validator, this)

    this.validateField(valuePath, valueToValidate, validator, siblings)
  })
}

ValidatorRunner.prototype.validateObject = function (objectPath, object, objectValidator, siblings) {
  for (let propNameToValidate in objectValidator) {
    const propValidations = objectValidator[propNameToValidate]
    const propPath = objectPath ? `${objectPath}.${propNameToValidate}` : propNameToValidate
    const value = this.getValue(object, propNameToValidate, propValidations, this)

    if (isArray(propValidations) || isFunction(propValidations)) {
      this.validateField(propPath, value, propValidations, siblings)
    } else if (!propValidations.__type) {
      this.validateObject(propPath, value, propValidations, value)
    }

    if (propValidations.__valueValidator) {
      this.applyValueValidatorOnObject(propPath, value, propValidations.__valueValidator, siblings)
    }

    if (propValidations.__type === ValidatorTypes.collectionOfObjects) {
      this.validateCollectionOfObjects(propPath, value, propValidations.__validator)
    } else if (propValidations.__type === ValidatorTypes.collectionOfValues) {
      this.validateCollectionOfValues(propPath, value, propValidations.__validator, object)
    }
  }
}
