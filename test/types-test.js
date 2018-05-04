import {expect} from 'chai'
import {getString, getTrimmedString, getNumber, getFriendlyNumber} from '../src/getters'
import {isNumber, isOfTypeBool, isOfTypeArray, isOfTypeDate, isOfTypeObject, isOfTypeString} from '../src/type-validators'
import {ValueTypes, string, number, boolean, date, arrayOf, dictionary, PropertyDefinition} from '../src/types'
import Schema from '../src/Schema'

function someFunction () {}

describe('PropertyDefinition', function () {
  it('throws when valueType is invalid', function () {
    const test = () => new PropertyDefinition('fsdfs', someFunction)
    expect(test).to.throw('valueType must be one of the values defined in ValueTypes')
  })

  it('throws when getter is null', function () {
    const test = () => new PropertyDefinition('value', null)
    expect(test).to.throw('getter must be a function')
  })

  it('throws when getter is not a function', function () {
    const test = () => new PropertyDefinition('value', 456)
    expect(test).to.throw('getter must be a function')
  })

  it('throws when given an invalid array of functions as validators', function () {
    const test = () => new PropertyDefinition('value', someFunction, [someFunction, 4534])
    expect(test).to.throw('validators must be a function or an array of functions')
  })

  it('throws when given something other dans a function or an array of functions as validators', function () {
    const test = () => new PropertyDefinition('value', someFunction, 4534)
    expect(test).to.throw('validators must be a function or an array of functions')
  })

  it('does not throw when given nothing as validators', function () {
    const x = new PropertyDefinition('value', someFunction)
  })

  it('sets the typeValidator as the first validator when given none', function () {
    const res = new PropertyDefinition('value', someFunction, null, isOfTypeString)
    expect(res.validators[0]).to.equal(isOfTypeString)
  })

  it('sets a typeValidator as the first validator when given an array of validators', function () {
    const res = new PropertyDefinition('value', someFunction, [someFunction], isOfTypeString)
    expect(res.validators[0]).to.equal(isOfTypeString)
    expect(res.validators[1]).to.equal(someFunction)
  })

  it('sets a typeValidator as the first validator when given an a validator function', function () {
    const res = new PropertyDefinition('value', someFunction, someFunction, isOfTypeString)
    expect(res.validators[0]).to.equal(isOfTypeString)
    expect(res.validators[1]).to.equal(someFunction)
  })

  it('throws when the typeValidator is not a function', function () {
    const test = function () { new PropertyDefinition('value', someFunction, null, 65465) }
    expect(test).to.throw('typeValidator is optional but must be a Validation function if given')
  })

  it('does not throw when the typeValidator is undefined', function () {
    const propValidator = new PropertyDefinition('value', someFunction)
    expect(propValidator.validators).to.deep.equal([])
  })

  it('throws when transform is not a function', function () {
    const test = function () { new PropertyDefinition('value', someFunction, null, null, 65465) }
    expect(test).to.throw('transform must be a function')
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
    expect(propValidator instanceof PropertyDefinition).to.be.true
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
  it('sets the valueType to collectionOfValues when given a PropertyDefinition', function () {
    const res = type(string())
    expect(res.valueType).to.equal(ValueTypes.collectionOfValues)
  })

  it('sets the valueType to collectionOfObjects when given an object', function () {
    const res = type({})
    expect(res.valueType).to.equal(ValueTypes.collectionOfObjects)
  })

  it('it accepts a function that returns a PropertyType', function () {
    const res = type(string)
    const propValidator = string()
    expect(res.validators).to.deep.equal(propValidator)
  })

  it('throws when given a non object or non PropertyDefinition object', function () {
    const test = () => type(someFunction)
    expect(test).to.throw(TypeError)
  })
}

function itSupportsSchemaAsPropertyDefinition (type) {
  it('supports Schema as PropertyDefinition', function () {
    const addressSchema = new Schema({
      city: string
    })
    const test = new Schema({
      addresses: type(addressSchema)
    })
    expect(test.schema.addresses.validators).to.equal(addressSchema.schema)
  })
}

describe('arrayOf', function () {
  itSetsTypeValidatorAsFirstCollectionValidator(arrayOf, isOfTypeArray)
  itSetsTheCorrectValidationType(arrayOf)
  itSupportsSchemaAsPropertyDefinition(arrayOf)
})

describe('dictionary', function () {
  itSetsTypeValidatorAsFirstCollectionValidator(dictionary, isOfTypeObject)
  itSetsTheCorrectValidationType(dictionary)
  itSupportsSchemaAsPropertyDefinition(dictionary)
})
