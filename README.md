# redux-form-validator
A simple library that allows to create a validation function using a declarative style

## Installation

In a browser:
```html
<script src="redux-form-validators.js"></script>
```

Using npm:
```shell
$ npm i -g npm
$ npm i --save lodash
```

In Node.js:
```js
// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');

// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');
```

**Note:**<br>
Install [n_](https://www.npmjs.com/package/n_) for Lodash use in the Node.js < 6 REPL.

## Why Lodash?

Lodash makes JavaScript easier by taking the hassle out of working with arrays,<br>
numbers, objects, strings, etc. Lodash’s modular methods are great for:


## Install

 * [Core build](https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.core.js) ([~4 kB gzipped](https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.core.min.js))
 * [Full build](https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.js) ([~24 kB gzipped](https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.min.js))

redux-form-validators is released under the [MIT license](https://github.com/bourbest/redux-form-validator/blob/master/LICENSE)

