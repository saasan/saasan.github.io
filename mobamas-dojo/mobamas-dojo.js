'use strict';

var Toast = function() {
};

Toast.prototype = {
  _id: null,

  show: function(message, opt_class, opt_hide) {
    var self = this;

    if ($('#alert-container').is(':hidden') || this._id === null) {
      $('#alert-text').text(message);
      var alert = $('#alert');
      alert.removeClass('alert-success alert-error alert-danger alert-info');
      if (arguments.length > 1) {
        alert.addClass(opt_class);
      }
      $('#alert-container').show();

      if (arguments.length > 2 && typeof opt_hide === 'number') {
        var self = this;
        this._id = setTimeout(function(){ $('#alert-container').hide(); self._id = null; }, opt_hide);
      }
    }
    else {
      $('#alert-container').hide();
      clearTimeout(this._id);
      this._id = setTimeout(function(){ self.show(message, opt_class, opt_hide); }, 300);
    }
  }
};

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

  init: function() {
    this._toast = new Toast();
    this._config = new Config({
        visited: {},
        hide: {},
        sameTab: false,
        autoHide: false,
        visitedMax: 1,
        infoClosed: false,
        lastTime: new Date()
    }, 'mobamas-dojo', 'config', this._dateReviver);
    this._config.load();

    var now = new Date();
    var resetTime = this.getResetTime();
    var oneDayAgo = new Date(now.getTime());
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    var moreThanOneDayAgo = this._config.lastTime < oneDayAgo;
    var resetTimePassed = this._config.lastTime < resetTime && resetTime <= now;

    if (moreThanOneDayAgo || resetTimePassed) {
      this._config.visited = {};
    }

    this._config.lastTime =  now;

    this.updateUI();

    this._config.save();
  },

  onclickDojoLink: function(element) {
    var id = element.attr('id');
    this._config.visited[id] = (this._config.visited[id] == null ? 1 : ++this._config.visited[id]);
    this._config.save();
    this.updateButtonState(id);
  },

  onclickDojoHide: function(element) {
    var id = element.data('id');
    this._config.hide[id] = true;
    this._config.save();
    this.updateButtonState(id);
  },

  onclickConfigOK: function(element) {
    this._config.sameTab = $('#sameTab').is(':checked');
    this._config.autoHide = $('#autoHide').is(':checked');
    this._config.visitedMax = $('#visitedMax').val();
    this._config.save();
    this.updateUI();
    this._toast.show('設定を保存しました。', 'alert-success', this._TOAST_TIME);
  },

  onclickConfigResetVisited: function(element) {
    this._config.visited = {};
    this._config.save();
    this.updateUI();
    this._toast.show('訪問回数を初期化しました。', 'alert-success', this._TOAST_TIME);
  },

  onclickConfigResetHide: function(element) {
    this._config.hide = {};
    this._config.save();
    this.updateUI();
    this._toast.show('道場の非表示設定を初期化しました。', 'alert-success', this._TOAST_TIME);
  },

  onclickConfigReset: function(element) {
    this._config.reset();
    this._config.save();
    this.updateUI();
    this._toast.show('全ての設定を初期化しました。', 'alert-success', this._TOAST_TIME);
  },

  onclickCloseInfo: function() {
    this._config.infoClosed = true;
    this._config.save();
    $('#info').hide();
  },

  onclickCloseAlert: function() {
    $('#alert-container').hide();
  },

  onshownConfigTab: function() {
    this.updateConfigUI();
  },

  getResetTime: function() {
    var resetTime = new Date();
    resetTime.setHours(this._RESET_HOUR);
    resetTime.setMinutes(this._RESET_MINUTE);
    resetTime.setSeconds(0);
    resetTime.setMilliseconds(0);
    return resetTime;
  },

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

    if (this._config.hide[id] || (this._config.autoHide && c >= m)) {
      $('#d' + id).hide();
    }
    else {
      $('#' + id).removeClass('btn-primary btn-success btn-warning btn-danger').addClass(classes[m][c]);
      $('#h' + id).removeClass('btn-primary btn-success btn-warning btn-danger').addClass(classes[m][c]);
      $('#d' + id).show();
    }
  },

  updateButtonStateAll: function() {
    var i, id, classes = ['btn-success', 'btn-warning', 'btn-danger'];

    for (i = 0; i < classes.length; i++) {
      $('a.' + classes[i]).removeClass(classes[i]).addClass('btn-primary');
      $('button.' + classes[i]).removeClass(classes[i]).addClass('btn-primary');
    }

    for (id in this._config.visited) {
      this.updateButtonState(id)
    }
    for (id in this._config.hide) {
      this.updateButtonState(id)
    }
  },

  updateConfigUI: function() {
    $('#sameTab').prop('checked', this._config.sameTab);
    $('#autoHide').prop('checked', this._config.autoHide);
    $('#visitedMax').val(this._config.visitedMax);
  },

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

    if (this._config.infoClosed) {
      $('#info').hide();
    }
    else {
      $('#info').show();
    }
  }
};
