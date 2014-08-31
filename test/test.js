var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./localstorage');
// Define global for module under test
GLOBAL.localStorage = localStorage;

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
  var namespace = 'test';

  beforeEach(function () {
    collection = new (LocalStorageCollection.extend({
      namespace: namespace,
      model: TestModel
    }))();
  });

  afterEach(function () {
    localStorage.clear();
  });

  describe('fetch', function () {
    var models = [
      { foo: 'bar', baz: 1 },
      { foo: 'moo', baz: 2 },
      { foo: 'boo', baz: 3 }
    ];

    beforeEach(function () {
      // Prime localStorage (not via `collection.create`, we don't want to populate it yet).
      models.forEach(function (model, index) {
        localStorage.setItem(namespace + '_' + index, JSON.stringify(model));
      });
    });

    it('should fetch the collection and call `options.success`', function (done) {
      collection.fetch({
        success: function (fetchedCollection, status) {
          expect(fetchedCollection.length).to.equal(3);
          expect(fetchedCollection.at(0).toJSON()).to.eql(models[0]);
          expect(fetchedCollection.at(1).toJSON()).to.eql(models[1]);
          expect(fetchedCollection.at(2).toJSON()).to.eql(models[2]);
          done();
        }
      });
    });

    it('should trigger "sync" on the collection', function () {
      var syncSpy = sinon.spy();
      collection.on('sync', syncSpy)
      collection.fetch();
      expect(syncSpy).to.have.been.calledOnce;
    });
  });

  describe('create', function () {
    it('should store a document using object literal', function () {
      collection.create({
        foo: 'bar',
        baz: 5
      });

      var storedModel = JSON.parse(localStorage.getItem(namespace + '_0'));

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

      var storedModel = JSON.parse(localStorage.getItem(namespace + '_0'));

      expect(localStorage.length).to.equal(1);
      expect(storedModel).to.eql(model.toJSON());
    });
  });
});