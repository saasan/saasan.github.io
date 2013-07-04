'use strict';

$(function(){
  try {
    var d = new MobamasDojo();

    $('a.dojo-link').click(function(){ d.onclickDojoLink($(this)); });
    $('button.dojo-hide').click(function(){ d.onclickDojoHide($(this)); });
    $('#configOK').click(function(){ d.onclickConfigOK($(this)); });
    $('#configResetVisited').click(function(){ d.onclickConfigResetVisited($(this)); });
    $('#configResetHide').click(function(){ d.onclickConfigResetHide($(this)); });
    $('#configReset').click(function(){ d.onclickConfigReset($(this)); });
    $('#closeInfo').click(function(){ d.onclickCloseInfo(); });
    $('#closeAlert').click(function(){ d.onclickCloseAlert(); });
    $('#configTab').on('shown', function(){ d.onshownConfigTab(); });

    d.init();
  }
  catch (e) {
    $('#alert-text').text(e.message);
    $('#alert').removeClass('alert-success alert-danger alert-info').addClass('alert-error');
    $('#alert-container').show();
  }
});
