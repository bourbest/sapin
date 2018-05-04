import {isArray} from 'lodash'
import {isPureObject} from './utils'
import {PropertyDefinition, ValueTypes} from './types'
import {isOfTypeArray, isOfTypeObject} from './type-validators'

const transformWithPropDefinition = (propValue, propDefinition) => {
  if (propDefinition.valueType === ValueTypes.value) {
    return propDefinition.transform(propValue)
  } else if (isArray(propValue) && propDefinition.collectionValidator.indexOf(isOfTypeArray) > -1) {
    const valueValidator = propDefinition.validators
    return propValue.map(value => valueValidator.transform(value))
  } else if (isPureObject(propValue) && propDefinition.collectionValidator.indexOf(isOfTypeObject) > -1) {
    const ret = {}
    for (let idx in propValue) {
      ret[idx] = transformObject(propValue[idx], propDefinition.validators)
    }
    return ret
  }
  return propValue
}

function transformObject (object, schema) {
  const ret = {}
  for (let propName in object) {
    const propValue = object[propName]
    const propDefinition = schema[propName]
    if (propDefinition instanceof PropertyDefinition) {
      ret[propName] = transformWithPropDefinition(propValue, propDefinition)
    } else if (propValue && propDefinition) {
      ret[propName] = transformObject(propValue, propDefinition)
    } else {
      ret[propName] = propValue
    }
  }
  return ret
}

const transform = (entity, schemaValidator) => {
  return transformObject(entity, schemaValidator.schema)
}

export default transform
