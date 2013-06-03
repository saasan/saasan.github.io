var Storage = function(opt_type, opt_namespace) {
  if (arguments.length == 0) opt_type = true;
  if (arguments.length < 2) opt_namespace = '';

  this._storage = (opt_type ? localStorage : sessionStorage);
  this._namespace = opt_namespace + '_';
};

Storage.prototype = {
  _namespace: '',

  get: function(key, opt_defaultValue) {
    if (arguments.length == 1) opt_defaultValue = null;

    var value = this._storage.getItem(this._namespace + key);
    return (value === null ? opt_defaultValue : JSON.parse(value));
  },

  set: function(key, value) {
    var JSONValue = JSON.stringify(value);
    this._storage.setItem(this._namespace + key, JSONValue);
  },

  remove: function(key) {
    this._storage.removeItem(this._namespace + key);
  }
};
