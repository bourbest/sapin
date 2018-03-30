'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./sapin.min.js');
} else {
  module.exports = require('./sapin.js');
}
