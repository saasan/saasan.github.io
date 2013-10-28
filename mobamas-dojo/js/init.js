/* jshint indent: 2, globalstrict: true, jquery: true */
/* global MobamasDojo */
'use strict';

$(function(){
  try {
    var d = new MobamasDojo();

    $('a.dojo-link').click(function(){ d.onclickDojoLink($(this)); });
    $('button.hide-dojo').click(function(){ d.onclickHideDojo($(this)); });
    $('#configOK').click(function(){ d.onclickConfigOK($(this)); });
    $('#configResetVisited').click(function(){ d.onclickConfigResetVisited($(this)); });
    $('#configResetHide').click(function(){ d.onclickConfigResetHide($(this)); });
    $('#configReset').click(function(){ d.onclickConfigReset($(this)); });
    $('#closeInfo').click(function(){ d.onclickCloseInfo(); });
    $('#closeAlert').click(function(){ d.onclickCloseAlert(); });
    $('#openConfig').click(function(){ d.onclickOpenConfig(); });
    $('#closeConfig').click(function(){ $('#sectionConfig').hide(); });
    $('#configCancel').click(function(){ $('#sectionConfig').hide(); });
    $('#dataInput').submit(function(){ d.onsubmitDataInput(); return false; });

    d.init();
  }
  catch (e) {
    $('#alertText').text(e.message);
    $('#alert').removeClass('alert-success alert-danger alert-info').addClass('alert-error');
    $('#alertContainer').show();
  }
});
