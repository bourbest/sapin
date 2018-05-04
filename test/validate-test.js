import {expect} from 'chai'
import {identity} from 'lodash'
import { string, number, arrayOf, PropertyDefinition, ValueTypes } from '../src/types'
import {required} from '../src/required-validators'
import {isPositive} from '../src/numbers-validators'
import Schema from '../src/Schema'
import { Errors } from '../src/errors'
import {validate} from '../src/validate'

describe('validate', function () {
  describe('(no collection)', function () {
    const simpleValidator = new Schema({
      'name': string(required),
      'age': number
    })

    it('returns null when given an entity that respect all validators', function () {
      const entity = {
        name: 'Joe',
        age: '35'
      }
      const ret = validate(entity, simpleValidator)
      expect(ret).to.equal(null)
    })

    it('returns an object with a property for each error encountered', function () {
      const entity = {
        name: '',
        age: 'test'
      }
      const ret = validate(entity, simpleValidator)
      expect(ret).to.deep.equal({
        name: Errors.required,
        age: Errors.isNumber
      })
    })

    it('can accept an attribute mapped to an array of validation function', function () {
      const schema = new Schema({
        'age': number([required, isPositive])
      })
      const entity = {
        age: '56'
      }
      const ret = validate(entity, schema)
      expect(ret).to.equal(null)
    })

    it('can accept an attribute mapped to an instance of Schema', function () {
      const addressSchema = new Schema({
        city: string(required)
      })
      const schema = new Schema({
        age: number([required, isPositive]),
        address: addressSchema
      })
      const entity = {
        age: '56',
        address: {}
      }
      const ret = validate(entity, schema)
      expect(ret).to.deep.equal({
        address: { city: 'sapin.required' }
      })
    })

    it('return errors even when parent object is undefined', function () {
      const schema = new Schema({
        student: {
          name: {
            fr: string(required)
          }
        }
      })
      const entity = {}
      const ret = validate(entity, schema)
      expect(ret).to.deep.equal({
        student: {
          name: {
            fr: Errors.required
          }
        }
      })
    })

    it('return no errors when the whole structure is valid', function () {
      const schema = new Schema({
        student: {
          name: {
            fr: string(required)
          }
        }
      })
      const entity = {
        student: {
          name: {
            fr: 'test'
          }
        }
      }
      const ret = validate(entity, schema)
      expect(ret).to.equal(null)
    })

    it('passes sibling, params and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null
      let retParams = null

      const sampleValidator = ({siblings, entity, params}) => {
        retSiblings = siblings
        retEntity = entity
        retParams = params
        return null
      }

      const testParams = {id: 11}
      const schema = new Schema({
        name: string(sampleValidator)
      })

      const entity = {name: 'test'}

      validate(entity, schema, testParams)
      expect(retSiblings).to.equal(entity)
      expect(retEntity).to.equal(entity)
      expect(retParams).to.equal(testParams)
    })

    it('passes siblings and entity to subObject validator function', function () {
      let receivedObject = null
      const myCustomValidator = (params) => {
        receivedObject = params
        return null
      }

      const schema = new Schema({
        addresses: {
          streetName: string([required, myCustomValidator])
        }
      })

      const address = {streetName: 'test', civicNumber: '456'}
      const entity = {
        name: 'Joe',
        addresses: address
      }
      validate(entity, schema)

      expect(receivedObject.value).to.equal(address.streetName)
      expect(receivedObject.siblings).to.equal(address)
      expect(receivedObject.entity).to.equal(entity)
    })

    it('logUnknownPropertoes', function () {
      const schema = new Schema({
        addresses: {
          streetName: string
        }
      })

      const entity = {
        name: 'Joe',
        addresses: {
          streetName: 'test',
          civicNumber: '44'
        }
      }
      const ret = validate(entity, schema, null, true)

      expect(ret).to.deep.equal({
        name: 'sapin.unknownProperty',
        addresses: {
          civicNumber: 'sapin.unknownProperty'
        }
      })
    })
  })

  describe('with collection', function () {
    it('calls each validator function with the right siblings, params and entity when collectionOfObjects', function () {
      let receivedObject = null
      const myCustomValidator = (params) => {
        receivedObject = params
        return null
      }

      const schema = new Schema({
        addresses: arrayOf({
          streetName: string(myCustomValidator)
        })
      })

      const address = {streetName: 'test', civicNumber: '456'}
      const testParams = {id: 1}
      const entity = {
        name: 'Joe',
        addresses: [address]
      }
      validate(entity, schema, testParams)

      expect(receivedObject.value).to.equal(address.streetName)
      expect(receivedObject.siblings).to.equal(address)
      expect(receivedObject.entity).to.equal(entity)
      expect(receivedObject.params).to.equal(testParams)
    })

    it('calls each validator function with the right siblings and entity when collectionOfValues', function () {
      let receivedObject = null
      const myCustomValidator = (params) => {
        receivedObject = params
        return null
      }

      const schema = new Schema({
        names: arrayOf(string(myCustomValidator))
      })

      const testParams = {id: 55}
      const names = ['test']
      const entity = {
        names
      }

      validate(entity, schema, testParams)

      expect(receivedObject.value).to.equal('test')
      expect(receivedObject.siblings).to.equal(names)
      expect(receivedObject.entity).to.equal(entity)
      expect(receivedObject.params).to.equal(testParams)
    })

    it('returns null given an object with an array collection that respect all validations', function () {
      const schema = new Schema({
        name: string(required),
        addresses: arrayOf({
          streetName: string(required),
          civicNumber: number(required)
        })
      })

      const entity = {
        name: 'Joe',
        addresses: [
          {streetName: 'test', civicNumber: '456'}
        ]
      }
      const ret = validate(entity, schema)
      expect(ret).to.equal(null)
    })

    it('returns an object with errors at the right path given a collectionOfObjects not respecting the schema', function () {
      const schema = new Schema({
        name: string(required),
        addresses: arrayOf({
          streetName: string(required),
          civicNumber: number(required)
        })
      })

      const entity = {
        name: 'Joe',
        addresses: [
          {streetName: 'test', civicNumber: '456'},
          {civicNumber: '456'}
        ]
      }
      const ret = validate(entity, schema)
      expect(ret).to.deep.equal({
        addresses: {
          '1': {
            streetName: Errors.required
          }
        }
      })
    })

    it('returns an object with errors at the right path given a collectionOfValues not respecting the schema', function () {
      const schema = new Schema({
        name: string(required),
        scores: arrayOf(number)
      })

      const entity = {
        name: 'Joe',
        scores: ['sdfasd', '45', 'dsfsd']
      }
      const ret = validate(entity, schema)
      expect(ret).to.deep.equal({
        scores: {
          '0': Errors.isNumber,
          '2': Errors.isNumber
        }
      })
    })

    it('set the error at _error for collection that fail the collectionValidator functions', function () {
      const schema = new Schema({
        name: string(required),
        scores: arrayOf(number)
      })

      const entity = {
        name: 'Joe',
        scores: {} // object instead of array
      }
      const ret = validate(entity, schema)
      expect(ret).to.deep.equal({
        scores: {
          _error: Errors.isOfTypeArray
        }
      })
    })
  })

  describe('validate with custom type', function () {
    it('accepts a PropertyDefinition with a function as validators', function () {
      const propValidator = new PropertyDefinition(ValueTypes.value, identity, required)
      const schema = new Schema({
        name: propValidator
      })

      const entity = {
        name: 'Joe'
      }
      const ret = validate(entity, schema)
      expect(ret).to.equal(null)
    })

    it('accepts a PropertyDefinition with no collectionValidator', function () {
      const propValidator = new PropertyDefinition(ValueTypes.collectionOfValues, identity, string())
      const schema = new Schema({
        names: propValidator
      })

      const entity = {
        names: ['Joe']
      }
      const ret = validate(entity, schema)
      expect(ret).to.equal(null)
    })
  })
})
