var Storage = function(type, namespace) {
  type = (type == null ? false : type);
  namespace = (namespace == null ? '' : namespace);

  this._storage = (type ? localStorage : sessionStorage);
  this._namespace = namespace + '_';
};

Storage.prototype = {
  _namespace: '',

  get: function(key) {
    try {
      var value = this._storage.getItem(this._namespace + key);
      value = JSON.parse(value);
      return value;
    }
    catch (e) {
      return null;
    }
  },

  set: function(key, value) {
    try {
      var JSONValue = JSON.stringify(value);
      this._storage.setItem(this._namespace + key, JSONValue);
    }
    catch (e) {
    }
  },

  remove: function(key) {
    try {
      this._storage.removeItem(this._namespace + key);
    }
    catch (e) {
    }
  }
};
