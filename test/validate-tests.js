import {expect} from 'chai'
import {Errors} from '../src/common'
import {
  isNumber, required, applyValidator, collection
} from '../src';

describe('applyValidator', function () {
  const simpleValidator = {
    'name': [required],
    'age': [isNumber]
  }

  describe('on object properties', function () {
    it('returns {} when given an entity that respect all validators', function () {
      const entity = {
        name: 'Joe',
        age: '35'
      }
      const ret = applyValidator(entity, simpleValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns an object with a property for each error encountered', function () {
      const entity = {
        name: '',
        age: 'test'
      }
      const ret = applyValidator(entity, simpleValidator)
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
      const ret = applyValidator(entity, validator)
      expect(ret).to.deep.equal({
        description: {
          fr: Errors.required
        }
      })
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
      const ret = applyValidator(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns {} given an object with an object collection that respect all validations', function () {
      const entity = {
        name: 'Joe',
        addresses: {
          home: {streetName: 'test', civicNumber: '456'}
        }
      }
      const ret = applyValidator(entity, collectionValidator)
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
      const ret = applyValidator(entity, collectionValidator)
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
      const ret = applyValidator(entity, collectionValidator)
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
      const ret = applyValidator(entity, collectionWithValueValidator)
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

      const ret = applyValidator(entity, collectionWithValueValidator)
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
      const ret = applyValidator(entity, complexCollectionValidator)
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
      const ret = applyValidator(entity, collectionValidator)
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
      const ret = applyValidator(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns error with a property describing the error a the correct index when given an array collection', function () {
      const entity = {
        name: 'Joe',
        scores: ['50', null, 'sdfa28']
      }
      const ret = applyValidator(entity, collectionValidator)
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
      const ret = applyValidator(entity, collectionValidator)
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

      const ret = applyValidator(entity, collectionWithValueValidator)
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

      const ret = applyValidator(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        scores: {
          _error: 'sampleError',
          '1': Errors.required,
          '2': Errors.isNumber
        }
      })
    })
  })
})
