/* jshint indent: 2, jquery: true */
/* global Config */

(function($){
  'use strict';

  /**
   * バージョン付き情報
   * @constructor
   */
  var VersionedInfo = function(element) {
    this._element = element;
    this._config = new Config(
      {
        version: -1
      },
      'VersionedInfo'
    );
    this._config.load();

    if (this._enable()) {
      var self = this;
      element.bind('closed', function() {
        self._closed();
      });
    }
    else {
      element.hide();
    }
  };

  VersionedInfo.prototype = {
    _config: null,
    _element: null,

    _getVersion: function() {
      var version = this._element.data('version');
      return (typeof version === 'undefined' ? -1 : parseInt(version, 10));
    },

    _enable: function() {
      var version = this._getVersion();
      if (version < 0) return true;
      return (version !== this._config.version);
    },

    _closed: function() {
      var version = this._getVersion();
      if (version < 0) return;
      this._config.version = version;
      this._config.save();
    }
  };

  $.fn.versionedInfo = function() {
    return this.each(function() {
      new VersionedInfo($(this));
    });
  };
})(jQuery);
