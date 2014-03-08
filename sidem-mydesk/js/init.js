/* jshint indent: 2, browser: true */
/* global SideMMyDeskUI */

(function(){
  'use strict';

  var onLoad = function() {
    var ui = new SideMMyDeskUI();
    ui.onLoad();
  };

  window.addEventListener('load', onLoad, false);
})();
