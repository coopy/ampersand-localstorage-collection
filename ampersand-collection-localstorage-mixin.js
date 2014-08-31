var extend = require('extend-object');
var index = 0;

var makeKey = function(namespace, id) {
    return [namespace, '_', id].join('');
};

var makeId = function() {
    var id = index;
    index++;
    return id;
};

module.exports = {
    // Collections should define a namespace for localStorage.
    namespace: null,

    create: function (model, options) {
        var id = makeId();

        options = options ? extend({}, options) : {};
        if (!(model = this._prepareModel(model, options))) return false;

        model.set(model.idAttribute, id);

        if (!options.wait) this.add(model, options);
        try {
            // TODO check this.isModel(model)
            localStorage.setItem(makeKey(this.namespace, id), JSON.stringify(model.toJSON()));
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