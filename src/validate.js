import {forEach, isArray, isEmpty} from 'lodash'
import {PropertyDefinition, ValueTypes} from './types'

const runFunctions = function (value, validations, getter, siblings, globals) {
  let err = null
  if (!isArray(validations)) {
    validations = [validations]
  }
  const params = {
    value,
    getter,
    siblings,
    entity: globals.entity,
    params: globals.params
  }
  for (let i = 0; !err && i < validations.length; i++) {
    const validation = validations[i]
    err = validation(params)
  }
  return err
}

const validateCollectionOfObjects = function (objectsCollection, propertyValidator, globals) {
  const errors = {}

  forEach(objectsCollection, (object, idx) => {
    const err = validateObject(objectsCollection[idx], propertyValidator.validators, objectsCollection[idx], globals)
    if (err) {
      errors[idx.toString()] = err
    }
  })
  return isEmpty(errors) ? null : errors
}

const validateCollectionOfValues = function (valuesCollection, propDefinition, siblings, globals) {
  const errors = {}
  forEach(valuesCollection, (value, idx) => {
    const valueToValidate = valuesCollection[idx]
    const err = runFunctions(valueToValidate, propDefinition.validators.validators, propDefinition.validators.getter, valuesCollection, globals)
    if (err) {
      errors[idx.toString()] = err
    }
  })

  return isEmpty(errors) ? null : errors
}

const executeValidator = function (propValue, propDefinition, siblings, globals) {
  if (propDefinition.valueType === ValueTypes.value) {
    return runFunctions(propValue, propDefinition.validators, propDefinition.getter, siblings, globals)
  } else {
    // execute the value validation first
    if (propDefinition.collectionValidator) {
      const _error = runFunctions(propValue, propDefinition.collectionValidator, propDefinition.getter, siblings, globals)
      if (_error) {
        return {_error}
      }
    }

    if (propDefinition.valueType === ValueTypes.collectionOfObjects) {
      return validateCollectionOfObjects(propValue, propDefinition, globals)
    } else {
      return validateCollectionOfValues(propValue, propDefinition, siblings, globals)
    }
  }
}

const validateObject = function (object, schema, siblings, globals) {
  const errors = {}
  for (let propName in schema) {
    const propValue = object ? object[propName] : null
    const propDefinition = schema[propName]
    let propErrors
    if (propDefinition instanceof PropertyDefinition) {
      propErrors = executeValidator(propValue, propDefinition, siblings, globals)
    } else {
      propErrors = validateObject(propValue, propDefinition, propValue, globals)
    }
    if (propErrors) {
      errors[propName] = propErrors
    }
  }

  if (globals.logUnknownProperties) {
    for (let propName in object) {
      if (!schema[propName]) {
        errors[propName] = 'sapin.unknownProperty'
      }
    }
  }

  return isEmpty(errors) ? null : errors
}

export const validate = function (values, schema, params = null, logUnknownProperties = false) {
  const globals = {
    entity: values,
    params,
    logUnknownProperties
  }
  return validateObject(values, schema.schema, values, globals)
}
