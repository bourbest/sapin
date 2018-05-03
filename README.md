[![Build Status](https://travis-ci.org/bourbest/sapin.svg?branch=master)](https://travis-ci.org/bourbest/sapin)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/bourbest/sapin/badge.svg?branch=master)](https://coveralls.io/github/bourbest/sapin?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/abca65344775ccc8b3bf/maintainability)](https://codeclimate.com/github/bourbest/sapin/maintainability)

# sapin
Sapin is a library that allows to easily create a Schema using a declarative style. This schema can then :
* be be validated with the _validate_ function, will store each error encountered in a new object at the same path as the property that had the error. While it can be used to easily validate forms connected with [redux-form](https://redux-form.com), it can validate any structure.
* be transformed with the _transform_ function, to convert each of the object's property to the right type.

## Features
* Provides functions for most basic field validations (no date validations, use your own formats and libs)
* Support validation of inner structures
* Supports the validation of attributes that are arrays of values, array of objects, dictionary of objects, dictionary of values
* Validations on an object property can be applied to its members, on the whole object or on both
* Allows to easily add your own custom validator functions

# Example
```js
// Load validators functions
import {Schema, validate, required, integer, maxLength, string, arrayOf, isPositive} from 'sapin'
import {isPhone, requiresAtLeastOne} from 'myCustomValidators'

// create a Schema
const userSchema = new Schema({
  firstName: string(required),
  lastName: string(required),
  age: integer(isPositive),
  phones: arrayOf(string(isPhone), requiresAtLeastOne),
  address: {
    civicNumber: string(required),
    streetName: string([required, maxLength(50)]),
    city: string
  }
})

// validation function that is called when validating your form or object
export const validateUserForm = (values, props) => {
  return validate(values, userSchema, props)
}

...

// test
const user = {
  firstName: 'Joe',   // pass
                      // no lastName provided
  age: 5.5,           // not an integer
  phones: ['555', '555-555-5555']  // first phone is invalid
  address: {
    civicNumber: '344',
    streetName: '65th street',
    city: 'Québec'
  }
}

const error = validateUserForm(user)

console.log(error)
```

Output is :
```shell
{
  lastName: {error: 'sapin.required', params: {value: null}},
  age: {error: 'sapin.invalidInteger', params: {value: 5.5}},
  phones {
    '0': { error: 'myErrors.invalidPhoneNumber', params: {value: '555'}}
  }
}
```
## Documentation
Documentation can be found in the [wiki](https://github.com/bourbest/sapin/wiki)

## Installation

Using npm:
```shell
$ npm i --save sapin
```

sapin is released under the [MIT license](https://github.com/bourbest/sapin/blob/master/LICENSE)

## Why sapin?
While there are many libraries out there that allow to achieve the same goal, Sapin allows to describe complex structures
in a really simple manner. You can use the schema to validate and/or transform the data before sending it to a server or database.

