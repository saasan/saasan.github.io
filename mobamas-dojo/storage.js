'use strict';

var Storage = function(opt_type, opt_namespace) {
  if (typeof localStorage === 'undefined') {
    throw new Error('Web Storage is not available');
  }

  if (arguments.length == 0) opt_type = true;
  if (arguments.length < 2 || opt_namespace == null) opt_namespace = '';

  this._storage = (opt_type ? localStorage : sessionStorage);
  this._namespace = opt_namespace + '_';
};

Storage.prototype = {
  _namespace: '',

  get: function(key, opt_defaultValue, opt_reviver) {
    if (arguments.length == 1) opt_defaultValue = null;

    var value = this._storage.getItem(this._namespace + key);
    if (value !== null) {
      if (arguments.length > 2 && typeof opt_reviver === 'function') {
        return JSON.parse(value, opt_reviver);
      }
      else {
        return JSON.parse(value);
      }
    }

    return opt_defaultValue;
  },

  set: function(key, value) {
    var JSONValue = JSON.stringify(value);
    this._storage.setItem(this._namespace + key, JSONValue);
  },

  remove: function(key) {
    this._storage.removeItem(this._namespace + key);
  }
};
