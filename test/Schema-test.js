import {expect} from 'chai'
import {identity} from 'lodash'
import { string, number, arrayOf, PropertyDefinition, ValueTypes } from '../src/types'
import {required} from '../src/required-validators'
import {isPositive} from '../src/numbers-validators'
import Schema from '../src/Schema'
import { Errors } from '../src/errors'

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
})
