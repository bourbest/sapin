(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define("sapin", ["lodash"], factory);
	else if(typeof exports === 'object')
		exports["sapin"] = factory(require("lodash"));
	else
		root["sapin"] = factory(root["_"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = exports.defaultConfig = exports.noTrim = exports.Errors = undefined;

var _lodash = __webpack_require__(0);

var Errors = exports.Errors = {
  required: 'sapin.required',
  isNumber: 'sapin.invalidNumber',
  isInteger: 'sapin.invalidInteger',
  isPositive: 'sapin.valueShouldBePositive',
  isNegative: 'sapin.valueShouldBeNegative',
  isGt: 'sapin.valueShouldBeGt',
  isGte: 'sapin.valueShouldBeGte',
  isLt: 'sapin.valueShouldBeLt',
  isLte: 'sapin.valueShouldBeLte',
  isGtField: 'sapin.valueShouldBeGtField',
  isGteToField: 'sapin.valueShouldBeGteField',
  isLtField: 'sapin.valueShouldBeLtField',
  isLteToField: 'sapin.valueShouldBeLteField',
  withinRange: 'sapin.valueNotInRange',
  minLength: 'sapin.valueNotLongEnough',
  maxLength: 'sapin.valueTooLong',
  isEmail: 'sapin.invalidEmail'
};

var noTrim = exports.noTrim = function noTrim() {
  return true;
};

var internalFormatError = function internalFormatError(error /*, config */) {
  return error;
};

var getValue = function getValue(entity, path, validators, config) {
  var value = (0, _lodash.get)(entity, path, undefined);
  if (typeof value === 'string' && config.useTrim) {
    if (!(0, _lodash.isArray)(validators) || validators.indexOf(noTrim) === -1) {
      value = (0, _lodash.trim)(value);
    }
  }
  return value;
};

// caller should not pass undefined or null
var getNumber = function getNumber(value) {
  var transformedValue = value;
  if ((0, _lodash.isString)(transformedValue)) {
    transformedValue = transformedValue.replace(',', '.');
  }
  return Number(transformedValue);
};

var isEmptyValue = function isEmptyValue(value) {
  return value === undefined || value === null || value === '';
};

var defaultConfig = exports.defaultConfig = {
  formatError: internalFormatError,
  getValue: getValue,
  getNumber: getNumber,
  isEmptyValue: isEmptyValue,
  useTrim: true,
  params: {}
};

var createConfig = exports.createConfig = function createConfig(newConfig) {
  var config = Object.assign({}, defaultConfig, newConfig);
  if (true) {
    var KNOWN_KEYS = new Set((0, _lodash.keys)(defaultConfig));
    var unexpectedKeys = (0, _lodash.filter)((0, _lodash.keys)(newConfig), function (key) {
      return !KNOWN_KEYS.has(key);
    });
    if (unexpectedKeys.length) {
      throw new Error('createConfig received an unexpected key \'' + unexpectedKeys.join(', ') + '\'');
    }
  }
  return config;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collection = exports.ValidatorTypes = undefined;

var _lodash = __webpack_require__(0);

var ValidatorTypes = exports.ValidatorTypes = {
  object: 1,
  collectionOfValues: 2,
  collectionOfObjects: 3
};

var isObjectOrArrayOfFunctions = function isObjectOrArrayOfFunctions(target) {
  var ret = false;
  if ((0, _lodash.isArray)(target)) {
    ret = (0, _lodash.every)(target, _lodash.isFunction);
  } else {
    ret = (0, _lodash.isObject)(target);
  }
  return ret;
};

var ensureCollectionParamsAreValid = function ensureCollectionParamsAreValid(validator, valueValidator) {
  if (!isObjectOrArrayOfFunctions(validator)) {
    throw new Error('The \'validator\' argument of collection must be a validator object or an array of validator functions');
  } else if (!(0, _lodash.isNil)(valueValidator) && !isObjectOrArrayOfFunctions(valueValidator)) {
    throw new Error('The \'valueValidator\' argument of collection must be a validator object or an array of validator functions');
  }
};

var collection = exports.collection = function collection(validator, valueValidator) {
  var ret = {
    __validator: validator,
    __valueValidator: valueValidator

    /* istanbul ignore else: node-env */
  };if (true) {
    ensureCollectionParamsAreValid(validator, valueValidator);
  }

  // validator is either an array or an object when we reach this point
  if ((0, _lodash.isArray)(validator) || (0, _lodash.isFunction)(validator)) {
    ret.__type = ValidatorTypes.collectionOfValues;
  } else {
    ret.__type = ValidatorTypes.collectionOfObjects;
  }
  return ret;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _numbersValidators = __webpack_require__(4);

Object.defineProperty(exports, 'isNumber', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isNumber;
  }
});
Object.defineProperty(exports, 'isInteger', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isInteger;
  }
});
Object.defineProperty(exports, 'isPositive', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isPositive;
  }
});
Object.defineProperty(exports, 'isNegative', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isNegative;
  }
});
Object.defineProperty(exports, 'isGt', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isGt;
  }
});
Object.defineProperty(exports, 'isGte', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isGte;
  }
});
Object.defineProperty(exports, 'isLt', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isLt;
  }
});
Object.defineProperty(exports, 'isLte', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isLte;
  }
});
Object.defineProperty(exports, 'isGtField', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isGtField;
  }
});
Object.defineProperty(exports, 'isGteToField', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isGteToField;
  }
});
Object.defineProperty(exports, 'isLtField', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isLtField;
  }
});
Object.defineProperty(exports, 'isLteToField', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.isLteToField;
  }
});
Object.defineProperty(exports, 'withinRange', {
  enumerable: true,
  get: function get() {
    return _numbersValidators.withinRange;
  }
});

