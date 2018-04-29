import {expect} from 'chai'
import {isPureObject, isEmptyValue} from '../src/utils'

describe('isEmptyValue', function () {
  it('returns true when given null', function () {
    const ret = isEmptyValue(null)
    expect(ret).to.be.true
  })

  it('returns true when given undefined', function () {
    const ret = isEmptyValue(undefined)
    expect(ret).to.be.true
  })

  it('returns true when given an empty string', function () {
    const ret = isEmptyValue('')
    expect(ret).to.be.true
  })

  it('returns false when given any other value', function () {
    const ret = isEmptyValue([])
    expect(ret).to.be.false
  })
})

describe('isPureObject', function () {
  it('returns false when given an array', function () {
    const ret = isPureObject([])
    expect(ret).to.be.false
  })

  it('returns true when given an object', function () {
    const ret = isPureObject({})
    expect(ret).to.be.true
  })

  it('returns false when given a string', function () {
    const ret = isPureObject('')
    expect(ret).to.be.false
  })

  it('returns false when given a number', function () {
    const ret = isPureObject(66)
    expect(ret).to.be.false
  })

  it('returns false when given a bool', function () {
    const ret = isPureObject(true)
    expect(ret).to.be.false
  })

  it('returns false when given a function', function () {
    const ret = isPureObject(function () {})
    expect(ret).to.be.false
  })
})
