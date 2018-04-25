import {isNil, isArray, isObject, isFunction, every} from 'lodash'
export const ValidatorTypes = {
  object: 1,
  collectionOfValues: 2,
  collectionOfObjects: 3
}

const isObjectOrArrayOfFunctions = (target) => {
  let ret = false
  if (isArray(target)) {
    ret = every(target, isFunction)
  } else {
    ret = isObject(target)
  }
  return ret
}

const ensureCollectionParamsAreValid = (validator, valueValidator) => {
  if (!isObjectOrArrayOfFunctions(validator)) {
    throw new Error('The \'validator\' argument of collection must be a validator object or an array of validator functions')
  } else if (!isNil(valueValidator) && !isObjectOrArrayOfFunctions(valueValidator)) {
    throw new Error('The \'valueValidator\' argument of collection must be a validator object or an array of validator functions')
  }
}

export const collection = (validator, valueValidator) => {
  const ret = {
    __validator: validator,
    __valueValidator: valueValidator
  }

  /* istanbul ignore else: node-env */
  if (process.env.NODE_ENV !== 'production') {
    ensureCollectionParamsAreValid(validator, valueValidator)
  }

  // validator is either an array or an object when we reach this point
  if (isArray(validator) || isFunction(validator)) {
    ret.__type = ValidatorTypes.collectionOfValues
  } else {
    ret.__type = ValidatorTypes.collectionOfObjects
  }
  return ret
}
