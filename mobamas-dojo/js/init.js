/* jshint indent: 2, jquery: true */
/* global Toast, MobamasDojo */

$(function(){
  'use strict';

  try {
    var t = new Toast('#toast', '#toastMessage');
    $('#closeToast').click(function(){ t.close(); });

    var d = new MobamasDojo(t);
    $('a.dojo-link').click(function(){ d.onclickDojoLink($(this)); });
    $('button.hide-dojo').click(function(){ d.onclickHideDojo($(this)); });
    $('#configOK').click(function(){ d.onclickConfigOK($(this)); });
    $('#configResetVisited').click(function(){ d.onclickConfigResetVisited($(this)); });
    $('#configResetHide').click(function(){ d.onclickConfigResetHide($(this)); });
    $('#configReset').click(function(){ d.onclickConfigReset($(this)); });
    $('#closeInfo').click(function(){ d.onclickCloseInfo(); });
    $('#closeBirthday').click(function(){ d.onclickCloseBirthday(); });
    $('#openConfig').click(function(){ d.onclickOpenConfig(); });
    $('#closeConfig').click(function(){ d.onclickConfigCancel(); });
    $('#configCancel').click(function(){ d.onclickConfigCancel(); });
    $('#dataInput').submit(function(){ d.onsubmitDataInput(); return false; });

    d.init();

    $('.flexslider').flexslider({
      animation: "slide"
    });
  }
  catch (e) {
    var message = '<h3>' + e.message + '</h3>';
    if (e.stack) {
      message += '<p>' + e.stack + '</p>';
    }
    t.show(message, 'info error');
  }
});
