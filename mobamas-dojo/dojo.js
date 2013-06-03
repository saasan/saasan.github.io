$(function(){
  var MobamasDojo = function() {
  };

  MobamasDojo.prototype = {
    _RESET_HOUR: 5,
    _RESET_MINUTE: 0,
    _storage: null,
    _config: {},

    onclickDojoLink: function(element) {
      var id = element.attr('id');
      this._config.visited[id] = (this._config.visited[id] == null ? 1 : ++this._config.visited[id]);
      this.updateButtonState(id);
      this._storage.set('config', this._config);
    },

    onclickDojoHide: function(element) {
      var id = element.data('id');
      this._config.hide[id] = true;
      this.updateButtonState(id);
      this._storage.set('config', this._config);
    },

    onclickConfigOK: function(element) {
      this._config.sameTab = $('#sameTab').is(':checked');
      this._config.autoHide = $('#autoHide').is(':checked');
      this._config.visitedMax = $('#visitedMax').val();
      this.updateUI();
      this._storage.set('config', this._config);
      this.showAlert('設定を保存しました。', 'alert-success', 1000);
    },

    onclickConfigResetVisited: function(element) {
      this._config.visited = {};
      this.updateUI();
      this._storage.set('config', this._config);
      this.showAlert('凸回数をリセットしました。', 'alert-success', 1000);
    },

    onclickConfigResetHide: function(element) {
      this._config.hide = {};
      this.updateUI();
      this._storage.set('config', this._config);
      this.showAlert('道場の非表示設定をリセットしました。', 'alert-success', 1000);
    },

    onclickConfigReset: function(element) {
      this._config = {};
      this.resetConfig();
      this.updateUI();
      this._storage.set('config', this._config);
      this.showAlert('全ての設定をリセットしました。', 'alert-success', 1000);
    },

    onclosedInfo: function() {
      this._config.infoClosed = true;
      this._storage.set('config', this._config);
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
    },

    resetConfig: function() {
      var configDefault = {
        visited: {},
        hide: {},
        sameTab: false,
        autoHide: false,
        visitedMax: 1,
        infoClosed: false
      };
      for (var key in configDefault) {
        if (typeof this._config[key] === 'undefined') this._config[key] = configDefault[key];
      }
    },

    showAlert: function(message, opt_class, opt_hide) {
      $('#alert-text').text(message);
      var alert = $('#alert');
      alert.removeClass('alert-success alert-error alert-danger alert-info');
      if (arguments.length > 1) {
        alert.addClass(opt_class);
      }
      alert.show();
      if (arguments.length > 2 && typeof opt_hide === 'number') {
        setTimeout(function(){ $('#alert').hide(); }, opt_hide);
      }
    },

    init: function() {
      this._storage = new Storage(true, 'mobamas-dojo');
      this._config = this._storage.get('config', {});
      this.resetConfig();

      var i, id;
      var now = new Date();
      var resetTime = this.getResetTime();

      if (this._config.lastTime < resetTime && resetTime <= now) {
        this._config.visited = {};
      }

      this._config.lastTime =  now;

      this.updateUI();

      this._storage.set('config', this._config);
    }
  };

  var d = new MobamasDojo();
  d.init();

  $('a.dojo-link').click(function(){ d.onclickDojoLink($(this)); });
  $('button.dojo-hide').click(function(){ d.onclickDojoHide($(this)); });
  $('#configOK').click(function(){ d.onclickConfigOK($(this)); });
  $('#configResetVisited').click(function(){ d.onclickConfigResetVisited($(this)); });
  $('#configResetHide').click(function(){ d.onclickConfigResetHide($(this)); });
  $('#configReset').click(function(){ d.onclickConfigReset($(this)); });
  $('#info').on('closed', function(){ d.onclosedInfo(); });
  $('#configTab').on('shown', function(){ d.onshownConfigTab(); });
});
