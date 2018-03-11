import {expect} from 'chai'
import {
  collection,
  ValidatorTypes
} from '../src/collections'

describe('collection', function () {
  it('throws when validator is not an array or object', function () {
    const test = () => collection('test')
    expect(test).to.throw('must be a validator object or an array of validator functions')
  })

  it('throws when valueValidator is not an array or object', function () {
    const test = () => collection({}, 'test')
    expect(test).to.throw('must be a validator object or an array of validator functions')
  })

  it('creates a valid collectionOfValues validator when given an array', function () {
    const res = collection([])
    expect(res).to.deep.equal({
      __type: ValidatorTypes.collectionOfValues,
      __validator: [],
      __valueValidator: undefined
    })
  })

  it('creates a valid collectionOfObject validator when given an object', function () {
    const res = collection({})
    expect(res).to.deep.equal({
      __type: ValidatorTypes.collectionOfObjects,
      __validator: {},
      __valueValidator: undefined
    })
  })
})
