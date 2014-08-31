var Collection = require('ampersand-collection');
var underscoreMixin = require('ampersand-collection-underscore-mixin');
var localStorageMixin = require('./ampersand-collection-localstorage-mixin');

module.exports = Collection.extend(underscoreMixin, localStorageMixin);
