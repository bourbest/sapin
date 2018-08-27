import {expect} from 'chai'
import {
  getString,
  getTrimmedString,
  getNumber,
  getFriendlyNumber,
  getDate,
  getBool
} from '../src/getters'

describe('getString', function () {
  it('returns null when given undefined', function () {
    const res = getString()
    expect(res).to.be.null
  })
  it('returns a string when given a number', function () {
    const res = getString(6)
    expect(res).to.equal('6')
  })
})

describe('getTrimmedString', function () {
  it('returns null when given undefined', function () {
    const res = getTrimmedString()
    expect(res).to.be.null
  })
  it('returns a string when given a number', function () {
    const res = getTrimmedString(6)
    expect(res).to.equal('6')
  })
  it('returns a trimmed string', function () {
    const res = getTrimmedString('  test  ')
    expect(res).to.equal('test')
  })
})

describe('getNumber', function () {
  it('returns null when given undefined', function () {
    const res = getNumber()
    expect(res).to.be.null
  })

  it('returns NaN when given an invalid number', function () {
    const res = getNumber('fsdfs')
    expect(isNaN(res)).to.be.true
  })

  it('returns a Number when given a valid number string', function () {
    const res = getNumber('60')
    expect(res).to.equal(60)
  })

  it('returns a Number when given a Number', function () {
    const res = getNumber(60)
    expect(res).to.equal(60)
  })
})

describe('getFriendlyNumber', function () {
  it('returns null when given undefined', function () {
    const res = getFriendlyNumber()
    expect(res).to.be.null
  })

  it('returns NaN when given an invalid number', function () {
    const res = getFriendlyNumber('fsdfs')
    expect(isNaN(res)).to.be.true
  })

  it('returns a Number when given a valid number string', function () {
    const res = getFriendlyNumber('60')
    expect(res).to.equal(60)
  })

  it('returns a Number when given a Number', function () {
    const res = getFriendlyNumber(60)
    expect(res).to.equal(60)
  })

  it('returns a valid Number when given a number string with a coma', function () {
    const res = getFriendlyNumber('60,6')
    expect(res).to.equal(60.6)
  })
})

describe('getDate', function () {
  it('returns null when given undefined', function () {
    const res = getDate()
    expect(res).to.be.null
  })

  it('returns value converted to Date when given a valid date string', function () {
    const res = getDate('2017-01-01')
    expect(res).to.deep.equal(new Date('2017-01-01'))
  })

  it('returns the same date if given a Date value', function () {
    const date = new Date('2017-01-01')
    const res = getDate(date)
    expect(res).to.deep.equal(date)
  })
})

describe('getBool', function () {
  it('returns null when given undefined', function () {
    const res = getBool()
    expect(res).to.be.null
  })

  it('returns value converted to bool when given "true" string', function () {
    const res = getBool('true')
    expect(res).to.equal(true)
  })

  it('returns value converted to bool when given true value', function () {
    const res = getBool(true)
    expect(res).to.equal(true)
  })

  it('returns value converted to bool when given "false" string', function () {
    const res = getBool('false')
    expect(res).to.equal(false)
  })

  it('returns value converted to bool when given false value', function () {
    const res = getBool(false)
    expect(res).to.equal(false)
  })

})
