/* jshint indent: 2, jquery: true */
/* global setTimeout, clearTimeout */

var Toast;

(function(){
  'use strict';

  /**
   * トーストクラス
   * @param {string} toastId トーストとして使用するHTML要素のid
   * @param {string} messageId トーストのメッセージとして使用するHTML要素のid
   * @constructor
   */
  Toast = function(toastId, messageId) {
    this._toastElement = $(toastId);
    this._messageElement = $(messageId);
  };

  Toast.prototype = {
    _toastElement: null,
    _messageElement: null,
    _timerId: null,

    /**
     * トーストを表示する
     * @param {string} message 表示するメッセージ
     * @param {string} [opt_class] トーストで使用するHTMLのクラス
     * @param {number} [opt_hide] 指定された時間が経過したら自動で閉じる
     *                            単位はミリ秒
     *                            指定がなければ自動で閉じない
     */
    show: function(message, opt_class, opt_hide) {
      var self = this;

      if (this._toastElement.is(':hidden') || this._timerId === null) {
        this._messageElement.html(message);
        this._toastElement.removeAttr('class');
        if (arguments.length > 1) {
          this._toastElement.addClass(opt_class);
        }
        this._toastElement.show();

        if (arguments.length > 2 && typeof opt_hide === 'number') {
          this._timerId = setTimeout(function(){ self._toastElement.hide(); self._timerId = null; }, opt_hide);
        }
      }
      else {
        this._toastElement.hide();
        clearTimeout(this._timerId);
        this._timerId = setTimeout(function(){ self.show(message, opt_class, opt_hide); }, 300);
      }
    },

    /**
     * トーストを閉じる
     */
    close: function() {
      this._toastElement.hide();
    }
  };
})();
