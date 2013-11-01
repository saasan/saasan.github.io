/* jshint indent: 2, globalstrict: true, jquery: true */
/* global setTimeout, clearTimeout, Storage, Config, Birthday */
'use strict';

/**
 * トースト
 * @constructor
 */
var Toast = function() {
};

Toast.prototype = {
  _id: null,

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

    if ($('#alertContainer').is(':hidden') || this._id === null) {
      $('#alertText').text(message);
      var alert = $('#alert');
      alert.removeClass('alert-success alert-error alert-danger alert-info');
      if (arguments.length > 1) {
        alert.addClass(opt_class);
      }
      $('#alertContainer').show();

      if (arguments.length > 2 && typeof opt_hide === 'number') {
        this._id = setTimeout(function(){ $('#alertContainer').hide(); self._id = null; }, opt_hide);
      }
    }
    else {
      $('#alertContainer').hide();
      clearTimeout(this._id);
      this._id = setTimeout(function(){ self.show(message, opt_class, opt_hide); }, 300);
    }
  }
};

/**
 * モバマス道場
 * @constructor
 */
var MobamasDojo = function() {
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

    this._toast = new Toast();
    this._config = new Config(
      {
        visited: {},
        hide: {},
        sameTab: false,
        visitedMax: 1,
        autoHide: false,
        keepLastVisited: false,
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

    this.updateAssociate();
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
    $('#sectionConfig').hide();
    this._toast.show('設定を保存しました。', 'alert-success', this._TOAST_TIME);
  },

  /**
   * 訪問回数を初期化
   */
  onclickConfigResetVisited: function(element) {
    this.resetVisited();

    this._config.save();
    this.updateUI();
    this._toast.show('訪問回数を初期化しました。', 'alert-success', this._TOAST_TIME);
  },

  /**
   * 道場の非表示設定を初期化
   */
  onclickConfigResetHide: function(element) {
    this._config.hide = {};
    this._config.save();
    this.updateUI();
    this._toast.show('道場の非表示設定を初期化しました。', 'alert-success', this._TOAST_TIME);
  },

  /**
   * 全ての設定を初期化
   */
  onclickConfigReset: function(element) {
    this._config.reset();
    this._config.save();
    this.updateUI();
    this._toast.show('全ての設定を初期化しました。', 'alert-success', this._TOAST_TIME);
  },

  /**
   * インフォメーションの×ボタン
   */
  onclickCloseInfo: function() {
    this._config.infoClosed = true;
    this._config.save();
    $('#info').hide();
  },

  /**
   * 誕生日の×ボタン
   */
  onclickCloseBirthday: function() {
    this._config.hideBirthday = true;
    this._config.save();
    $('#birthday').hide();
  },

  /**
   * アラートの×ボタン
   */
  onclickCloseAlert: function() {
    $('#alertContainer').hide();
  },

  /**
   * 設定
   */
  onclickOpenConfig: function() {
    this.updateConfigUI();
    $('#sectionConfig').show();
  },

  /**
   * データ入力
   */
  onsubmitDataInput: function() {
    var data = $('#dataOutput').val();

    if (data.length === 0) {
      this._toast.show('データが入力されていません。', 'alert-success', this._TOAST_TIME);
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
      this._toast.show(e.message, 'alert-error');
      return;
    }
    this._config.load();
    this.updateUI();
    $('#sectionConfig').hide();
    this._toast.show('データを入力しました。', 'alert-success', this._TOAST_TIME);
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
    return resetTime;
  },

  /**
   * 訪問回数のリセットが必要か確認する
   * @return {boolean} 必要性の有無
   */
  needReset: function() {
    var now = new Date();
    var resetTime = this.getResetTime();
    var oneDayAgo = new Date(now.getTime());
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    var moreThanOneDayAgo = this._config.lastTime < oneDayAgo;
    var resetTimePassed = this._config.lastTime < resetTime && resetTime <= now;

    return (moreThanOneDayAgo || resetTimePassed);
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
      1: ['btn-primary', 'btn-danger'],
      3: ['btn-primary', 'btn-success', 'btn-warning', 'btn-danger']
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
      $('#' + id).removeClass('btn-primary btn-success btn-warning btn-danger').addClass(classes[m][c]);
      $('#h' + id).removeClass('btn-primary btn-success btn-warning btn-danger').addClass(classes[m][c]);
      $('#d' + id).show();
    }
  },

  /**
   * 全ての道場ボタンの状態を更新する
   */
  updateButtonStateAll: function() {
    var i, id, classes = ['btn-success', 'btn-warning', 'btn-danger'];

    for (i = 0; i < classes.length; i++) {
      $('a.' + classes[i]).removeClass(classes[i]).addClass('btn-primary');
      $('button.' + classes[i]).removeClass(classes[i]).addClass('btn-primary');
    }

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
      $('a[target].dojo-link').removeAttr('target');
    }
    else {
      $('a:not([target]).dojo-link').attr('target', '_blank');
    }

    this.updateConfigUI();
    this.updateBirthday();

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
  },

  /**
   * Amazonアソシエイトを更新する
   */
  updateAssociate: function() {
    var id = 'saasan-22';
    var data =
      [
        { asin: 'B00G3XXJEC', img: 'http://ecx.images-amazon.com/images/I/61%2B1Ba5DB2L._SX318_CR0,50,318,98_.jpg' },
        { asin: 'B00FDE78HG', img: 'http://ecx.images-amazon.com/images/I/61AaaBB1zeL._SX318_CR0,50,318,98_.jpg' },
        { asin: '4758007780', img: 'http://ecx.images-amazon.com/images/I/61NbWZWKnGL._SX318_CR0,120,318,98_.jpg' },
        { asin: 'B00DW2LIJU', img: 'http://ecx.images-amazon.com/images/I/61me85tolRL._SX318_CR0,120,318,98_.jpg' },
        { asin: 'B00FB1W1UK', img: 'http://ecx.images-amazon.com/images/I/61QAChtmVUL._SX318_CR0,10,318,98_.jpg' },
        { asin: 'B00FB1W1OQ', img: 'http://ecx.images-amazon.com/images/I/61lWXcP49iL._SX318_CR0,55,318,98_.jpg' },
        { asin: 'B00FB1W1TQ', img: 'http://ecx.images-amazon.com/images/I/61rGikCSjIL._SX318_CR0,30,318,98_.jpg' },
        { asin: 'B00FB1W1UA', img: 'http://ecx.images-amazon.com/images/I/61XNzSDvwIL._SX318_CR0,40,318,98_.jpg' },
        { asin: 'B00FB1W1O6', img: 'http://ecx.images-amazon.com/images/I/61X7E11uJOL._SX318_CR0,30,318,98_.jpg' },
        { asin: 'B00DAP3R3Y', img: 'http://ecx.images-amazon.com/images/I/61AoUO6aI2L._SX350_CR25,20,318,98_.jpg' },
        { asin: 'B00DAP3R3Y', img: 'http://ecx.images-amazon.com/images/I/61AoUO6aI2L._SX318_CR0,120,318,98_.jpg' },
        { asin: 'B00FPGY5CI', img: 'http://ecx.images-amazon.com/images/I/814qJ9fFRnL._SX330_CR5,0,318,98_.jpg' },
        { asin: 'B00FPGY5CI', img: 'http://ecx.images-amazon.com/images/I/814qJ9fFRnL._SX318_CR0,86,318,98_.jpg' },
        { asin: 'B00ESECI40', img: 'http://ecx.images-amazon.com/images/I/610%2BEdxKQrL._PU35_CR80,130,318,98_.jpg' },
        { asin: 'B00E59NQ8U', img: 'http://ecx.images-amazon.com/images/I/61MZCw0Lw%2BL._SX450_CR80,30,318,98_.jpg' },
        { asin: 'B00DGIQD40', img: 'http://ecx.images-amazon.com/images/I/51ZwOLjBRHL._PU90_CR19,22,451,139_SX318_.jpg' }
      ];
    
    var n = Math.floor(Math.random() * data.length);
    var html = '<a href="http://www.amazon.co.jp/exec/obidos/ASIN/' +
        data[n].asin + '/' + id +
        '/" target="_blank"><img src="' + data[n].img +
        '" width="318" height="98"></a>';

    $('#associate').html(html);
  }
};