var _requiredValidators = __webpack_require__(5);

Object.defineProperty(exports, 'required', {
  enumerable: true,
  get: function get() {
    return _requiredValidators.required;
  }
});
Object.defineProperty(exports, 'requiredIfOtherFieldIsTrue', {
  enumerable: true,
  get: function get() {
    return _requiredValidators.requiredIfOtherFieldIsTrue;
  }
});
Object.defineProperty(exports, 'requiredIfOtherFieldIsFalse', {
  enumerable: true,
  get: function get() {
    return _requiredValidators.requiredIfOtherFieldIsFalse;
  }
});
Object.defineProperty(exports, 'requiredIfOtherFieldEquals', {
  enumerable: true,
  get: function get() {
    return _requiredValidators.requiredIfOtherFieldEquals;
  }
});

var _common = __webpack_require__(1);

Object.defineProperty(exports, 'createConfig', {
  enumerable: true,
  get: function get() {
    return _common.createConfig;
  }
});
Object.defineProperty(exports, 'noTrim', {
  enumerable: true,
  get: function get() {
    return _common.noTrim;
  }
});

var _stringsValidators = __webpack_require__(6);

Object.defineProperty(exports, 'minLength', {
  enumerable: true,
  get: function get() {
    return _stringsValidators.minLength;
  }
});
Object.defineProperty(exports, 'maxLength', {
  enumerable: true,
  get: function get() {
    return _stringsValidators.maxLength;
  }
});
Object.defineProperty(exports, 'isEmail', {
  enumerable: true,
  get: function get() {
    return _stringsValidators.isEmail;
  }
});

var _collections = __webpack_require__(2);

Object.defineProperty(exports, 'collection', {
  enumerable: true,
  get: function get() {
    return _collections.collection;
  }
});

var _validate = __webpack_require__(7);

Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function get() {
    return _validate.validate;
  }
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withinRange = exports.isLtField = exports.isLteToField = exports.isGtField = exports.isGteToField = exports.isLt = exports.isLte = exports.isGt = exports.isGte = exports.isNegative = exports.isPositive = exports.isInteger = exports.isNumber = undefined;

var _lodash = __webpack_require__(0);

var _common = __webpack_require__(1);

var isNumber = exports.isNumber = function isNumber(_ref) {
  var value = _ref.value,
      config = _ref.config;

  if (config.isEmptyValue(value)) return null;
  var valueToTest = config.getNumber(value);
  return isNaN(valueToTest) ? _common.Errors.isNumber : null;
};

var isInteger = exports.isInteger = function isInteger(_ref2) {
  var value = _ref2.value,
      config = _ref2.config;

  if (config.isEmptyValue(value)) return null;
  var numberValue = config.getNumber(value);
  return !Number.isInteger(numberValue) ? _common.Errors.isInteger : null;
};

var compareSign = function compareSign(value, isPositive, config) {
  var err = null;

  if (!config.isEmptyValue(value)) {
    var numberValue = config.getNumber(value);
    if (isNaN(numberValue)) {
      err = _common.Errors.isNumber;
    } else if (isPositive && numberValue < 0) {
      err = _common.Errors.isPositive;
    } else if (!isPositive && numberValue >= 0) {
      err = _common.Errors.isNegative;
    }
  }
  return err;
};

var isPositive = exports.isPositive = function isPositive(_ref3) {
  var value = _ref3.value,
      config = _ref3.config;

  return compareSign(value, true, config);
};

