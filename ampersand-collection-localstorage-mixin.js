var extend = require('extend-object');

var makeKey = function(namespace, id) {
    return [namespace, '_', id].join('');
};

var makeId = function() {
    return localStorage.length;
};

module.exports = {
    // Collections should define a namespace for localStorage.
    namespace: null,
    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
        options = options ? extend({}, options) : {};
        if (options.parse === void 0) options.parse = true;
        var success = options.success;
        var collection = this;
        options.success = function(resp) {
            var method = options.reset ? 'reset' : 'set';
            collection[method](resp, options);
            if (success) success(collection, resp, options);
            collection.trigger('sync', collection, resp, options);
        };
        // TODO: wrapError(this, options);

        var models = [];
        var result;
        var data;
        localStorage.keys.forEach(function (key) {
            if (key.indexOf(collection.namespace + '_') === 0) {
                models.push(localStorage.getItem(key));
            }
        });
        result = '[' + models.join(',') + ']';
        data = JSON.parse(result);
        options.success(data);
    },
    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for localStorage to succeed.
    create: function (model, options) {
        var id = makeId();
        var data;

        options = options ? extend({}, options) : {};
        if (!(model = this._prepareModel(model, options))) return false;

        model.set(model.idAttribute, id);

        if (!options.wait) this.add(model, options);
        try {
            data = this.isModel(model) ? model.toJSON() : model;
            localStorage.setItem(makeKey(this.namespace, id), JSON.stringify(data));
            // model.set(model.idAttribute, id);
            if (options.wait) this.add(model, options);
            if (options.success) options.success(model, resp, options);
        } catch (error) {
            console.error(error);
            if (options.error) options.error(model, error, options);
            if (model.trigger) model.trigger('error', model, error, options);
        }
        return model;
    }
};