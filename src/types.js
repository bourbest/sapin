import {identity, isArray, isFunction, every, isNil} from 'lodash'
import { getString, getNumber, getDate, getTrimmedString, getFriendlyNumber } from './getters'
import {isOfTypeArray, isOfTypeBool, isOfTypeDate, isNumber, isOfTypeObject, isOfTypeString} from './type-validators'
import {isPureObject} from './utils'

export const ValidationType = {
  value: 'value',
  collectionOfValues: 'collectionOfValues',
  collectionOfObjects: 'collectionOfObjects'
}

const validateValidators = (validationType, validators, argumentName = 'validators') => {
  let valid = false
  if (isNil(validators)) {
    valid = true
  } else if (validationType === ValidationType.value) {
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
  if (!ValidationType[validationType]) {
    throw new TypeError('validationType must be one of the values defined in ValidationType')
  }
}

function validateTransform (transform) {
  if (isNil(transform) || !isFunction(transform)) {
    throw new TypeError('transform must be a function')
  }
}

function validateTypeValidator (typeValidator) {
  if (!isNil(typeValidator) && !isFunction(typeValidator)) {
    throw new TypeError('typeValidator is optional but must be a Validation function is given')
  }
}

export function PropertyValidator (validationType, transform, validators = [], typeValidator, collectionValidator = null) {
  validateValidationType(validationType)
  validateTransform(transform)
  validateValidators(validationType, validators)
  validateTypeValidator(typeValidator)
  validateValidators(ValidationType.value, collectionValidator, 'collectionValidator')
  this.validationType = validationType
  this.transform = transform
  if (typeValidator) {
    this.validators = addTypeValidation(validators, typeValidator)
  } else {
    this.validators = validators
  }
  this.collectionValidator = collectionValidator
}

export const string = (validators, options) => {
  const noTrim = options && options.useTrim === false
  const transform = noTrim ? getString : getTrimmedString
  return new PropertyValidator(ValidationType.value, transform, validators, isOfTypeString)
}

export const number = (validators, options) => {
  const noReplace = options && options.replaceComa === false
  const transform = noReplace ? getNumber : getFriendlyNumber
  return new PropertyValidator(ValidationType.value, transform, validators, isNumber)
}

export const date = (validators) => {
  return new PropertyValidator(ValidationType.value, getDate, validators, isOfTypeDate)
}

export const boolean = (validators) => {
  return new PropertyValidator(ValidationType.value, identity, validators, isOfTypeBool)
}

const getCollectionType = (validators) => {
  if (validators instanceof PropertyValidator) {
    return ValidationType.collectionOfValues
  } else if (isPureObject(validators)) {
    return ValidationType.collectionOfObjects
  }
  throw new TypeError('expect a type (ex.: string, number, etc.) or an object the expected properties')
}

function makeCollection (validators, collectionValidator, typeValidation) {
  validateValidators(ValidationType.value, collectionValidator, 'collectionValidator')
  if (isFunction(validators)) {
    validators = validators()
  }
  const type = getCollectionType(validators)
  collectionValidator = addTypeValidation(collectionValidator, typeValidation)
  return new PropertyValidator(type, identity, validators, null, collectionValidator)
}

export const arrayOf = (validators, collectionValidator = []) => {
  return makeCollection(validators, collectionValidator, isOfTypeArray)
}

export const dictionary = (validators, collectionValidator = []) => {
  return makeCollection(validators, collectionValidator, isOfTypeObject)
}
