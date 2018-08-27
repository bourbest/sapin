import {identity, isArray, isFunction, every, isNil} from 'lodash'
import { getString, getNumber, getDate, getTrimmedString, getFriendlyNumber , getBool} from './getters'
import {isOfTypeArray, isOfTypeBool, isOfTypeDate, isNumber, isOfTypeObject, isOfTypeString} from './type-validators'
import {isPureObject} from './utils'
import Schema from './Schema'

export const ValueTypes = {
  value: 'value',
  collectionOfValues: 'collectionOfValues',
  collectionOfObjects: 'collectionOfObjects'
}

const validateValidators = (validationType, validators, argumentName = 'validators') => {
  let valid = false
  if (isNil(validators)) {
    valid = true
  } else if (validationType === ValueTypes.value) {
    if (isArray(validators)) {
      valid = every(validators, isFunction)
    } else {
      valid = isFunction(validators)
    }
  } else { // collection
    valid = isPureObject(validators)
  }

  if (!valid) {
    throw new TypeError(`${argumentName} must be a function or an array of functions`)
  }
}

function addTypeValidation (validators, typeValidator) {
  if (isArray(validators)) {
    return [typeValidator].concat(validators)
  } else if (validators) {
    return [typeValidator, validators]
  }
  return [typeValidator]
}

function validateValidationType (validationType) {
  if (!ValueTypes[validationType]) {
    throw new TypeError('valueType must be one of the values defined in ValueTypes')
  }
}

function validateGetter (getter) {
  if (isNil(getter) || !isFunction(getter)) {
    throw new TypeError('getter must be a function')
  }
}

function validateTransform (transform) {
  if (!isNil(transform) && !isFunction(transform)) {
    throw new TypeError('transform must be a function')
  }
}

function validateTypeValidator (typeValidator) {
  if (!isNil(typeValidator) && !isFunction(typeValidator)) {
    throw new TypeError('typeValidator is optional but must be a Validation function if given')
  }
}

export function PropertyDefinition (valueType, getter, validators = [], typeValidator = null, transform = null, collectionValidator = null) {
  validateValidationType(valueType)
  validateGetter(getter)
  validateValidators(valueType, validators)
  validateTypeValidator(typeValidator)
  validateTransform(transform)
  validateValidators(ValueTypes.value, collectionValidator, 'collectionValidator')

  this.valueType = valueType
  this.getter = getter
  this.transform = transform || getter
  if (typeValidator) {
    this.validators = addTypeValidation(validators, typeValidator)
  } else {
    this.validators = validators
  }
  this.collectionValidator = collectionValidator
}

export const string = (validators, options) => {
  const noTrim = options && options.useTrim === false
  const getter = noTrim ? getString : getTrimmedString
  return new PropertyDefinition(ValueTypes.value, getter, validators, isOfTypeString)
}

export const number = (validators, options) => {
  const noReplace = options && options.replaceComa === false
  const getter = noReplace ? getNumber : getFriendlyNumber
  return new PropertyDefinition(ValueTypes.value, getter, validators, isNumber)
}

export const date = (validators) => {
  return new PropertyDefinition(ValueTypes.value, getDate, validators, isOfTypeDate)
}

export const boolean = (validators) => {
  return new PropertyDefinition(ValueTypes.value, getBool, validators, isOfTypeBool)
}

export const object = (validators) => {
  return new PropertyDefinition(ValueTypes.value, identity, validators, isOfTypeObject)
}

const getCollectionType = (validators) => {
  if (validators instanceof PropertyDefinition) {
    return ValueTypes.collectionOfValues
  } else if (isPureObject(validators)) {
    return ValueTypes.collectionOfObjects
  }
  throw new TypeError('expect a type (ex.: string, number, etc.) or an object the expected properties')
}

function makeCollection (validators, collectionValidator, typeValidation) {
  validateValidators(ValueTypes.value, collectionValidator, 'collectionValidator')
  if (isFunction(validators)) {
    validators = validators()
  } else if (validators instanceof Schema) {
    validators = validators.schema
  }
  const type = getCollectionType(validators)
  collectionValidator = addTypeValidation(collectionValidator, typeValidation)
  return new PropertyDefinition(type, identity, validators, null, null, collectionValidator)
}

export const arrayOf = (validators, collectionValidator = []) => {
  return makeCollection(validators, collectionValidator, isOfTypeArray)
}

export const dictionary = (validators, collectionValidator = []) => {
  return makeCollection(validators, collectionValidator, isOfTypeObject)
}
