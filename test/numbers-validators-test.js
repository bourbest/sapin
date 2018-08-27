import {expect} from 'chai'
import {Errors} from '../src/errors'
import {getNumber} from '../src/getters'
import {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty,
  testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty,
  testThatValidatorHandlesValidAndInvalidValue
} from './common-test-cases'

import {
  isInteger,
  isPositive,
  isNegative,
  isGt, isGte, isLt, isLte,
  isEqualToField,
  isGtField,
  isGteToField,
  isLtField,
  isLteToField,
  withinRange
} from '../src/numbers-validators'

describe('isInteger', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isInteger, getNumber)
  testThatValidatorHandlesValidAndInvalidValue('isInteger', isInteger, getNumber, '0', 'yo!')

  it('returns null when given 0', function () {
    const ret = isInteger({value: 0, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns Error.isInteger when given a decimal number', function () {
    const ret = isInteger({value: '1.5', getter: getNumber})
    expect(ret).to.equal(Errors.isInteger)
  })
})

describe('isPositive', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isPositive, getNumber)
  testThatValidatorHandlesValidAndInvalidValue('isPositive', isPositive, getNumber, '0', '-1')

  it('returns null when given a value greater than 0', function () {
    const ret = isPositive({value: '1', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value greater than 0', function () {
    const ret = isPositive({value: '0.0000001', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns Errors.isPositive when given a negative number', function () {
    const ret = isPositive({value: '-0.1', getter: getNumber})
    expect(ret).to.equal(Errors.isPositive)
  })

  it('returns null when given text', function () {
    const ret = isPositive({value: 'yo', getter: getNumber})
    expect(ret).to.be.null
  })
})

describe('isNegative', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isNegative, getNumber)
  testThatValidatorHandlesValidAndInvalidValue('isNegative', isNegative, getNumber, '-1', '0')

  it('returns null when given a decimal value less than 0', function () {
    const ret = isNegative({value: '-0.0000001', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given a decimal value less than 0 using coma', function () {
    const ret = isNegative({value: '-0,0000001', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given text', function () {
    const ret = isNegative({value: 'yo', getter: getNumber})
    expect(ret).to.be.null
  })

  it('returns Errors.isNegative when given 0', function () {
    const ret = isNegative({value: '0', getter: getNumber})
    expect(ret).to.equal(Errors.isNegative)
  })

  it('returns Errors.isNegative when given a positive number', function () {
    const ret = isNegative({value: '0.1', getter: getNumber})
    expect(ret).to.equal(Errors.isNegative)
  })
})

const testNumberComparerValidatorFunction = (validatorFunction, validatorName, validValue, invalidValue) => {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(validatorFunction, getNumber)

  it('returns null when given a valid value', function () {
    const ret = validatorFunction({value: validValue, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it(`returns Error.${validatorName} when comparison fails`, function () {
    const ret = validatorFunction({value: invalidValue, getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors[validatorName],
      params: {value: invalidValue, threshold: 3}
    })
  })

  it('returns null when given text', function () {
    const ret = validatorFunction({value: 'yo', getter: getNumber})
    expect(ret).to.be.null
  })
}

describe('isGt', function () {
  testNumberComparerValidatorFunction(isGt(3), 'isGt', 4, 3)
})

describe('isGte', function () {
  testNumberComparerValidatorFunction(isGte(3), 'isGte', 3, 2)
})

describe('isLt', function () {
  testNumberComparerValidatorFunction(isLt(3), 'isLt', 2, 3)
})

describe('isLte', function () {
  testNumberComparerValidatorFunction(isLte(3), 'isLte', 3, 4)
})

const testThatValidatorHandlesBadNumberCorrectly = (makeValidator) => {
  const validate = makeValidator('otherField', 'fieldname')
  it('returns null when otherField is an invalid number', function () {
    const ret = validate({value: '5', siblings: {otherField: 'sdfs'}, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when a value is not a number', function () {
    const ret = validate({value: 'yo', siblings: {otherField: 'dfsd'}, getter: getNumber})
    expect(ret).to.be.null
  })
}

describe('isEqualToField', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isEqualToField('test', 'test'))
  testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty(isEqualToField)
  testThatValidatorHandlesBadNumberCorrectly(isEqualToField)

  it('returns Errors.isEqualToField when given 0 and otherField is 1', function () {
    const validate = isEqualToField('otherField', 'age')
    const ret = validate({value: '0', siblings: {otherField: '1'}, getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors.isEqualToField,
      params: {
        value: '0',
        otherFieldLabel: 'age',
        otherFieldValue: 1
      }
    })
  })

  it('returns null when given 0 and otherField is 0', function () {
    const validate = isEqualToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.equal(null)
  })
})

describe('isGtField', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isGtField('test', 'test'))
  testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty(isGtField)
  testThatValidatorHandlesBadNumberCorrectly(isGtField)

  it('returns Errors.isGtField when given 0 and otherField is 0', function () {
    const validate = isGtField('otherField', 'age')
    const ret = validate({value: '0', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors.isGtField,
      params: {
        value: '0',
        otherFieldLabel: 'age',
        otherFieldValue: 0
      }
    })
  })

  it('returns null when given 0 and otherField is negative', function () {
    const validate = isGtField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '-1'}, getter: getNumber})
    expect(ret).to.equal(null)
  })
})

describe('isGteToField', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isGteToField('test', 'test'))
  testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty(isGteToField)
  testThatValidatorHandlesBadNumberCorrectly(isGteToField)

  it('returns null when given 0 and otherField is 0', function () {
    const validate = isGteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is negative', function () {
    const validate = isGteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '-1'}, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns Errors.isGteToField when a value less than other field', function () {
    const validate = isGteToField('otherField', 'age')
    const ret = validate({value: '-1', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors.isGteToField,
      params: {
        value: '-1',
        otherFieldLabel: 'age',
        otherFieldValue: 0
      }
    })
  })
})

