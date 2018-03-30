[![Build Status](https://travis-ci.org/bourbest/sapin.svg?branch=master)](https://travis-ci.org/bourbest/sapin)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/bourbest/sapin/badge.svg?branch=master)](https://coveralls.io/github/bourbest/sapin?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/abca65344775ccc8b3bf/maintainability)](https://codeclimate.com/github/bourbest/sapin/maintainability)

# sapin
Sapin is a library that allows to easily create a _Validator object_ using a declarative style. The _validate_ function
can then be used to validate an object against the validator. The function will store each error
encountered in a new object at the same path as the property that had the error. While it can be used to easily
validate forms connected with [redux-form](https://redux-form.com), it can validate any structure.

## Features
* Provides functions for most basic field validations (no date validations, use your own formats and libs)
* Supports the validation of attributes that are arrays of values, array of objects, map of objects, map of values
* Validations on an object property can be applied to its members, on the whole object or on both
* Allows to easily add your own custom validator functions
* Supports multiple languages by allowing you to provide your own formatError function

# Example
```js
// Load validators functions
import {validate, required, collection, isInteger} from 'sapin'
import {isPhone} from 'myCustomValidators'

// create a validator object
const UserValidator = {
  firstName: [required],
  lastName: [required],
  age: [required, isInteger],
  phones: collection([isPhone]),
  address: {
    civicNumber: [required],
    streetName: [required],
    city: [required]
  }
}

// validation function that is called when validating your form or object
export const validateUserForm = (values) => {
  return validate(values, UserValidator)
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
in a really simple manner. It is also really thin (10k) and exposes ES6 modules so that you can only grab what you need.
