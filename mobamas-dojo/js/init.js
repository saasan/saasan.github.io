/* jshint indent: 2, jquery: true */
/* global Toast, MobamasDojo */

$(function(){
  'use strict';

  /**
   * 広告を更新する
   */
  function updateAd() {
    var id = 'saasan-22';
    var data =
      [
        {
          asin: 'B00FPGY5CI',
          img: 'http://ecx.images-amazon.com/images/I/814qJ9fFRnL._SX640_CR0,0,640,360_.jpg',
          caption: '2014/1/25 カラコレ アイドルマスター シンデレラガールズ BOX'
        },
        {
          asin: 'B00FDE78HG',
          img: 'http://ecx.images-amazon.com/images/I/61AaaBB1zeL._SX800_CR50,60,640,360_.jpg',
          caption: '2014/4/30 アイドルマスター シンデレラガールズ 島村卯月 ニュージェネレーションVer. (1/8スケール PVC塗装済み完成品)'
        },
        {
          asin: 'B00G3XXJEC',
          img: 'http://ecx.images-amazon.com/images/I/61%2B1Ba5DB2L._SX640_CR0,60,640,360_.jpg',
          caption: '2014/4/30 アイドルマスター 水瀬伊織 (1/8スケール PVC製塗装済み完成品)'
        },
        {
          asin: 'B00E59NQ8U',
          img: 'http://ecx.images-amazon.com/images/I/61MZCw0Lw%2BL._SX800_CR70,50,640,360_.jpg',
          caption: '2014/1/31 アイドルマスター シンデレラガールズ 渋谷凛 ニュージェネレーションVer. (1/8スケール PVC製塗装済み完成品)'
        },
        {
          asin: 'B00F917ESG',
          img: 'http://ecx.images-amazon.com/images/I/91XgpaVZ78L._PU90_SY420_CR170,30,640,360.jpg',
          caption: '2013/12/25 (仮) アイドルマスター シンデレラガールズ セレクション4 22個入 BOX'
        },
        {
          asin: '4757541457',
          img: 'http://ecx.images-amazon.com/images/I/51Ofl7j0xdL._CR0,80,352,198_.jpg',
          caption: '2013/11/25 アイドルマスター シンデレラガールズ ニュージェネレーションズ (2)(完)'
        },
        {
          asin: '4757541449',
          img: 'http://ecx.images-amazon.com/images/I/61vGViOoHgL._CR0,160,352,198_.jpg',
          caption: '2013/11/25 アイドルマスター シンデレラガールズ あんさんぶる! (1)'
        },
        {
          asin: 'B00DNNC0QI',
          img: 'http://ecx.images-amazon.com/images/I/51PkUa5cqOL._CR0,40,500,281_.jpg',
          caption: '2013/12/31 アイドルマスター シンデレラガールズ ミニッチュ アイドルマスターシンデレラガールズ 02'
        },
        {
          asin: '4757541465',
          img: 'http://ecx.images-amazon.com/images/I/51M45NuemBL._CR0,140,353,198_.jpg',
          caption: '2013/11/25 アイドルマスター シンデレラガールズ 本日のアイドルさん'
        }
      ];

    var n = Math.floor(Math.random() * data.length);
    var html = '<a href="http://www.amazon.co.jp/exec/obidos/ASIN/' +
        data[n].asin + '/' + id +
        '/" target="_blank"><img src="' + data[n].img +
        '"><span class="caption">' + data[n].caption + '</span></a>';

    $('#ad').html(html).show();
  }

  try {
    var t = new Toast('#toast', '#toastMessage');
    $('#closeToast').click(function(){ t.close(); });

    updateAd();

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
