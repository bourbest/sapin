import {forEach, isArray, isFunction, isEmpty, isNil} from 'lodash'
import { PropertyValidator, ValidationType } from './types'
import { isPureObject } from './utils'

function validateSchema (schema, pathArray) {
  for (let propName in schema) {
    let prop = schema[propName]
    if (isFunction(prop)) {
      prop = schema[propName] = prop()
    }

    const subPath = pathArray.concat([propName])
    if (prop instanceof PropertyValidator) {
      if (prop.validationType === ValidationType.collectionOfObjects) {
        validateSchema(prop.validators, subPath)
      }
    } else if (isPureObject(prop)) {
      validateSchema(prop, subPath)
    } else {
      const path = subPath.join('.')
      throw new TypeError(`Expect an object or a type function (ex.: string, number) in schema at property ${path}`)
    }
  }
}

function SchemaValidator (schema) {
  if (isNil(schema) || !isPureObject(schema)) {
    throw new TypeError('schema must be a valid schema object')
  }
  validateSchema(schema, [])
  this.schema = schema
}

const runFunctions = function (value, validations, transform, siblings, entity) {
  let err = null
  if (!isArray(validations)) {
    validations = [validations]
  }
  for (let i = 0; !err && i < validations.length; i++) {
    const validation = validations[i]
    err = validation({value, transform, siblings, entity})
  }
  return err
}

const validateCollectionOfObjects = function (objectsCollection, propertyValidator, entity) {
  const errors = {}

  forEach(objectsCollection, (object, idx) => {
    const err = validateObject(objectsCollection[idx], propertyValidator.validators, objectsCollection[idx], entity)
    if (err) {
      errors[idx.toString()] = err
    }
  })
  return isEmpty(errors) ? null : errors
}

const validateCollectionOfValues = function (valuesCollection, validator, siblings, entity) {
  const errors = {}
  forEach(valuesCollection, (value, idx) => {
    const valueToValidate = valuesCollection[idx]
    const err = runFunctions(valueToValidate, validator.validators.validators, validator.transform, valuesCollection, entity)
    if (err) {
      errors[idx.toString()] = err
    }
  })

  return isEmpty(errors) ? null : errors
}

const executeValidator = function (propValue, propValidator, siblings, entity) {
  if (propValidator.validationType === ValidationType.value) {
    return runFunctions(propValue, propValidator.validators, propValidator.transform, siblings, entity)
  } else {
    // execute the value validation first
    if (propValidator.collectionValidator) {
      const _error = runFunctions(propValue, propValidator.collectionValidator, propValidator.transform, siblings, entity)
      if (_error) {
        return {_error}
      }
    }

    if (propValidator.validationType === ValidationType.collectionOfObjects) {
      return validateCollectionOfObjects(propValue, propValidator, entity)
    } else {
      return validateCollectionOfValues(propValue, propValidator, siblings, entity)
    }
  }
}

const validateObject = function (object, schema, siblings, entity) {
  const errors = {}
  for (let propName in schema) {
    const propValue = object ? object[propName] : null
    const propValidator = schema[propName]
    let propErrors
    if (propValidator instanceof PropertyValidator) {
      propErrors = executeValidator(propValue, propValidator, siblings, entity)
    } else {
      propErrors = validateObject(propValue, propValidator, propValue, entity)
    }
    if (propErrors) {
      errors[propName] = propErrors
    }
  }

  return isEmpty(errors) ? null : errors
}

SchemaValidator.prototype.validate = function (values) {
  return validateObject(values, this.schema, values, values)
}

export default SchemaValidator
