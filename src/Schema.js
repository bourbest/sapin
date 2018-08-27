import {isArray, isFunction, isNil} from 'lodash'
import {PropertyDefinition, ValueTypes} from './types'
import {isPureObject} from './utils'
import {getString} from './getters'

function validateSchema (schema, pathArray, noTypes) {
  for (let propName in schema) {
    let prop = schema[propName]

    if (noTypes) {
      if (isFunction(prop) || isArray(prop)) {
        prop = schema[propName] = new PropertyDefinition(ValueTypes.value, getString, prop)
      }
    } else if (isFunction(prop)) {
      prop = schema[propName] = prop()
    }

    const subPath = pathArray.concat([propName])
    if (prop instanceof Schema) {
      schema[propName] = prop.schema
    } else if (prop instanceof PropertyDefinition) {
      if (prop.valueType === ValueTypes.collectionOfObjects) {
        validateSchema(prop.validators, subPath, noTypes)
      }
    } else if (isPureObject(prop)) {
      validateSchema(prop, subPath, noTypes)
    } else {
      const path = subPath.join('.')
      if (noTypes) {
        throw new TypeError(`Expect a collection or validator at property ${path}`)
      }
      throw new TypeError(`Expect an object or a type function (ex.: string, number) in schema at property ${path}`)
    }
  }
}

function Schema (schema, noTypes = false) {
  if (isNil(schema) || !isPureObject(schema)) {
    throw new TypeError('schema must be a valid schema object')
  }
  validateSchema(schema, [], noTypes)
  this.schema = schema
}

export default Schema