var isNegative = exports.isNegative = function isNegative(_ref4) {
  var value = _ref4.value,
      config = _ref4.config;

  return compareSign(value, false, config);
};

var getNumbers = function getNumbers(value, otherFieldName, siblings, config) {
  var ret = { value: undefined, otherFieldValue: undefined };
  if (!config.isEmptyValue(value)) {
    ret.value = config.getNumber(value);
  }
  var otherFieldValue = (0, _lodash.get)(siblings, otherFieldName);
  if (!config.isEmptyValue(otherFieldValue)) {
    ret.otherFieldValue = config.getNumber(otherFieldValue);
  }
  return ret;
};

var compareWithOtherField = function compareWithOtherField(value, otherFieldName, otherFieldLabel, siblings, config, op, errorCode) {
  var err = null;
  var operands = getNumbers(value, otherFieldName, siblings, config);
  if (!isNaN(operands.value) && !isNaN(operands.otherFieldValue)) {
    err = op(operands.value, operands.otherFieldValue) ? null : {
      error: errorCode,
      params: {
        value: value,
        otherFieldValue: operands.otherFieldValue,
        otherFieldLabel: otherFieldLabel
      }
    };
  } else if (operands.value !== undefined && isNaN(operands.value)) {
    err = _common.Errors.isNumber;
  }

  return err;
};

var compareToThreshold = function compareToThreshold(value, op, threshold, config, errorCode) {
  var err = null;
  var numberValue = NaN;
  if (!config.isEmptyValue(value)) {
    numberValue = config.getNumber(value);
    if (isNaN(numberValue)) {
      err = _common.Errors.isNumber;
    } else if (!op(numberValue, threshold)) {
      err = {
        error: errorCode,
        params: { value: value, threshold: threshold }
      };
    }
  }
  return err;
};

var isGte = exports.isGte = function isGte(threshold) {
  return function (_ref5) {
    var value = _ref5.value,
        config = _ref5.config;

    return compareToThreshold(value, _lodash.gte, threshold, config, _common.Errors.isGte);
  };
};

var isGt = exports.isGt = function isGt(threshold) {
  return function (_ref6) {
    var value = _ref6.value,
        config = _ref6.config;

    return compareToThreshold(value, _lodash.gt, threshold, config, _common.Errors.isGt);
  };
};

var isLte = exports.isLte = function isLte(threshold) {
  return function (_ref7) {
    var value = _ref7.value,
        config = _ref7.config;

    return compareToThreshold(value, _lodash.lte, threshold, config, _common.Errors.isLte);
  };
};

var isLt = exports.isLt = function isLt(threshold) {
  return function (_ref8) {
    var value = _ref8.value,
        config = _ref8.config;

    return compareToThreshold(value, _lodash.lt, threshold, config, _common.Errors.isLt);
  };
};

var isGteToField = exports.isGteToField = function isGteToField(fieldName, fieldLabel) {
  return function (_ref9) {
    var value = _ref9.value,
        siblings = _ref9.siblings,
        config = _ref9.config;

    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, _lodash.gte, _common.Errors.isGteToField);
  };
};

var isGtField = exports.isGtField = function isGtField(fieldName, fieldLabel) {
  return function (_ref10) {
    var value = _ref10.value,
        siblings = _ref10.siblings,
        config = _ref10.config;

    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, _lodash.gt, _common.Errors.isGtField);
  };
};

var isLteToField = exports.isLteToField = function isLteToField(fieldName, fieldLabel) {
  return function (_ref11) {
    var value = _ref11.value,
        siblings = _ref11.siblings,
        config = _ref11.config;

    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, _lodash.lte, _common.Errors.isLteToField);
  };
};

var isLtField = exports.isLtField = function isLtField(fieldName, fieldLabel) {
  return function (_ref12) {
    var value = _ref12.value,
        siblings = _ref12.siblings,
        config = _ref12.config;

    return compareWithOtherField(value, fieldName, fieldLabel, siblings, config, _lodash.lt, _common.Errors.isLtField);
  };
};

