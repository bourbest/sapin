import {expect} from 'chai'
import {string} from '../src/types'
import {required} from '../src/required-validators'
import Schema from '../src/Schema'
import {getString} from '../src/getters'

describe('Schema', function () {
  it('throws the schema is null', function () {
    const test = () => new Schema(null)
    expect(test).to.throw('schema must be a valid schema object')
  })

  it('throws the schema is undefined', function () {
    const test = () => new Schema()
    expect(test).to.throw('schema must be a valid schema object')
  })

  it('throws the schema is not a valid object', function () {
    const test = () => new Schema()
    expect(test).to.throw('schema must be a valid schema object')
  })

  it('throws when a property is set to something other thant an object', function () {
    const badSchema = {
      test: 'no'
    }
    const test = () => new Schema(badSchema)
    expect(test).to.throw('Expect an object or a type function (ex.: string, number) in schema at property test')
  })

  it('throws with full path name of the property that is set to something other thant an object', function () {
    const badSchema = {
      test: {
        invalidProp: {
          invalidChild: 44
        }
      }
    }
    const test = () => new Schema(badSchema)
    expect(test).to.throw('Expect an object or a type function (ex.: string, number) in schema at property test.invalidProp.invalidChild')
  })

  it('accepts a property with functions returning a PropertyType', function () {
    const validator = new Schema({
      test: string
    })
    expect(validator.schema.test).to.deep.equal(string())
  })

  it('supports noType property', function () {
    const validator = new Schema({
      test: required,
      test2: [required, required]
    }, true)
    expect(validator.schema.test.validators).to.deep.equal(required)
    expect(validator.schema.test.getter).to.deep.equal(getString)
    expect(validator.schema.test2.validators).to.deep.equal([required, required])
  })

  it('noType property will throw on invalid property value', function () {
    const test = () => {
      const validator = new Schema({
        test: 23423
      }, true)
    }
    expect(test).to.throw('Expect a collection or validator at property test')
  })
})
