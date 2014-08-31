var chai = require('chai');
var expect = chai.expect;

// Define global for module under test
var LocalStorage = require('node-localstorage').LocalStorage;
GLOBAL.localStorage = new LocalStorage('./localstorage');

var Model = require('ampersand-model');
var LocalStorageCollection = require('../ampersand-localstorage-collection');


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

      var storedModel = JSON.parse(localStorage.getItem(ns + '_0'));

      expect(localStorage.length).to.equal(1);
      expect(storedModel).to.eql({
        id: 0,
        foo: 'bar',
        baz: 5
      });
    });

    it('should store a document using model instance', function () {
      var model = new TestModel({
        foo: 'bar',
        baz: 5
      });
      collection.create(model);

      var storedModel = JSON.parse(localStorage.getItem(ns + '_0'));

      expect(localStorage.length).to.equal(1);
      expect(storedModel).to.eql(model.toJSON());
    });
  });
});