'use strict';

var Config = function(opt_defaultValues, opt_storageNamespace, opt_storageKey, opt_reviver) {
  for (var i in this) {
    this._initialKeys[i] = true;
  }

  if (arguments.length >= 1) {
    this._defaultValues = this._cloneObject(opt_defaultValues);
    this._importValues(opt_defaultValues);
  }

  this._storage = new Storage(true, opt_storageNamespace);

  if (arguments.length >= 3) {
    this.storageKey = opt_storageKey;
  }

  if (arguments.length >= 4) {
    this._reviver = opt_reviver;
  }
};

Config.prototype = {
  _storage: null,
  _reviver: null,
  _initialKeys: {},
  _defaultValues: {},

  _copyConfigValues: function(sourceObject, destObject) {
    for (var i in sourceObject) {
      if (typeof this._initialKeys[i] !== 'undefined') continue;

      if (sourceObject[i] instanceof Date) {
        destObject[i] = new Date();
        destObject[i].setTime(sourceObject[i].getTime());
      }
      else if (sourceObject[i] instanceof Array) {
        destObject[i] = [];
        for (var j = 0; j < sourceObject[i].length; j++) {
          destObject[i][j] = this._cloneObject(sourceObject[i][j]);
        }
      }
      else if (sourceObject[i] && typeof sourceObject[i] === 'object') {
        destObject[i] = this._cloneObject(sourceObject[i]);
      }
      else {
        destObject[i] = sourceObject[i];
      }
    }
  },

  _importValues: function(sourceObject) {
    for (var i in this._initialKeys) {
      if (typeof sourceObject[i] !== 'undefined') throw new Error('The key name already exists : ' + i);
    }

    this._copyConfigValues(sourceObject, this);
  },

  _cloneObject: function(sourceObject) {
    var newObject = {};

    for (var i in sourceObject) {
      if (sourceObject[i] instanceof Date) {
          newObject[i] = new Date();
          newObject[i].setTime(sourceObject[i].getTime());
      }
      else if (sourceObject[i] instanceof Array) {
        newObject[i] = [];
        for (var j = 0; j < sourceObject[i].length; j++) {
          newObject[i][j] = this._cloneObject(sourceObject[i][j]);
        }
      }
      else if (sourceObject[i] && typeof sourceObject[i] === 'object') {
        newObject[i] = this._cloneObject(sourceObject[i]);
      }
      else {
        newObject[i] = sourceObject[i];
      }
    }

    return newObject;
  },

  storageKey: 'config',

  clear: function() {
    for (var i in this) {
      if (!this._initialKeys[i]) delete this[i];
    }
  },

  reset: function() {
    this.clear();
    this._importValues(this._defaultValues);
  },

  save: function() {
    var newValues = {};
    this._copyConfigValues(this, newValues);
    this._storage.set(this.storageKey, newValues);
  },

  load: function(opt_clear) {
    var newValues = this._storage.get(this.storageKey, {}, this._reviver);
    if (opt_clear) this.clear();
    this._importValues(newValues);
  }
};
