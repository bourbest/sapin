import {forEach, isArray, isEmpty} from 'lodash'
import {PropertyDefinition, ValueTypes} from './types'
import Schema from './Schema'

const runFunctions = function (value, validations, getter, siblings, entity, params) {
  let err = null
  if (!isArray(validations)) {
    validations = [validations]
  }
  for (let i = 0; !err && i < validations.length; i++) {
    const validation = validations[i]
    err = validation({value, getter, siblings, entity, params})
  }
  return err
}

const validateCollectionOfObjects = function (objectsCollection, propertyValidator, entity, params, logUnknownProperties) {
  const errors = {}

  forEach(objectsCollection, (object, idx) => {
    const err = validateObject(objectsCollection[idx], propertyValidator.validators, objectsCollection[idx], entity, params, logUnknownProperties)
    if (err) {
      errors[idx.toString()] = err
    }
  })
  return isEmpty(errors) ? null : errors
}

const validateCollectionOfValues = function (valuesCollection, propDefinition, siblings, entity, params) {
  const errors = {}
  forEach(valuesCollection, (value, idx) => {
    const valueToValidate = valuesCollection[idx]
    const err = runFunctions(valueToValidate, propDefinition.validators.validators, propDefinition.validators.getter, valuesCollection, entity, params)
    if (err) {
      errors[idx.toString()] = err
    }
  })

  return isEmpty(errors) ? null : errors
}

const executeValidator = function (propValue, propDefinition, siblings, entity, params, logUnknownProperties) {
  if (propDefinition.valueType === ValueTypes.value) {
    return runFunctions(propValue, propDefinition.validators, propDefinition.getter, siblings, entity, params)
  } else {
    // execute the value validation first
    if (propDefinition.collectionValidator) {
      const _error = runFunctions(propValue, propDefinition.collectionValidator, propDefinition.getter, siblings, entity, params)
      if (_error) {
        return {_error}
      }
    }

    if (propDefinition.valueType === ValueTypes.collectionOfObjects) {
      return validateCollectionOfObjects(propValue, propDefinition, entity, params, logUnknownProperties)
    } else {
      return validateCollectionOfValues(propValue, propDefinition, siblings, entity, params)
    }
  }
}

const validateObject = function (object, schema, siblings, entity, params, logUnknownProperties) {
  const errors = {}
  for (let propName in schema) {
    const propValue = object ? object[propName] : null
    const propDefinition = schema[propName]
    let propErrors
    if (propDefinition instanceof PropertyDefinition) {
      propErrors = executeValidator(propValue, propDefinition, siblings, entity, params, logUnknownProperties)
    } else {
      propErrors = validateObject(propValue, propDefinition, propValue, entity, params, logUnknownProperties)
    }
    if (propErrors) {
      errors[propName] = propErrors
    }
  }

  if (logUnknownProperties) {
    for (let propName in object) {
      if (!schema[propName]) {
        errors[propName] = 'sapin.unknownProperty'
      }
    }
  }

  return isEmpty(errors) ? null : errors
}

export const validate = function (values, schema, params = null, logUnknownProperties = false) {
  return validateObject(values, schema.schema, values, values, params, logUnknownProperties)
}
