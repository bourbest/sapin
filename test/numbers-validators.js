import {expect} from 'chai'
import {Errors} from "../src/common";
import {
  isNumber,
  isInteger,
  isPositive,
  isNegative,
  numberGteToField,
  numberLteToField,
  numberWithinRange,
} from '../src/numbers-validators'

describe('isNumber', function () {
  it('returns null when given undefined', function () {
    const ret = isNumber(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isNumber(null)
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isNumber('')
    expect(ret).to.equal(null)
  })

  it('returns null when given \'0\'', function () {
    const ret = isNumber('0')
    expect(ret).to.equal(null)
  })

  it('returns null when given 0', function () {
    const ret = isNumber(0)
    expect(ret).to.equal(null)
  })

  it('returns null when given a number with decimal using the dot', function () {
    const ret = isNumber('1.5')
    expect(ret).to.equal(null)
  })

  it('returns null when given a number with decimal using the comma and a config that supports them', function () {
    const ret = isNumber('1,5')
    expect(ret).to.equal(null)
  })

  it('returns Error.isNumber when given a number two dots', function () {
    const ret = isNumber('1.5.9')
    expect(ret).to.equal(Errors.isNumber)
  })

  it('returns Error.isNumber when given text', function () {
    const ret = isNumber('yo')
    expect(ret).to.equal(Errors.isNumber)
  })
})

describe('isInteger', function () {
  it('returns null when given undefined', function () {
    const ret = isInteger(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isInteger(null)
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isInteger('')
    expect(ret).to.equal(null)
  })

  it('returns null when given \'0\'', function () {
    const ret = isInteger('0')
    expect(ret).to.equal(null)
  })

  it('returns null when given 0', function () {
    const ret = isInteger(0)
    expect(ret).to.equal(null)
  })

  it('returns Error.isInteger when given a decimal number', function () {
    const ret = isInteger('1.5')
    expect(ret).to.equal(Errors.isInteger)
  })

  it('returns Error.isNumber when given text', function () {
    const ret = isInteger('yo')
    expect(ret).to.equal(Errors.isInteger)
  })
})

describe('isPositive', function () {
  it('returns null when given undefined', function () {
    const ret = isPositive(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isPositive(null)
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isPositive('')
    expect(ret).to.equal(null)
  })

  it('returns null when given 0', function () {
    const ret = isPositive('0')
    expect(ret).to.equal(null)
  })

  it('returns null when given a value greater than 0', function () {
    const ret = isPositive('1')
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value greater than 0', function () {
    const ret = isPositive('0.0000001')
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value greater than 0 using coma', function () {
    const ret = isPositive('0,0000001')
    expect(ret).to.equal(null)
  })

  it('returns Errors.isNumber when given text', function () {
    const ret = isPositive('yo')
    expect(ret).to.equal(Errors.isNumber)
  })

  it('returns Errors.isPositive when given a negative number', function () {
    const ret = isPositive('-0.1')
    expect(ret).to.equal(Errors.isPositive)
  })

})

describe('isNegative', function () {
  it('returns null when given undefined', function () {
    const ret = isNegative(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isNegative(null)
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isNegative('')
    expect(ret).to.equal(null)
  })

  it('returns null when given a value less than 0', function () {
    const ret = isNegative('-1')
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value less than 0', function () {
    const ret = isNegative('-0.0000001')
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value less than 0 using coma', function () {
    const ret = isNegative('-0,0000001')
    expect(ret).to.equal(null)
  })

  it('returns Errors.isNumber when given text', function () {
    const ret = isNegative('yo')
    expect(ret).to.equal(Errors.isNumber)
  })

  it('returns Errors.isNegative when given 0', function () {
    const ret = isNegative('0')
    expect(ret).to.equal(Errors.isNegative)
  })

  it('returns Errors.isNegative when given a positive number', function () {
    const ret = isNegative('0.1')
    expect(ret).to.equal(Errors.isNegative)
  })
})

describe('numberGteToField', function () {
  it('returns null when given undefined', function () {
    const validate = numberGteToField('otherField')
    const ret = validate(undefined, {otherField: '5'})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const validate = numberGteToField('otherField')
    const ret = validate(null, {otherField: '5'})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const validate = numberGteToField('otherField')
    const ret = validate('', {otherField: '5'})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is undefined', function () {
    const validate = numberGteToField('otherField')
    const ret = validate('5', {})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is null', function () {
    const validate = numberGteToField('otherField')
    const ret = validate('5', {otherField: null})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is empty string', function () {
    const validate = numberGteToField('otherField')
    const ret = validate('5', {otherField: ''})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is 0', function () {
    const validate = numberGteToField('otherField')
    const ret = validate('0', {otherField: '0'})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is negative', function () {
    const validate = numberGteToField('otherField')
    const ret = validate('0', {otherField: '-1'})
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberGteToField with params when a value less than other field', function () {
    const validate = numberGteToField('otherField', 'age')
    const ret = validate('-1', {otherField: '0'})
    expect(ret).to.deep.equal({
      error: Errors.numberGteToField,
      params: {
        otherFieldName: 'age',
        otherFieldValue: 0
      }
    })
  })
})

describe('numberLteToField', function () {
  it('returns null when given undefined', function () {
    const validate = numberLteToField('otherField')
    const ret = validate(undefined, {otherField: '5'})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const validate = numberLteToField('otherField')
    const ret = validate(null, {otherField: '5'})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const validate = numberLteToField('otherField')
    const ret = validate('', {otherField: '5'})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is undefined', function () {
    const validate = numberLteToField('otherField')
    const ret = validate('5', {})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is null', function () {
    const validate = numberLteToField('otherField')
    const ret = validate('5', {otherField: null})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is empty string', function () {
    const validate = numberLteToField('otherField')
    const ret = validate('5', {otherField: ''})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is 0', function () {
    const validate = numberLteToField('otherField')
    const ret = validate('0', {otherField: '0'})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is positive', function () {
    const validate = numberLteToField('otherField')
    const ret = validate('0', {otherField: '1'})
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberLteToField with params when a value greater than other field', function () {
    const validate = numberLteToField('otherField', 'age')
    const ret = validate('1', {otherField: '0'})
    expect(ret).to.deep.equal({
      error: Errors.numberLteToField,
      params: {
        otherFieldName: 'age',
        otherFieldValue: 0
      }
    })
  })
})

describe('numberWithinRange', function () {
  it('returns null when given undefined', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate(undefined)
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate(null)
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate('')
    expect(ret).to.equal(null)
  })

  it('returns null when given value equal to minValue', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate('0')
    expect(ret).to.equal(null)
  })

  it('returns null when given value equal to maxValue', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate('5')
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberWithingRange when given value outside range', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate('5.1')
    expect(ret).to.deep.equal({
      error: Errors.numberWithinRange,
      params: {
        minValue: 0,
        maxValue: 5
      }
    })
  })

  it('throws when given a text minValue', function () {
    expect(() => numberWithinRange('5', 5)).to.throw('range value must be numbers')
  })

  it('throws when given a text maxValue', function () {
    expect(() => numberWithinRange(5, '5')).to.throw('range value must be numbers')
  })

  it('throws when given a null minValue', function () {
    expect(() => numberWithinRange(null, 5)).to.throw('minValue and maxValue cannot be null')
  })

  it('throws when given a null maxValue', function () {
    expect(() => numberWithinRange(5, null)).to.throw('minValue and maxValue cannot be null')
  })

  it('throws when given a minValue > maxValue', function () {
    expect(() => numberWithinRange(5, 4)).to.throw('minValue > maxValue')
  })
})
