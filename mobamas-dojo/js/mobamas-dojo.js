/* jshint indent: 2, jquery: true */
/* global Toast, Config, Birthday */

var MobamasDojo;

(function(){
  'use strict';

  /**
   * モバマス道場
   * @param {Toast} toast メッセージ出力用のトーストクラス
   * @constructor
   */
  MobamasDojo = function(toast) {
    this._toast = toast;
  };

  MobamasDojo.prototype = {
    _RESET_HOUR: 5,
    _RESET_MINUTE: 0,
    _TOAST_TIME: 3000,
    _toast: null,
    _config: null,

    _dateReviver: function(key, value) {
      var a;
      if (key === 'lastTime' && typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
          return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        }
      }
      return value;
    },

    /**
     * 初期化
     */
    init: function() {
      var now = new Date();

      this._config = new Config(
        {
          visited: {},
          hide: {},
          sameTab: false,
          visitedMax: 1,
          autoHide: true,
          keepLastVisited: true,
          lastVisited: null,
          hideBirthday: false,
          infoClosed: false,
          lastTime: now
        },
        'mobamas-dojo',
        'config',
        this._dateReviver
      );
      this._config.load();

      if (this.needReset()) {
        this.resetVisited();
      }

      this._config.lastTime =  now;

      this.updateUI();

      this._config.save();
    },

    /**
     * 道場のリンク
     */
    onclickDojoLink: function(element) {
      var id = element.attr('id');
      var lastVisited = this._config.lastVisited;

      if (typeof this._config.visited[id] === 'undefined') {
        this._config.visited[id] = 1;
      }
      else {
        this._config.visited[id]++;
      }
      this._config.lastVisited = id;

      if (this._config.keepLastVisited && lastVisited !== null && lastVisited !== id) {
        this.updateButtonState(lastVisited);
      }

      this._config.save();
      this.updateButtonState(id);
    },

    /**
     * 道場の非表示ボタン
     */
    onclickHideDojo: function(element) {
      var id = element.data('id');
      this._config.hide[id] = true;
      this._config.save();
      this.updateButtonState(id);
    },

    /**
     * 設定を保存
     */
    onclickConfigOK: function(element) {
      this._config.sameTab = $('#sameTab').is(':checked');
      this._config.visitedMax = $('#visitedMax').val();
      this._config.autoHide = $('#autoHide').is(':checked');
      this._config.keepLastVisited = $('#keepLastVisited').is(':checked');
      this._config.hideBirthday = $('#hideBirthday').is(':checked');
      this._config.save();
      this.updateUI();
      this.closeConfig();
      this._toast.show('設定を保存しました。', 'info success', this._TOAST_TIME);
    },

    /**
     * 訪問回数を初期化
     */
    onclickConfigResetVisited: function(element) {
      this.resetVisited();

      this._config.save();
      this.updateUI();
      this._toast.show('訪問回数を初期化しました。', 'info success', this._TOAST_TIME);
    },

    /**
     * 道場の非表示設定を初期化
     */
    onclickConfigResetHide: function(element) {
      this._config.hide = {};
      this._config.save();
      this.updateUI();
      this._toast.show('道場の非表示設定を初期化しました。', 'info success', this._TOAST_TIME);
    },

    /**
     * 全ての設定を初期化
     */
    onclickConfigReset: function(element) {
      this._config.reset();
      this._config.save();
      this.updateUI();
      this.closeConfig();
      this._toast.show('全ての設定を初期化しました。', 'info success', this._TOAST_TIME);
    },

    /**
     * キャンセル
     */
    oncloseConfig: function(e) {
      this.closeConfig();
      e.preventDefault();
    },

    /**
     * インフォメーションの×ボタン
     */
    onclosedInfo: function() {
      this._config.infoClosed = true;
      this._config.save();
    },

    /**
     * 誕生日の×ボタン
     */
    onclosedBirthday: function() {
      this._config.hideBirthday = true;
      this._config.save();
    },

    /**
     * 設定
     */
    onclickOpenConfig: function() {
      this.updateConfigUI();
      $('#config').show();
    },

    /**
     * データ入力
     */
    onsubmitDataInput: function() {
      var data = $('#dataOutput').val();

      if (data.length === 0) {
        this._toast.show('データが入力されていません。', 'info success', this._TOAST_TIME);
        return;
      }

      // JSONの前後に不要な文字列があれば削除
      var f = data.indexOf('{');
      var l = data.lastIndexOf('}');
      if (f >= 0 && l >= 0) {
        data = data.substring(f, l + 1);
      }

      try {
        this._config.setRawData(data);
      }
      catch (e) {
        this._toast.show(e.message, 'info error');
        return;
      }
      this._config.load();
      this.updateUI();
      this.closeConfig();
      this._toast.show('データを入力しました。', 'info success', this._TOAST_TIME);
    },

    /**
     * 設定画面を閉じる
     */
    closeConfig: function() {
      // 「設定」ボタンが表示されていない場合は、設定画面が常時表示状態なので閉じない
      if ($('#openConfig').is(':visible')) {
        // $('#config').hide();だと、閉じた後ブラウザーの幅を広げても再表示されない
        $('#config').css('display', '');
      }
      else {
        this.updateConfigUI();
      }
    },

    /**
     * 今日のリセット時間を取得する
     * @return {date} リセット時間
     */
    getResetTime: function() {
      var resetTime = new Date();
      resetTime.setHours(this._RESET_HOUR);
      resetTime.setMinutes(this._RESET_MINUTE);
      resetTime.setSeconds(0);
      resetTime.setMilliseconds(0);

      // 未来だったら1日前にする
      if (resetTime > Date.now()) {
        resetTime.setDate(resetTime.getDate() - 1);
      }

      return resetTime;
    },

    /**
     * 訪問回数のリセットが必要か確認する
     * @return {boolean} 必要性の有無
     */
    needReset: function() {
      var resetTime = this.getResetTime();

      return (this._config.lastTime < resetTime && resetTime <= Date.now());
    },

    /**
     * 訪問回数をリセットする
     */
    resetVisited: function() {
      this._config.visited = {};
      this._config.lastVisited = null;
    },

    /**
     * 道場ボタンの状態を更新する
     * @param {string} id ボタンのid
     */
    updateButtonState: function(id) {
      var m = this._config.visitedMax;
      var c = this._config.visited[id];
      var classes = {
        1: ['', 'error'],
        3: ['', 'success', 'warning', 'error']
      };

      if (c > m) {
        c = m;
      }

      var autoHide = this._config.autoHide && c >= m;
      var keep = this._config.autoHide && this._config.keepLastVisited && this._config.lastVisited === id;
      if (this._config.hide[id] || (autoHide && !keep)) {
        $('#d' + id).hide();
      }
      else {
        $('#d' + id).removeClass('success warning error').addClass(classes[m][c]);
        $('#d' + id).show();
      }
    },

    /**
     * 全ての道場ボタンの状態を更新する
     */
    updateButtonStateAll: function() {
      $('#dojos div.dojo').removeClass('success warning error');

      var id;

      for (id in this._config.visited) {
        this.updateButtonState(id);
      }
      for (id in this._config.hide) {
        this.updateButtonState(id);
      }
    },

    /**
     * 設定のUIを更新する
     */
    updateConfigUI: function() {
      $('#sameTab').prop('checked', this._config.sameTab);
      $('#visitedMax').val(this._config.visitedMax);
      $('#autoHide').prop('checked', this._config.autoHide);
      $('#keepLastVisited').prop('checked', this._config.keepLastVisited);
      $('#hideBirthday').prop('checked', this._config.hideBirthday);

      $('#dataOutput').val(this._config.getRawData());
    },

    /**
     * 全てのUIを更新する
     */
    updateUI: function() {
      $('div.dojo').show();
      this.updateButtonStateAll();

      if (this._config.sameTab) {
        $('#dojos a[target].dojo-link').removeAttr('target');
      }
      else {
        $('#dojos a:not([target]).dojo-link').attr('target', '_blank');
      }

      this.updateConfigUI();
      if (!this._config.hideBirthday) {
        this.updateBirthday();
      }

      $('#info').css('display', this._config.infoClosed ? 'none' : 'block');
      $('#birthday').css('display', this._config.hideBirthday ? 'none' : 'block');
    },

    /**
     * 誕生日を更新する
     */
    updateBirthday: function() {
      var birthday = new Birthday();

      var today = birthday.getToday();
      if (today === null) {
        $('#birthdayToday').html('本日誕生日のアイドルはいません');
      }
      else {
        $('#birthdayToday').html('<a href="http://sp.pf.mbga.jp/12008305/?guid=ON&url=http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbirthday" target="_blank">本日誕生日のアイドル：' + today + '</a>');
      }

      $('#birthdayNext').html('次の誕生日は' + birthday.getNext());
    }
  };
})();
