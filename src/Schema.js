import {forEach, isArray, isFunction, isEmpty, isNil} from 'lodash'
import { PropertyDefinition, ValueTypes } from './types'
import { isPureObject } from './utils'

function validateSchema (schema, pathArray) {
  for (let propName in schema) {
    let prop = schema[propName]
    if (isFunction(prop)) {
      prop = schema[propName] = prop()
    }

    const subPath = pathArray.concat([propName])
    if (prop instanceof Schema) {
      schema[propName] = prop.schema
    } else if (prop instanceof PropertyDefinition) {
      if (prop.valueType === ValueTypes.collectionOfObjects) {
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

function Schema (schema) {
  if (isNil(schema) || !isPureObject(schema)) {
    throw new TypeError('schema must be a valid schema object')
  }
  validateSchema(schema, [])
  this.schema = schema
}

export default Schema
