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