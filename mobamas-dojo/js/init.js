/* jshint indent: 2, jquery: true */
/* global Toast, MobamasDojo */

$(function(){
  'use strict';

  try {
    var t = new Toast('#toast', '#toastMessage');

    var d = new MobamasDojo(t);
    $('a.dojo-link').click(function(){ d.onclickDojoLink($(this)); });
    $('button.hide-dojo').click(function(){ d.onclickHideDojo($(this)); });
    $('#configOK').click(function(){ d.onclickConfigOK($(this)); });
    $('#configResetVisited').click(function(){ d.onclickConfigResetVisited($(this)); });
    $('#configResetHide').click(function(){ d.onclickConfigResetHide($(this)); });
    $('#configReset').click(function(){ d.onclickConfigReset($(this)); });
    $('#info').bind('closed', function(){ d.onclosedInfo(); });
    $('#birthday').bind('closed', function(){ d.onclosedBirthday(); });
    $('#openConfig').click(function(){ d.onclickOpenConfig(); });
    $('#config').bind('close', function(e){ d.oncloseConfig(e); });
    $('#dataInput').submit(function(){ d.onsubmitDataInput(); return false; });
    d.init();

    $('#versionedInfo').versionedInfo();
    $('.close').closeButton();
    $('#configCancel').closeButton();

    $('#buttons').show();
    $('#dojos').show();
  }
  catch (e) {
    var message = '<h3>' + e.message + '</h3>';
    if (e.stack) {
      message += '<p>' + e.stack + '</p>';
    }
    t.show(message, 'info error');
  }
});
