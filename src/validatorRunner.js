import {set, setWith, forEach, isArray, assign} from 'lodash'
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

ValidatorRunner.prototype.validateField = function (propPath, value, validations, siblings) {
  const err = this.runFunctions(value, validations, siblings)
  if (err) {
    setWith(this.errors, propPath, err, Object)
  }
}

ValidatorRunner.prototype.applyValueValidatorOnObject = function (propPath, value, valueValidator, siblings) {
  const valueError = this.runFunctions(value, valueValidator, siblings)
  if (valueError) {
    set(this.errors, `${propPath}._error`, valueError)
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

    if (isArray(propValidations)) {
      this.validateField(propPath, value, propValidations, siblings)
    } else if (!propValidations.__type) {
      this.validateObject(propPath, value, propValidations, object)
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
