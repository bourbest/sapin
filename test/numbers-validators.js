import {expect} from 'chai'
import {Errors, defaultConfig as config} from '../src/common'
import {
  isNumber,
  isInteger,
  isPositive,
  isNegative,
  numberGteToField,
  numberLteToField,
  numberWithinRange
} from '../src/numbers-validators'

describe('isNumber', function () {
  it('returns null when given undefined', function () {
    const ret = isNumber({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isNumber({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isNumber({value: '', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given \'0\'', function () {
    const ret = isNumber({value: '0', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0', function () {
    const ret = isNumber({value: 0, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a number with decimal using the dot', function () {
    const ret = isNumber({value: '1.5', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a number with decimal using the comma and a config that supports them', function () {
    const ret = isNumber({value: '1,5', config})
    expect(ret).to.equal(null)
  })

  it('returns Error.isNumber when given a number two dots', function () {
    const ret = isNumber({value: '1.5.9', config})
    expect(ret).to.deep.equal({
      error: Errors.isNumber,
      params: {value: '1.5.9'}
    })
  })

  it('returns Error.isNumber when given text', function () {
    const ret = isNumber({value: 'yo', config})
    expect(ret).to.deep.equal({
      error: Errors.isNumber,
      params: {value: 'yo'}
    })
  })
})

describe('isInteger', function () {
  it('returns null when given undefined', function () {
    const ret = isInteger({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isInteger({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isInteger({value: '', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given \'0\'', function () {
    const ret = isInteger({value: '0', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0', function () {
    const ret = isInteger({value: 0, config})
    expect(ret).to.equal(null)
  })

  it('returns Error.isInteger when given a decimal number', function () {
    const ret = isInteger({value: '1.5', config})
    expect(ret).to.deep.equal({
      error: Errors.isInteger,
      params: {value: '1.5'}
    })
  })

  it('returns Error.isNumber when given text', function () {
    const ret = isInteger({value: 'yo', config})
    expect(ret).to.deep.equal({
      error: Errors.isInteger,
      params: {value: 'yo'}
    })
  })
})

describe('isPositive', function () {
  it('returns null when given undefined', function () {
    const ret = isPositive({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isPositive({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isPositive({value: '', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0', function () {
    const ret = isPositive({value: '0', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value greater than 0', function () {
    const ret = isPositive({value: '1', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value greater than 0', function () {
    const ret = isPositive({value: '0.0000001', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value greater than 0 using coma', function () {
    const ret = isPositive({value: '0,0000001', config})
    expect(ret).to.equal(null)
  })

  it('returns Errors.isNumber when given text', function () {
    const ret = isPositive({value: 'yo', config})
    expect(ret).to.deep.equal({
      error: Errors.isNumber,
      params: {value: 'yo'}
    })
  })

  it('returns Errors.isPositive when given a negative number', function () {
    const ret = isPositive({value: '-0.1', config})
    expect(ret).to.deep.equal({
      error: Errors.isPositive,
      params: {value: '-0.1'}
    })
  })
})

describe('isNegative', function () {
  it('returns null when given undefined', function () {
    const ret = isNegative({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const ret = isNegative({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const ret = isNegative({value: '', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a value less than 0', function () {
    const ret = isNegative({value: '-1', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value less than 0', function () {
    const ret = isNegative({value: '-0.0000001', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value less than 0 using coma', function () {
    const ret = isNegative({value: '-0,0000001', config})
    expect(ret).to.equal(null)
  })

  it('returns Errors.isNumber when given text', function () {
    const ret = isNegative({value: 'yo', config})
    expect(ret).to.deep.equal({
      error: Errors.isNumber,
      params: {value: 'yo'}
    })
  })

  it('returns Errors.isNegative when given 0', function () {
    const ret = isNegative({value: '0', config})
    expect(ret).to.deep.equal({
      error: Errors.isNegative,
      params: {value: '0'}
    })
  })

  it('returns Errors.isNegative when given a positive number', function () {
    const ret = isNegative({value: '0.1', config})
    expect(ret).to.deep.equal({
      error: Errors.isNegative,
      params: {value: '0.1'}
    })
  })
})

describe('numberGteToField', function () {
  it('returns null when given undefined', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: undefined, siblings: {otherField: '5'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: null, siblings: {otherField: '5'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: '', siblings: {otherField: '5'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is undefined', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: '5', siblings: {}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is null', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: '5', siblings: {otherField: null}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is empty string', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: '5', siblings: {otherField: ''}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is 0', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '0'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is negative', function () {
    const validate = numberGteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '-1'}, config})
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberGteToField with params when a value less than other field', function () {
    const validate = numberGteToField('otherField', 'age')
    const ret = validate({value: '-1', siblings: {otherField: '0'}, config})
    expect(ret).to.deep.equal({
      error: Errors.numberGteToField,
      params: {
        value: '-1',
        otherFieldLabel: 'age',
        otherFieldValue: 0
      }
    })
  })
})

describe('numberLteToField', function () {
  it('returns null when given undefined', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: undefined, siblings: {otherField: '5'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: null, siblings: {otherField: '5'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: '', siblings: {otherField: '5'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is undefined', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: '5', siblings: {}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is null', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: '5', siblings: {otherField: null}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when otherField is empty string', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: '5', siblings: {otherField: ''}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is 0', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '0'}, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is positive', function () {
    const validate = numberLteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '1'}, config})
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberLteToField with params when a value greater than other field', function () {
    const validate = numberLteToField('otherField', 'age')
    const ret = validate({value: '1', siblings: {otherField: '0'}, config})
    expect(ret).to.deep.equal({
      error: Errors.numberLteToField,
      params: {
        value: '1',
        otherFieldLabel: 'age',
        otherFieldValue: 0
      }
    })
  })
})

describe('numberWithinRange', function () {
  it('returns null when given undefined', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate({value: undefined, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given null', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate({value: null, config})
    expect(ret).to.equal(null)
  })

  it('returns null when given an empty string', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate({value: '', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given value equal to minValue', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate({value: '0', config})
    expect(ret).to.equal(null)
  })

  it('returns null when given value equal to maxValue', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate({value: '5', config})
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberWithingRange when given value outside range', function () {
    const validate = numberWithinRange(0, 5)
    const ret = validate({value: '5.1', config})
    expect(ret).to.deep.equal({
      error: Errors.numberWithinRange,
      params: {
        value: '5.1',
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
