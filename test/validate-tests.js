import {expect} from 'chai'
import {Errors} from '../src/common'
import {
  isNumber, required, validate, collection, noTrim
} from '../src';

describe('validate', function () {
  const simpleValidator = {
    'name': [required],
    'age': [isNumber]
  }

  describe('trim', function () {
    it('trim all values before passing to validators', function () {
      let passedValue = null
      const sampleValidator = (value) => {
        passedValue = value
      }
      const entity = {
        name: '  test  '
      }
      const validator = {
        name: [sampleValidator]
      }
      validate(entity, validator)
      expect(passedValue).to.equal('test')
    })

    it('doesnt trim value if noTrim is given', function () {
      let passedValue1 = null
      let passedValue2 = null
      const sampleValidator1 = (value) => {
        passedValue1 = value
      }
      const sampleValidator2 = (value) => {
        passedValue2 = value
      }
      const entity = {
        name: '  test  ',
        password: '  test  '
      }
      const validator = {
        name: [sampleValidator1],
        password: [sampleValidator2, noTrim]
      }
      validate(entity, validator)
      expect(passedValue1).to.equal('test')
      expect(passedValue2).to.equal('  test  ')
    })
  })

  describe('on object properties', function () {
    it('returns {} when given an entity that respect all validators', function () {
      const entity = {
        name: 'Joe',
        age: '35'
      }
      const ret = validate(entity, simpleValidator)
      expect(ret).to.deep.equal({})
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

    it('can validate a property given its path', function () {
      const validator = {
        'name.fr': [required],
        'description.fr': [required]
      }
      const entity = {
        name: {fr: 'test'},
      }
      const ret = validate(entity, validator)
      expect(ret).to.deep.equal({
        description: {
          fr: Errors.required
        }
      })
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null

      const sampleValidator = (value, siblings, entity) => {
        retSiblings = siblings
        retEntity = entity
      }

      const validator = {
        name: [sampleValidator]
      }

      const entity = {name: 'test'}

      validate(entity, validator)
      expect(retSiblings).to.equal(entity)
      expect(retEntity).to.equal(entity)
    })
  })

  describe('on collectionOfObjects', function () {
    const collectionValidator = {
      name: [required],
      addresses: collection({
        streetName: [required],
        civicNumber: [required, isNumber]
      })
    }

    it('returns {} given an object with an array collection that respect all validations', function () {
      const entity = {
        name: 'Joe',
        addresses: [
          {streetName: 'test', civicNumber: '456'}
        ]
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns {} given an object with an object collection that respect all validations', function () {
      const entity = {
        name: 'Joe',
        addresses: {
          home: {streetName: 'test', civicNumber: '456'}
        }
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns an object with a property for each error when given an array collection', function () {
      const entity = {
        name: 'Joe',
        addresses: [
          {streetName: 'test', civicNumber: '456'},
          {}
        ]
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({
        addresses: {
          '1': {
            streetName: Errors.required,
            civicNumber: Errors.required
          }
        }
      })
    })

    it('returns an object with a property for each error when given an object collection', function () {
      const entity = {
        name: 'Joe',
        addresses: {
          home: {streetName: 'test', civicNumber: '456'},
          work: {}
        }
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({
        addresses: {
          work: {
            streetName: Errors.required,
            civicNumber: Errors.required
          }
        }
      })
    })

    it('applies the value validator when given object collection', function () {
      const sampleValueValidator = (value) => {
        return 'sampleError'
      }
      const collectionWithValueValidator = {
        addresses: collection({
          streetName: [required],
          civicNumber: [required, isNumber]
        }, [sampleValueValidator])
      }

      const entity = {
        addresses: {
          home: {streetName: 'test', civicNumber: '456'},
          work: {}
        }
      }
      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        addresses: {
          _error: 'sampleError',
          work: {
            streetName: Errors.required,
            civicNumber: Errors.required
          }
        }
      })
    })

    it('applies the value validator when given an array collection', function () {
      const sampleValueValidator = (value) => {
        return 'sampleError'
      }
      const collectionWithValueValidator = {
        addresses: collection({
          streetName: [required],
          civicNumber: [required, isNumber]
        }, [sampleValueValidator])
      }

      const entity = {
        addresses: [
         {streetName: 'test', civicNumber: '456'},
         {}
        ]
      }

      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        addresses: {
          _error: 'sampleError',
          '1': {
            streetName: Errors.required,
            civicNumber: Errors.required
          }
        }
      })
    })

    it('supports nested collectionOfObjects', function () {
      const complexCollectionValidator = {
        name: [required],
        level1: collection({
          name: [required],
          level2: collection({
            age: [required]
          })
        })
      }

      const entity = {
        name: 'Joe',
        level1: [
          {name: 'test', level2: [{age: '50'}]},
          {name: '', level2: [{age: '50'}]},
          {name: 'test', level2: [{age: ''}]},
        ]
      }
      const ret = validate(entity, complexCollectionValidator)
      expect(ret).to.deep.equal({
        level1: {
          '1': {
            name: Errors.required,
          },
          '2': {
            level2: {
              '0': {
                age: Errors.required
              }
            }
          }
        }
      })
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = []
      let retEntity = null

      const sampleValidator = (value, siblings, entity) => {
        retSiblings.push(siblings)
        retEntity = entity
      }

      const validator = {
        ranges: collection({
          from: [sampleValidator]
        })
      }

      const firstRange = {
        from: 0,
        to: 1
      }

      const secondRange = {
        from: 1,
        to: 25
      }
      const entity = {
        ranges: [firstRange, secondRange]
      }

      validate(entity, validator)
      expect(retSiblings.length).to.equal(2)
      expect(retSiblings[0]).to.equal(firstRange)
      expect(retSiblings[1]).to.equal(secondRange)
      expect(retEntity).to.equal(entity)
    })
  })

  describe('on collectionOfValues', function () {
    const collectionValidator = {
      name: [required],
      scores: collection([required, isNumber])
    }

    it('returns {} given an array that respect all validations', function () {
      const entity = {
        name: 'Joe',
        scores: ['50', '17', '28']
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns {} given an object that respect all validations', function () {
      const entity = {
        name: 'Joe',
        scores: {
          math: '50',
          science: '17'
        }
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns error with a property describing the error a the correct index when given an array collection', function () {
      const entity = {
        name: 'Joe',
        scores: ['50', null, 'sdfa28']
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({
        scores: {
          '1': Errors.required,
          '2': Errors.isNumber
        }
      })
    })

    it('returns error with a property describing the error a the correct index when given an object collection', function () {
      const entity = {
        name: 'Joe',
        scores: {
          math: '50',
          science: null,
          history: 'sdfa28'
        }
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({
        scores: {
          science: Errors.required,
          history: Errors.isNumber
        }
      })
    })

    it('applies the value validator when given an object collection', function () {
      const sampleValueValidator = (value) => {
        return 'sampleError'
      }
      const collectionWithValueValidator = {
        scores: collection([required, isNumber], [sampleValueValidator])
      }

      const entity = {
        scores: {
          math: '50',
          science: null,
          history: 'sdfa28'
        }
      }

      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        scores: {
          _error: 'sampleError',
          science: Errors.required,
          history: Errors.isNumber
        }
      })
    })

    it('applies the value validator when given an array collection', function () {
      const sampleValueValidator = (value) => {
        return 'sampleError'
      }
      const collectionWithValueValidator = {
        scores: collection([required, isNumber], [sampleValueValidator])
      }

      const entity = {
        scores: ['50', null, 'dfasd']
      }

      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        scores: {
          _error: 'sampleError',
          '1': Errors.required,
          '2': Errors.isNumber
        }
      })
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null

      const sampleValidator = (value, siblings, entity) => {
        retSiblings = siblings
        retEntity = entity
      }

      const validator = {
        integers: collection([sampleValidator])
      }

      const entity = {
        name: 'Joe',
        integers: [10, 45]
      }

      validate(entity, validator)
      expect(retSiblings).to.equal(entity)
      expect(retEntity).to.equal(entity)
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null

      const sampleValidator = (value, siblings, entity) => {
        retSiblings = siblings
        retEntity = entity
      }

      const validator = {
        ranges: collection({
          integers: collection([sampleValidator])
        })
      }

      const firstRange = {
        integers: [10, 45],
        name: 'range 1'
      }

      const entity = {
        name: 'Joe',
        ranges: [firstRange]
      }

      validate(entity, validator)
      expect(retSiblings).to.equal(firstRange)
      expect(retEntity).to.equal(entity)
    })
  })
})
