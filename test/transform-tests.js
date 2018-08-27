import {expect} from 'chai'
import transform from '../src/transform'
import Schema from '../src/Schema'
import {string, number, arrayOf, dictionary, date, boolean} from '../src/types'
import {requiredIfOtherFieldIsTrue, required} from '../src/required-validators'

describe('transform', function () {
  it('returns the transformed entity', function () {
    const schema = new Schema({
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
    const schema = new Schema({
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
    const schema = new Schema({
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
    const schema = new Schema({
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

  it('transforms complex object', function () {
    const clientSchema = new Schema({
      'firstName': string(required),
      'lastName': string(required),
      'gender': string(required),
      'email': string(),
      'birthDate': date,
      'originId': number(required),
      'mainPhoneNumber': {
        value: string([requiredIfOtherFieldIsTrue('canLeaveMessage')]),
        canLeaveMessage: boolean
      },
      'alternatePhoneNumber': {
        value: string([requiredIfOtherFieldIsTrue('canLeaveMessage')]),
        canLeaveMessage: boolean
      }
    })

    const client = {
      firstName: 'sdfg',
      lastName: 'fvadrfs',
      gender: 'M',
      originId: '101',
      mainPhoneNumber: {canLeaveMessage: false},
      alternatePhoneNumber: {canLeaveMessage:false}
    }

    const expected = {...client, originId: 101}
    const ret = transform(client, clientSchema)
    expect(ret).to.deep.equal(expected)
  })
})
