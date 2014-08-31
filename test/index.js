var chai = require('chai');
var LocalStorage = require('node-localstorage').LocalStorage;
var LocalStorageCollection = require('../ampersand-localstorage-collection');
var Model = require('ampersand-model');

var expect = chai.expect;

// Define global for module under test
GLOBAL.localStorage = new LocalStorage('./localstorage');

var TestModel = Model.extend({
  props: {
    foo: 'string',
    baz: 'value',
    id: 'value'
  }
});

describe('ampersand-localstorage-collection', function () {
  var collection;
  var ns = 'test';

  beforeEach(function () {
    collection = new (LocalStorageCollection.extend({
      namespace: ns,
      model: TestModel
    }))();
  });

  afterEach(function () {
    localStorage.clear();
  });

  describe('create', function () {
    it('should store a document using object literal', function () {
      collection.create({
        foo: 'bar',
        baz: 5
      });

      // console.log(localStorage.length);

      var storedModel = JSON.parse(localStorage.getItem(ns + '_0'));
      expect(storedModel).to.eql({
        id: 0,
        foo: 'bar',
        baz: 5
      });
    });
  });
});