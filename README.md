[![Build Status](https://travis-ci.org/bourbest/declarative-validator.svg?branch=master)](https://travis-ci.org/bourbest/declarative-validator)

# declarative-validator
A library that allows to create an object validation function using a declarative style. The function will store each error
encountered in the resulting object at the same path as the property that had the error. While it can be used to easily
validate forms connected with [redux-form](https://redux-form.com), it can validate any structure.

## Features
* Provide functions for most basic field validations (no date validations, see why)
* Support the validation of attributes that are arrays of values, array of objects, map of objects, map of values
* Easily add your own custom validator functions
* Provide your formatError function to easily translate errors in the user's selected language

# Example
```js
// Load validators functions
import {applyValidator, required, collection, isPhone, isInteger} from 'declarative-validator'

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
$ npm i --save declarative-validator
```

declarative-validator is released under the [MIT license](https://github.com/bourbest/declarative-validator/blob/master/LICENSE)

## Why declarative-validator?

TODO




