[![Build Status](https://travis-ci.org/bourbest/sapin.svg?branch=master)](https://travis-ci.org/bourbest/sapin)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/bourbest/sapin/badge.svg?branch=master)](https://coveralls.io/github/bourbest/sapin?branch=master)

# sapin
A library that allows to create an object validation function using a declarative style. The function will store each error
encountered in the resulting object at the same path as the property that had the error. While it can be used to easily
validate forms connected with [redux-form](https://redux-form.com), it can validate any structure.

## Features
* Provides functions for most basic field validations (no date validations, see why)
* Supports the validation of attributes that are arrays of values, array of objects, map of objects, map of values
* Allows to easily add your own custom validator functions
* Supports multiple languages by allowing you to provide your own formatError function

# Example
```js
// Load validators functions
import {applyValidator, required, collection, isPhone, isInteger} from 'sapin'

// create a validator object
const UserValidator = {
  firstName: [required],
  lastName: [required],
  age: [required, isInteger],
  phones: collection([isPhone])
}

// validation function that is called when validating your form or object
export const validateUserForm = (values) => {
  return applyValidator(values, UserValidator)
}

...

// test
const user = {
  firstName: 'Joe',   // pass
                      // no lastName provided
  age: 5.5,           // not an integer
  phones: ['879879', '555-555-5555']  // first phone is invalid
}

const error = validateUserForm(user)

console.log(error)
```

Output is :
```shell
{
  lastName: 'required',
  age: 'invalidInteger',
  phones {
    '0': 'invalidPhoneNumber'
  }
}
```

## Installation

Using npm:
```shell
$ npm i --save sapin
```

sapin is released under the [MIT license](https://github.com/bourbest/sapin/blob/master/LICENSE)

## Why sapin?

TODO




