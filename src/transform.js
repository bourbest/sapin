import {isArray, isObject} from 'lodash'
import {PropertyValidator, ValidationType} from './types'
import {isOfTypeArray, isOfTypeObject} from './type-validators'

const transformWithValidator = (propValue, propValidator) => {
  if (propValidator.validationType === ValidationType.value) {
    return propValidator.get(propValue, propValidator.options)
  } else if (isArray(propValue) && propValidator.valueValidator === isOfTypeArray) {
    const valueValidator = propValidator.validators
    return propValue.map(value => valueValidator.get(value, valueValidator.options))
  } else if (isObject(propValue) && propValidator.valueValidator === isOfTypeObject) {
    return transform(propValue, propValidator.validators)
  }
  return propValue
}

const transform = (entity, schema) => {
  const ret = {}
  for (let propName in entity) {
    const propValue = entity[propName]
    const propValidator = schema[propName]
    if (propValidator instanceof PropertyValidator) {
      ret[propName] = transformWithValidator(propValue, propValidator)
    } else if (propValue && propValidator) {
      ret[propName] = transform(propValue, propValidator)
    } else {
      ret[propName] = propValue
    }
  }
  return ret
}

export default transform
