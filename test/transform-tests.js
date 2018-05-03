import {expect} from 'chai'
import transform from '../src/transform'
import SchemaValidator from '../src/Schema'
import {string, number, arrayOf, dictionary, date, boolean} from '../src/types'

describe('transform', function () {
  it('returns the transformed entity', function () {
    const schema = new SchemaValidator({
      name: string,
      address: {
        civicNumber: number,
        createdOn: date
      },
      phones: arrayOf(string),
      friends: dictionary({
        name: string,
        debt: number,
        oldFriend: boolean
      })
    })

    const entity = {
      name: '   Louis Cyr  ',
      address: {
        civicNumber: '4587',
        createdOn: '2017-01-15'
      },
      phones: ['555-555.5555'],
      friends: {
        'idfg': {
          name: 'John Doe',
          debt: '34,55',
          oldFriend: true
        }
      }
    }

    const transformed = transform(entity, schema)
    expect(transformed).to.deep.equal({
      name: 'Louis Cyr',
      address: {
        civicNumber: 4587,
        createdOn: new Date('2017-01-15')
      },
      phones: ['555-555.5555'],
      friends: {
        'idfg': {
          name: 'John Doe',
          debt: 34.55,
          oldFriend: true
        }
      }
    })
  })

  it('returns the same value if property not in schema', function () {
    const schema = new SchemaValidator({
      name: string
    })

    const entity = {
      name: '   Louis Cyr  ',
      age: 34
    }

    const transformed = transform(entity, schema)
    expect(transformed).to.deep.equal({
      name: 'Louis Cyr',
      age: 34
    })
  })

  it('returns the same value if collection property not in schema', function () {
    const schema = new SchemaValidator({
      name: string
    })

    const entity = {
      name: '   Louis Cyr  ',
      scores: [34]
    }

    const transformed = transform(entity, schema)
    expect(transformed).to.deep.equal({
      name: 'Louis Cyr',
      scores: [34]
    })
  })

  it('returns the same value if collection not of the right type', function () {
    const schema = new SchemaValidator({
      name: string,
      scores: dictionary(number)
    })

    const entity = {
      name: '   Louis Cyr  ',
      scores: [34]
    }

    const transformed = transform(entity, schema)
    expect(transformed).to.deep.equal({
      name: 'Louis Cyr',
      scores: [34]
    })
  })
})
