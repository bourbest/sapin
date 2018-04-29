import {expect} from 'chai'
import {identity} from 'lodash'
import { string, number, boolean, date, arrayOf, dictionary, PropertyValidator, ValidationType } from '../src/types'
import {required} from '../src/required-validators'
import {isPositive} from '../src/numbers-validators'
import SchemaValidator from '../src/SchemaValidator'
import { Errors } from '../src/errors'

describe('PropertyValidator', function () {
  describe('constructor', function () {
    it('throws the schema is null', function () {
      const test = () => new SchemaValidator(null)
      expect(test).to.throw('schema must be a valid schema object')
    })

    it('throws the schema is undefined', function () {
      const test = () => new SchemaValidator()
      expect(test).to.throw('schema must be a valid schema object')
    })

    it('throws the schema is not a valid object', function () {
      const test = () => new SchemaValidator()
      expect(test).to.throw('schema must be a valid schema object')
    })

    it('throws when a property is set to something other thant an object', function () {
      const badSchema = {
        test: 'no'
      }
      const test = () => new SchemaValidator(badSchema)
      expect(test).to.throw('Expect an object or a type function (ex.: string, number) in schema at property test')
    })

    it('throws with full path name of the property that is set to something other thant an object', function () {
      const badSchema = {
        test: {
          invalidProp: {
            invalidChild: 44
          }
        }
      }
      const test = () => new SchemaValidator(badSchema)
      expect(test).to.throw('Expect an object or a type function (ex.: string, number) in schema at property test.invalidProp.invalidChild')
    })

    it('accepts a property with functions returning a PropertyType', function () {
      const validator = new SchemaValidator({
        test: string
      })
      expect(validator.schema.test).to.deep.equal(string())
    })
  })

  describe('validate (no collection)', function () {
    const simpleValidator = new SchemaValidator({
      'name': string(required),
      'age': number
    })

    it('returns null when given an entity that respect all validators', function () {
      const entity = {
        name: 'Joe',
        age: '35'
      }
      const ret = simpleValidator.validate(entity)
      expect(ret).to.equal(null)
    })

    it('returns an object with a property for each error encountered', function () {
      const entity = {
        name: '',
        age: 'test'
      }
      const ret = simpleValidator.validate(entity)
      expect(ret).to.deep.equal({
        name: Errors.required,
        age: Errors.isNumber
      })
    })

    it('can accept an attribute mapped to an array of validation function', function () {
      const schema = new SchemaValidator({
        'age': number([required, isPositive])
      })
      const entity = {
        age: '56'
      }
      const ret = schema.validate(entity)
      expect(ret).to.equal(null)
    })

    it('return errors even when parent object is undefined', function () {
      const schema = new SchemaValidator({
        student: {
          name: {
            fr: string(required)
          }
        }
      })
      const entity = {}
      const ret = schema.validate(entity)
      expect(ret).to.deep.equal({
        student: {
          name: {
            fr: Errors.required
          }
        }
      })
    })

    it('return no errors when the whole structure is valid', function () {
      const schema = new SchemaValidator({
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
      const ret = schema.validate(entity)
      expect(ret).to.equal(null)
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null

      const sampleValidator = ({siblings, entity}) => {
        retSiblings = siblings
        retEntity = entity
        return null
      }

      const schema = new SchemaValidator({
        name: string(sampleValidator)
      })

      const entity = {name: 'test'}

      schema.validate(entity)
      expect(retSiblings).to.equal(entity)
      expect(retEntity).to.equal(entity)
    })

    it('passes siblings and entity to subObject validator function', function () {
      let receivedObject = null
      const myCustomValidator = (params) => {
        receivedObject = params
        return null
      }

      const schema = new SchemaValidator({
        addresses: {
          streetName: string([required, myCustomValidator])
        }
      })

      const address = {streetName: 'test', civicNumber: '456'}
      const entity = {
        name: 'Joe',
        addresses: address
      }
      schema.validate(entity)

      expect(receivedObject.value).to.equal(address.streetName)
      expect(receivedObject.siblings).to.equal(address)
      expect(receivedObject.entity).to.equal(entity)
    })
  })

  describe('validate with collection', function () {
    it('calls each validator function with the right siblings and entity when collectionOfObjects', function () {
      let receivedObject = null
      const myCustomValidator = (params) => {
        receivedObject = params
        return null
      }

      const schema = new SchemaValidator({
        addresses: arrayOf({
          streetName: string(myCustomValidator)
        })
      })

      const address = {streetName: 'test', civicNumber: '456'}
      const entity = {
        name: 'Joe',
        addresses: [address]
      }
      schema.validate(entity)

      expect(receivedObject.value).to.equal(address.streetName)
      expect(receivedObject.siblings).to.equal(address)
      expect(receivedObject.entity).to.equal(entity)
    })

    it('calls each validator function with the right siblings and entity when collectionOfValues', function () {
      let receivedObject = null
      const myCustomValidator = (params) => {
        receivedObject = params
        return null
      }

      const schema = new SchemaValidator({
        names: arrayOf(string(myCustomValidator))
      })

      const names = ['test']
      const entity = {
        names
      }
      schema.validate(entity)

      expect(receivedObject.value).to.equal('test')
      expect(receivedObject.siblings).to.equal(names)
      expect(receivedObject.entity).to.equal(entity)
    })

    it('returns null given an object with an array collection that respect all validations', function () {
      const schema = new SchemaValidator({
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
      const ret = schema.validate(entity)
      expect(ret).to.equal(null)
    })

    it('returns an object with errors at the right path given a collectionOfObjects not respecting the schema', function () {
      const schema = new SchemaValidator({
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
      const ret = schema.validate(entity)
      expect(ret).to.deep.equal({
        addresses: {
          '1': {
            streetName: Errors.required
          }
        }
      })
    })

    it('returns an object with errors at the right path given a collectionOfValues not respecting the schema', function () {
      const schema = new SchemaValidator({
        name: string(required),
        scores: arrayOf(number)
      })

      const entity = {
        name: 'Joe',
        scores: ['sdfasd', '45', 'dsfsd']
      }
      const ret = schema.validate(entity)
      expect(ret).to.deep.equal({
        scores: {
          '0': Errors.isNumber,
          '2': Errors.isNumber
        }
      })
    })

    it('set the error at _error for collection that fail the collectionValidator functions', function () {
      const schema = new SchemaValidator({
        name: string(required),
        scores: arrayOf(number)
      })

      const entity = {
        name: 'Joe',
        scores: {} // object instead of array
      }
      const ret = schema.validate(entity)
      expect(ret).to.deep.equal({
        scores: {
          _error: Errors.isOfTypeArray
        }
      })
    })
  })

  describe('validate with custom type', function () {
    it('accepts a PropertyValidator with a function as validators', function () {
      const propValidator = new PropertyValidator(ValidationType.value, identity, required)
      const schema = new SchemaValidator({
        name: propValidator
      })

      const entity = {
        name: 'Joe'
      }
      const ret = schema.validate(entity)
      expect(ret).to.equal(null)
    })

    it('accepts a PropertyValidator with no collectionValidator', function () {
      const propValidator = new PropertyValidator(ValidationType.collectionOfValues, identity, string())
      const schema = new SchemaValidator({
        names: propValidator
      })

      const entity = {
        names: ['Joe']
      }
      const ret = schema.validate(entity)
      expect(ret).to.equal(null)
    })
  })
})