var ensureRangeParamsAreValid = function ensureRangeParamsAreValid(minValue, maxValue) {
  if ((0, _lodash.isNil)(minValue) || (0, _lodash.isNil)(maxValue)) {
    throw new Error('minValue and maxValue cannot be null');
  } else if (minValue > maxValue) {
    throw new Error('minValue > maxValue');
  } else if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
    throw new Error('range value must be numbers');
  }
};
var withinRange = exports.withinRange = function withinRange(minValue, maxValue) {
  if (true) {
    ensureRangeParamsAreValid(minValue, maxValue);
  }

  return function (_ref13) {
    var value = _ref13.value,
        config = _ref13.config;

    if (config.isEmptyValue(value)) return null;
    var numberValue = config.getNumber(value);
    if (isNaN(numberValue)) return _common.Errors.isNumber;
    if (numberValue < minValue || numberValue > maxValue) {
      return {
        error: _common.Errors.withinRange,
        params: { value: value, minValue: minValue, maxValue: maxValue }
      };
    }
    return null;
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requiredIfOtherFieldEquals = exports.requiredIfOtherFieldIsFalse = exports.requiredIfOtherFieldIsTrue = exports.required = undefined;

var _lodash = __webpack_require__(0);

var _common = __webpack_require__(1);

// required validators
var required = exports.required = function required(_ref) {
  var value = _ref.value,
      config = _ref.config;

  return config.isEmptyValue(value) ? _common.Errors.required : null;
};

var requiredIfOtherFieldIsTrue = exports.requiredIfOtherFieldIsTrue = function requiredIfOtherFieldIsTrue(otherFieldName) {
  return function (params) {
    var otherFieldValue = (0, _lodash.get)(params.siblings, otherFieldName, false);
    if (otherFieldValue) {
      return required(params);
    }
    return null;
  };
};

var requiredIfOtherFieldIsFalse = exports.requiredIfOtherFieldIsFalse = function requiredIfOtherFieldIsFalse(otherFieldName) {
  return function (params) {
    var otherFieldValue = (0, _lodash.get)(params.siblings, otherFieldName, true);
    if (!otherFieldValue) {
      return required(params);
    }
    return null;
  };
};

// expectedFieldValue can be a single value or an array of values
var requiredIfOtherFieldEquals = exports.requiredIfOtherFieldEquals = function requiredIfOtherFieldEquals(otherFieldName, expectedFieldValue) {
  expectedFieldValue = (0, _lodash.isArray)(expectedFieldValue) ? expectedFieldValue : [expectedFieldValue];
  var expectedValues = new Set(expectedFieldValue);
  return function (params) {
    var otherFieldValue = (0, _lodash.get)(params.siblings, otherFieldName, false);
    if (expectedValues.has(otherFieldValue)) {
      return required(params);
    }
    return null;
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maxLength = exports.minLength = exports.isEmail = undefined;

var _common = __webpack_require__(1);

var EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
var isEmail = exports.isEmail = function isEmail(_ref) {
  var value = _ref.value,
      config = _ref.config;

  if (config.isEmptyValue(value)) return null;
  return !EMAIL_REGEX.test(value) ? _common.Errors.isEmail : null;
};

var minLength = exports.minLength = function minLength(_minLength) {
  return function (_ref2) {
    var value = _ref2.value,
        config = _ref2.config;

    var err = null;
    if (!config.isEmptyValue(value) && value.length < _minLength) {
      err = { error: _common.Errors.minLength, params: { value: value, minLength: _minLength } };
    }
    return err;
  };
};

var maxLength = exports.maxLength = function maxLength(_maxLength) {
  return function (_ref3) {
    var value = _ref3.value,
        config = _ref3.config;

    var err = null;
    if (!config.isEmptyValue(value) && value.length > _maxLength) {
      err = { error: _common.Errors.maxLength, params: { value: value, maxLength: _maxLength } };
    }
    return err;
  };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = undefined;

var _lodash = __webpack_require__(0);

var _common = __webpack_require__(1);

var _validatorRunner = __webpack_require__(8);

var internalProps = ['__type', '__validator', '__valueValidator'];

var ensureArrayContainsOnlyFunctions = function ensureArrayContainsOnlyFunctions(validator, propName) {
  for (var i = 0; i < validator.length; i++) {
    if (!(0, _lodash.isFunction)(validator[i])) {
      throw new Error('validator definition at path ' + propName + ' expects an array of functions. Item a index ' + i + ' isn\'t one');
    }
  }
};
var ensureValidatorIsValid = function ensureValidatorIsValid(validator, propName) {
  if ((0, _lodash.isArray)(validator)) {
    ensureArrayContainsOnlyFunctions(validator, propName);
  } else if (!(0, _lodash.isFunction)(validator) && (0, _lodash.isObject)(validator)) {
    var propValidators = (0, _lodash.keys)((0, _lodash.omit)(validator, internalProps));
    propValidators.forEach(function (prop) {
      var childPropName = propName + '.' + prop;
      ensureValidatorIsValid(validator[prop], childPropName);
    });
  } else if (!(0, _lodash.isFunction)(validator)) {
    throw new Error('validator definition at path ' + propName + ' must be an object, a function or an array of validator function');
  }
};

var validate = exports.validate = function validate(values, validator) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  config = config || _common.defaultConfig;
  if (true) {
    if (!(0, _lodash.isObject)(validator)) {
      throw new Error('validate second argument must be a validator object');
    }
    for (var prop in validator) {
      ensureValidatorIsValid(validator[prop], prop);
    }
  }

  var runner = new _validatorRunner.ValidatorRunner(values, validator, config);
  return runner.run();
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorRunner = undefined;

var _lodash = __webpack_require__(0);

var _collections = __webpack_require__(2);

var ValidatorRunner = exports.ValidatorRunner = function ValidatorRunner(entity, validators, config) {
  this.entity = entity;
  this.validators = validators;
  (0, _lodash.assign)(this, config);
};

ValidatorRunner.prototype.run = function () {
  this.errors = {};
  this.validateObject(null, this.entity, this.validators, this.entity);
  return this.errors;
};

ValidatorRunner.prototype.runFunctions = function (value, validations, siblings) {
  var err = null;
  if (!(0, _lodash.isArray)(validations)) {
    validations = [validations];
  }
  for (var i = 0; !err && i < validations.length; i++) {
    var validation = validations[i];
    err = validation({ value: value, siblings: siblings, entity: this.entity, config: this });
  }
  return err;
};

var ensureValidatorErrorIsValid = function ensureValidatorErrorIsValid(error) {
  if ((0, _lodash.isObject)(error)) {
    if ((0, _lodash.isNil)(error.error)) {
      throw new Error('a custom validator returned an error object without specifying the error property');
    }
    var purgedError = (0, _lodash.omit)(error, ['error', 'params']);
    if ((0, _lodash.size)(purgedError) > 0) {
      throw new Error('a custom validator returned an error object with unexpected properties. Additional properties should be added to the params attribute');
    }
  }
};

ValidatorRunner.prototype.setError = function (path, error, value) {
  if (true) {
    ensureValidatorErrorIsValid(error);
  }
  var errorObject = (0, _lodash.isObject)(error) ? error : { error: error, params: { value: value } };
  var formattedError = this.formatError(errorObject);
  (0, _lodash.setWith)(this.errors, path, formattedError, Object);
};

ValidatorRunner.prototype.validateField = function (propPath, value, validations, siblings) {
  validations = (0, _lodash.isFunction)(validations) ? [validations] : validations;
  var error = this.runFunctions(value, validations, siblings);
  if (error) {
    this.setError(propPath, error, value);
  }
};

ValidatorRunner.prototype.applyValueValidatorOnObject = function (propPath, value, valueValidator, siblings) {
  var valueError = this.runFunctions(value, valueValidator, siblings);
  if (valueError) {
    this.setError(propPath + '._error', valueError, value);
  }
};

ValidatorRunner.prototype.validateCollectionOfObjects = function (propPath, objectsCollection, validator) {
  var _this = this;

  (0, _lodash.forEach)(objectsCollection, function (object, idx) {
    var objectPath = propPath + '.' + idx;
    _this.validateObject(objectPath, object, validator, object, objectsCollection);
  });
};

ValidatorRunner.prototype.validateCollectionOfValues = function (propPath, valuesCollection, validator, siblings) {
  var _this2 = this;

  (0, _lodash.forEach)(valuesCollection, function (value, idx) {
    var valuePath = propPath + '.' + idx;
    var valueToValidate = _this2.getValue(valuesCollection, idx, validator, _this2);

    _this2.validateField(valuePath, valueToValidate, validator, siblings);
  });
};

ValidatorRunner.prototype.validateObject = function (objectPath, object, objectValidator, siblings) {
  for (var propNameToValidate in objectValidator) {
    var propValidations = objectValidator[propNameToValidate];
    var propPath = objectPath ? objectPath + '.' + propNameToValidate : propNameToValidate;
    var value = this.getValue(object, propNameToValidate, propValidations, this);

    if ((0, _lodash.isArray)(propValidations) || (0, _lodash.isFunction)(propValidations)) {
      this.validateField(propPath, value, propValidations, siblings);
    } else if (!propValidations.__type) {
      this.validateObject(propPath, value, propValidations, value);
    }

    if (propValidations.__valueValidator) {
      this.applyValueValidatorOnObject(propPath, value, propValidations.__valueValidator, siblings);
    }

    if (propValidations.__type === _collections.ValidatorTypes.collectionOfObjects) {
      this.validateCollectionOfObjects(propPath, value, propValidations.__validator);
    } else if (propValidations.__type === _collections.ValidatorTypes.collectionOfValues) {
      this.validateCollectionOfValues(propPath, value, propValidations.__validator, object);
    }
  }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=sapin.js.map