describe('isLtField', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isLtField('test', 'test'))
  testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty(isLtField)
  testThatValidatorHandlesBadNumberCorrectly(isLtField)

  it('returns Errors.isLtField when given 0 and otherField is 0', function () {
    const validate = isLtField('otherField', 'age')
    const ret = validate({value: '0', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors.isLtField,
      params: {
        value: '0',
        otherFieldLabel: 'age',
        otherFieldValue: 0
      }
    })
  })

  it('returns null when given 0 and otherField is positive', function () {
    const validate = isLtField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '1'}, getter: getNumber})
    expect(ret).to.equal(null)
  })
})

describe('isLteToField', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(isLteToField('test', 'test'))
  testThatValidatorDoesNotReturnAnErrorWhenOtherFieldIsEmpty(isLteToField)
  testThatValidatorHandlesBadNumberCorrectly(isLteToField)

  it('returns null when given 0 and otherField is 0', function () {
    const validate = isLteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given 0 and otherField is positive', function () {
    const validate = isLteToField('otherField')
    const ret = validate({value: '0', siblings: {otherField: '1'}, getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns Errors.isLteToField with params when a value greater than other field', function () {
    const validate = isLteToField('otherField', 'age')
    const ret = validate({value: '1', siblings: {otherField: '0'}, getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors.isLteToField,
      params: {
        value: '1',
        otherFieldLabel: 'age',
        otherFieldValue: 0
      }
    })
  })
})

describe('withinRange', function () {
  testThatValidatorDoesNotReturnAnErrorWhenFieldIdEmpty(withinRange(0, 5))

  it('returns null when given value equal to minValue', function () {
    const validate = withinRange(0, 5)
    const ret = validate({value: '0', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns null when given value equal to maxValue', function () {
    const validate = withinRange(0, 5)
    const ret = validate({value: '5', getter: getNumber})
    expect(ret).to.equal(null)
  })

  it('returns Errors.numberWithingRange when given value outside range', function () {
    const validate = withinRange(0, 5)
    const ret = validate({value: '5.1', getter: getNumber})
    expect(ret).to.deep.equal({
      error: Errors.withinRange,
      params: {
        value: '5.1',
        minValue: 0,
        maxValue: 5
      }
    })
  })

  it('returns null when given invalid number', function () {
    const validate = withinRange(0, 5)
    const ret = validate({value: 'yo', getter: getNumber})
    expect(ret).to.be.null
  })

  it('throws when given a text minValue', function () {
    expect(() => withinRange('5', 5)).to.throw('range value must be of the same type')
  })

  it('throws when given a text maxValue', function () {
    expect(() => withinRange(5, '5')).to.throw('range value must be of the same type')
  })

  it('throws when given a null minValue', function () {
    expect(() => withinRange(null, 5)).to.throw('minValue and maxValue cannot be null')
  })

  it('throws when given a null maxValue', function () {
    expect(() => withinRange(5, null)).to.throw('minValue and maxValue cannot be null')
  })

  it('throws when given a minValue > maxValue', function () {
    expect(() => withinRange(5, 4)).to.throw('minValue > maxValue')
  })
})
