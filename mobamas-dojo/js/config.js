/* jshint indent: 2, globalstrict: true */
/* global Storage */
'use strict';

/**
 * 設定クラス
 * @param {object} [opt_defaultValues] 設定のデフォルト値
 * @param {string} [opt_storageNamespace] Storageの名前空間
 * @param {string} [opt_storageKey] Storageのキー
 * @param {function} [opt_reviver] 設定値の特殊な変換を行う関数
 * @constructor
 */
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

  /**
   * Storageのキー
   * @type {string}
   */
  storageKey: 'config',

  /**
   * 全ての設定を消去する
   */
  clear: function() {
    for (var i in this) {
      if (!this._initialKeys[i]) delete this[i];
    }
  },

  /**
   * 全ての設定を消去し、デフォルト値にする
   */
  reset: function() {
    this.clear();
    this._importValues(this._defaultValues);
  },

  /**
   * 設定を保存する
   */
  save: function() {
    var newValues = {};
    this._copyConfigValues(this, newValues);
    this._storage.set(this.storageKey, newValues);
  },

  /**
   * 設定を読み込む
   * @param {boolean} [opt_clear] true: 設定を初期化する
   *                              false: 設定を初期化しない
   */
  load: function(opt_clear) {
    var newValues = this._storage.get(this.storageKey, {}, this._reviver);
    if (opt_clear) this.clear();
    this._importValues(newValues);
  },

  /**
   * 生データを取得する
   * @return {string} 設定のJSON文字列
   */
  getRawData: function() {
    return this._storage.getRawData(this.storageKey);
  },

  /**
   * 生データを保存する
   * @param {string} value 設定のJSON文字列
   */
  setRawData: function(value) {
    this._storage.setRawData(this.storageKey, value);
  }
};
