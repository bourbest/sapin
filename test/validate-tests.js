import {expect} from 'chai'
import {Errors} from '../src/common'
import {
  isNumber, required, validate, collection, noTrim, createConfig
} from '../src'

describe('validate', function () {
  const simpleValidator = {
    'name': [required],
    'age': [isNumber]
  }

  describe('ensureValidatorIsValid', function () {
    it('throws when validator has an invalid prop', function () {
      const validator = {name: {firstName: ''}}
      const test = () => validate({}, validator)
      expect(test).to.throw('validator definition at path name.firstName must be an object or an array of validator function')
    })

    it('throws when validator has a non function', function () {
      const validator = {name: {firstName: [undefined]}}
      const test = () => validate({}, validator)
      expect(test).to.throw('validator definition at path name.firstName expects an array of functions. Item a index 0 isn\'t one')
    })

    it('throws when validator is not an object', function () {
      const test = () => validate({}, '')
      expect(test).to.throw('validate second argument must be a validator object')
    })
  })

  describe('trim', function () {
    it('trim all values before passing to validators', function () {
      let passedValue = null
      const sampleValidator = ({value}) => {
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

    it('does not trim value if noTrim is given', function () {
      let passedValue1 = null
      let passedValue2 = null
      const sampleValidator1 = ({value}) => {
        passedValue1 = value
      }
      const sampleValidator2 = ({value}) => {
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

    it('does not trim if config says so', function () {
      let passedValue = null
      const sampleValidator = ({value}) => {
        passedValue = value
      }

      const entity = {
        name: '  test  '
      }
      const validator = {
        name: [sampleValidator]
      }

      const config = createConfig({useTrim: false})
      validate(entity, validator, config)
      expect(passedValue).to.equal('  test  ')
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
        name: {error: Errors.required, params: {value: ''}},
        age: {error: Errors.isNumber, params: {value: 'test'}}
      })
    })

    it('can validate a property given its path', function () {
      const validator = {
        'name.fr': [required],
        'description.fr': [required]
      }
      const entity = {
        name: {fr: 'test'}
      }
      const ret = validate(entity, validator)
      expect(ret).to.deep.equal({
        description: {
          fr: {error: Errors.required, params: {value: undefined}}
        }
      })
    })

    it('return errors even when parent object is undefined', function () {
      const validator = {
        student: {
          name: {
            fr: [required]
          }
        }
      }
      const entity = {
      }
      const ret = validate(entity, validator)
      expect(ret).to.deep.equal({
        student: {
          name: {
            fr: {error: Errors.required, params: {value: undefined}}
          }
        }
      })
    })

    it('return no errors when the whole structure is valid', function () {
      const validator = {
        student: {
          name: {
            fr: [required]
          }
        }
      }
      const entity = {
        student: {
          name: {
            fr: 'test'
          }
        }
      }
      const ret = validate(entity, validator)
      expect(ret).to.deep.equal({})
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null

      const sampleValidator = ({siblings, entity}) => {
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

    it('returns {} given an object without the collection and no valueValidator given', function () {
      const entity = {
        name: 'Joe'
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({})
    })

    it('returns {} given an object with an empty collection and no valueValidator given', function () {
      const entity = {
        name: 'Joe',
        addresses: {}
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
            streetName: {error: Errors.required, params: {value: undefined}},
            civicNumber: {error: Errors.required, params: {value: undefined}}
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
            streetName: {error: Errors.required, params: {value: undefined}},
            civicNumber: {error: Errors.required, params: {value: undefined}}
          }
        }
      })
    })

    it('applies the value validator when given object collection', function () {
      const sampleValueValidator = () => {
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
            streetName: {error: Errors.required, params: {value: undefined}},
            civicNumber: {error: Errors.required, params: {value: undefined}}
          }
        }
      })
    })

    it('returns {} when the value validator returns no error', function () {
      const sampleValueValidator = () => {
        return null
      }
      const collectionWithValueValidator = {
        addresses: collection({
          streetName: [required],
          civicNumber: [required, isNumber]
        }, [sampleValueValidator])
      }

      const entity = {
        addresses: {
          home: {streetName: 'test', civicNumber: '456'}
        }
      }
      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({})
    })

    it('applies the value validator when given an array collection', function () {
      const sampleValueValidator = () => {
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
          {streetName: 'test'}
        ]
      }

      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        addresses: {
          _error: 'sampleError',
          '1': {
            civicNumber: {error: Errors.required, params: {value: undefined}}
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
          {name: 'test', level2: [{age: ''}]}
        ]
      }
      const ret = validate(entity, complexCollectionValidator)
      expect(ret).to.deep.equal({
        level1: {
          '1': {
            name: {error: Errors.required, params: {value: ''}}
          },
          '2': {
            level2: {
              '0': {
                age: {error: Errors.required, params: {value: ''}}
              }
            }
          }
        }
      })
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = []
      let retEntity = null

      const sampleValidator = ({siblings, entity}) => {
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
        scores: ['50', null, 'yo']
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({
        scores: {
          '1': {error: Errors.required, params: {value: null}},
          '2': {error: Errors.isNumber, params: {value: 'yo'}}
        }
      })
    })

    it('returns error with a property describing the error a the correct index when given an object collection', function () {
      const entity = {
        name: 'Joe',
        scores: {
          math: '50',
          science: null,
          history: 'yo'
        }
      }
      const ret = validate(entity, collectionValidator)
      expect(ret).to.deep.equal({
        scores: {
          science: {error: Errors.required, params: {value: null}},
          history: {error: Errors.isNumber, params: {value: 'yo'}}
        }
      })
    })

    it('applies the value validator when given an object collection', function () {
      const sampleValueValidator = () => {
        return 'sampleError'
      }
      const collectionWithValueValidator = {
        scores: collection([required, isNumber], [sampleValueValidator])
      }

      const entity = {
        scores: {
          math: '50',
          science: null,
          history: 'yo'
        }
      }

      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        scores: {
          _error: 'sampleError',
          science: {error: Errors.required, params: {value: null}},
          history: {error: Errors.isNumber, params: {value: 'yo'}}
        }
      })
    })

    it('applies the value validator when given an array collection', function () {
      const sampleValueValidator = () => {
        return 'sampleError'
      }
      const collectionWithValueValidator = {
        scores: collection([required, isNumber], [sampleValueValidator])
      }

      const entity = {
        scores: ['50', null, 'yo']
      }

      const ret = validate(entity, collectionWithValueValidator)
      expect(ret).to.deep.equal({
        scores: {
          _error: 'sampleError',
          '1': {error: Errors.required, params: {value: null}},
          '2': {error: Errors.isNumber, params: {value: 'yo'}}
        }
      })
    })

    it('passes sibling and entity to validation function', function () {
      let retSiblings = null
      let retEntity = null

      const sampleValidator = ({siblings, entity}) => {
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

      const sampleValidator = ({siblings, entity}) => {
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
