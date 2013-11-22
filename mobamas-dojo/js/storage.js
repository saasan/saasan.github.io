/* jshint indent: 2 */
/* global localStorage, sessionStorage */

var S2Storage;

(function(){
  'use strict';

  /**
   * ストレージクラス
   * @param {boolean} [opt_type] true: localStorage
   *                             false: sessionStorage
   * @param {string} [opt_namespace] 名前空間
   * @constructor
   */
  S2Storage = function(opt_type, opt_namespace) {
    if (typeof localStorage === 'undefined') {
      throw new Error('Web Storage is not available');
    }

    if (arguments.length === 0) opt_type = true;
    if (arguments.length < 2 || typeof opt_namespace !== 'string') opt_namespace = '';

    this._storage = (opt_type ? localStorage : sessionStorage);
    this._namespace = opt_namespace + '_';
  };

  S2Storage.prototype = {
    _namespace: '',

    /**
     * ストレージから値を取得する
     * @param {string} key 値を取得するキー名
     * @param {object} [opt_defaultValue] デフォルト値
     * @param {function} [opt_reviver] 値の特殊な変換を行う関数
     * @return {object} 値
     */
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

    /**
     * ストレージへ値を保存する
     * @param {string} key 値を保存するキー名
     * @param {object} value 値
     */
    set: function(key, value) {
      var JSONValue = JSON.stringify(value);
      this._storage.setItem(this._namespace + key, JSONValue);
    },

    /**
     * ストレージから値を削除する
     * @param {string} key 値を削除するキー名
     */
    remove: function(key) {
      this._storage.removeItem(this._namespace + key);
    },

    /**
     * ストレージから生データを取得する
     * getではJSON.parseを使用してJSONから元の型へ戻されるが、
     * getRawDataではJSONのまま取得する
     * @param {string} key 生データを取得するキー名
     * @return {string} 生データ
     */
    getRawData: function(key) {
      return this._storage.getItem(this._namespace + key);
    },

    /**
     * ストレージへ生データを保存する
     * @param {string} key 生データを保存するキー名
     * @param {object} value 生データ
     */
    setRawData: function(key, value) {
      JSON.parse(value);
      this._storage.setItem(this._namespace + key, value);
    }
  };
})();
