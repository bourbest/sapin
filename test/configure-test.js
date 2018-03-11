import {expect} from 'chai'
import {configureValidators, config} from '../src/common'

describe('configureValidators', function () {
  it('throws when given invalid keys', function () {
    const test = () => configureValidators({test: null})
    expect(test).to.throw('configureValidators received an unexpected key')
  })

  it('overwrites the default config with the provided setting', function () {
    const newConfig = {
      formatError: () => true,
      formatErrorParams: {},
      useTrim: false
    }
    expect(config.formatError).to.equal(newConfig.formatError)
    expect(config.formatErrorParams).to.equal(newConfig.formatErrorParams)
    expect(config.useTrim).to.equal(false)
  })
})
