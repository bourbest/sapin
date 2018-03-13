import {expect} from 'chai'
import {createConfig, defaultConfig} from '../src/common'

describe('createConfig', function () {
  it('throws when given invalid keys', function () {
    const test = () => createConfig({test: null})
    expect(test).to.throw('createConfig received an unexpected key')
  })

  it('overwrites the default config with the provided setting', function () {
    const newConfig = {
      formatError: () => true,
      useTrim: false
    }

    const config = createConfig(newConfig)
    expect(config.formatError).to.equal(newConfig.formatError)
    expect(config.useTrim).to.equal(false)
    expect(config.isEmptyValue).to.equal(defaultConfig.isEmptyValue)
  })
})
