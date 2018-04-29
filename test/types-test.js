import {expect} from 'chai'
import {getString, getTrimmedString, getNumber, getFriendlyNumber} from '../src/getters'
import {isNumber, isOfTypeBool, isOfTypeArray, isOfTypeDate, isOfTypeObject, isOfTypeString} from '../src/type-validators'
import {ValidationType, string, number, boolean, date, arrayOf, dictionary, PropertyValidator} from '../src/types'

function someFunction () {}

describe('PropertyValidator', function () {
  it('throws when validationType is invalid', function () {
    const test = () => new PropertyValidator('fsdfs', someFunction)
    expect(test).to.throw()
  })

  it('throws when typeValidation is null', function () {
    const test = () => new PropertyValidator('value', null)
    expect(test).to.throw()
  })

  it('throws when typeValidation is not a function', function () {
    const test = () => new PropertyValidator('value', 456)
    expect(test).to.throw()
  })

  it('throws when given an invalid array of functions as validators', function () {
    const test = () => new PropertyValidator('value', someFunction, [someFunction, 4534])
    expect(test).to.throw()
  })

  it('throws when given something other dans a function or an array of functions as validators', function () {
    const test = () => new PropertyValidator('value', someFunction, 4534)
    expect(test).to.throw()
  })

  it('does not throw when given nothing as validators', function () {
    const x = new PropertyValidator('value', someFunction)
  })

  it('sets the typeValidator as the first validator when given none', function () {
    const res = new PropertyValidator('value', someFunction, null, isOfTypeString)
    expect(res.validators[0]).to.equal(isOfTypeString)
  })

  it('sets a typeValidator as the first validator when given an array of validators', function () {
    const res = new PropertyValidator('value', someFunction, [someFunction], isOfTypeString)
    expect(res.validators[0]).to.equal(isOfTypeString)
    expect(res.validators[1]).to.equal(someFunction)
  })

  it('sets a typeValidator as the first validator when given an a validator function', function () {
    const res = new PropertyValidator('value', someFunction, someFunction, isOfTypeString)
    expect(res.validators[0]).to.equal(isOfTypeString)
    expect(res.validators[1]).to.equal(someFunction)
  })

  it('throws when the typeValidator is not a function', function () {
    const test = function () { new PropertyValidator('value', someFunction, null, 65465) }
    expect(test).to.throw()
  })

  it('doesnt throw when the typeValidator is undefined', function () {
    const propValidator = new PropertyValidator('value', someFunction)
    expect(propValidator.validators).to.deep.equal([])
  })
})

describe('string', function () {
  it('uses getTrimmedString as a transformer by default', function () {
    const prop = string()
    expect(prop.transform).to.equal(getTrimmedString)
  })

  it('uses getTrimmedString as a transformer when option.useTrim = true', function () {
    const prop = string(null, {useTrim: true})
    expect(prop.transform).to.equal(getTrimmedString)
  })

  it('uses getString  as a transformer when option.useTrim = false', function () {
    const prop = string(null, {useTrim: false})
    expect(prop.transform).to.equal(getString)
  })
})

function itConstructsAValidPropertyType (typeFunction, typeValidation) {
  it('constructs a valid PropertyType', function () {
    const propValidator = typeFunction()
    expect(propValidator instanceof PropertyValidator).to.be.true
    expect(propValidator.validators[0]).to.equal(typeValidation)
  })
}
describe('boolean', function () {
  itConstructsAValidPropertyType(boolean, isOfTypeBool)
})

describe('number', function () {
  itConstructsAValidPropertyType(number, isNumber)

  it('uses getFriendlyNumber as a transformer by default', function () {
    const prop = number()
    expect(prop.transform).to.equal(getFriendlyNumber)
  })

  it('uses getFriendlyNumber as a transformer when option.replaceComa = true', function () {
    const prop = number(null, {replaceComa: true})
    expect(prop.transform).to.equal(getFriendlyNumber)
  })

  it('uses getNumber as a transformer when option.replaceComa = false', function () {
    const prop = number(null, {replaceComa: false})
    expect(prop.transform).to.equal(getNumber)
  })
})

describe('date', function () {
  itConstructsAValidPropertyType(date, isOfTypeDate)
})

// for collections
function itSetsTypeValidatorAsFirstCollectionValidator (type, typeValidator) {
  it('sets a type validator as the first collection validator when given none', function () {
    const res = type({})
    expect(res.collectionValidator[0]).to.equal(typeValidator)
  })

  it('sets a type validator as the first collection validator when given an array of validators', function () {
    const res = type({}, [someFunction])
    expect(res.collectionValidator[0]).to.equal(typeValidator)
    expect(res.collectionValidator[1]).to.equal(someFunction)
  })

  it('sets a type validator as the first collection validator when given a validator function', function () {
    const res = type({}, someFunction)
    expect(res.collectionValidator[0]).to.equal(typeValidator)
    expect(res.collectionValidator[1]).to.equal(someFunction)
  })
}

function itSetsTheCorrectValidationType (type) {
  it('sets the validationType to collectionOfValues when given a PropertyValidator', function () {
    const res = type(string())
    expect(res.validationType).to.equal(ValidationType.collectionOfValues)
  })

  it('sets the validationType to collectionOfObjects when given an object', function () {
    const res = type({})
    expect(res.validationType).to.equal(ValidationType.collectionOfObjects)
  })

  it('it accepts a function that returns a PropertyType', function () {
    const res = type(string)
    const propValidator = string()
    expect(res.validators).to.deep.equal(propValidator)
  })

  it('throws when given a non object or non PropertyValidator object', function () {
    const test = () => type(someFunction)
    expect(test).to.throw(TypeError)
  })
}

describe('arrayOf', function () {
  itSetsTypeValidatorAsFirstCollectionValidator(arrayOf, isOfTypeArray)
  itSetsTheCorrectValidationType(arrayOf)
})

describe('dictionary', function () {
  itSetsTypeValidatorAsFirstCollectionValidator(dictionary, isOfTypeObject)
  itSetsTheCorrectValidationType(dictionary)
})
