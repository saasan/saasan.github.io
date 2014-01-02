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
          asin: '4048662112',
          img: 'http://ecx.images-amazon.com/images/I/51gOIfK249L._CR0,140,353,198_.jpg',
          caption: '2014/3/27 オリジナルアニメDVD付 限定版 ぷちます! (6)'
        },
        {
          asin: 'B00HHKO7IW',
          img: 'http://ecx.images-amazon.com/images/I/51wY4bqi6WL._CR0,30,500,281_.jpg',
          caption: '2014/5/15 アイドルマスター ワンフォーオール 765プロ 新プロデュースBOX (初回封入特典「アイドルマスター シンデレラガールズ」「アイドルマスター ミリオンライブ! 」で限定アイドルが手に入るシリアルコード 同梱)'
        },
        {
          asin: 'B00HHKO7KA',
          img: 'http://ecx.images-amazon.com/images/I/61MgxPu%2BbXL._CR0,10,500,281_.jpg',
          caption: '2014/5/15 アイドルマスター ワンフォーオール (初回封入特典「アイドルマスター シンデレラガールズ」「アイドルマスター ミリオンライブ! 」で限定アイドルが手に入るシリアルコード 同梱)'
        },
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
          caption: '2013/12/25 アイドルマスター シンデレラガールズセレクション4 22個入 BOX'
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
        },
        {
          asin: '4758064202',
          img: 'http://ecx.images-amazon.com/images/I/51Usia8VSwL._CR0,90,353,198_.jpg',
          caption: '2013/12/27 【Amazon.co.jp限定】THE IDOLM@STER (2)イラストカード付き'
        },
        {
          asin: '4048919245',
          img: 'http://ecx.images-amazon.com/images/I/61QGkhmsBuL._CR0,110,352,198_.jpg',
          caption: '2013/10/26 アイドルマスター2 The world is all one !! (4) (電撃コミックス)'
        },
        {
          asin: 'B00ESECI40',
          img: 'http://ecx.images-amazon.com/images/I/610%2BEdxKQrL._CR0,28,362,203_.jpg',
          caption: '2013/10/2 アイドルマスター 2014カレンダー'
        },
        {
          asin: 'B00DW2LIJU',
          img: 'http://ecx.images-amazon.com/images/I/61me85tolRL._CR0,163,500,281_.jpg',
          caption: '2013/11/20 THE IDOLM@STER 765PRO ALLSTARS+ GRE@TEST BEST! -COOL&BITTER!-'
        },
        {
          asin: 'B00FB1W1UA',
          img: 'http://ecx.images-amazon.com/images/I/61XNzSDvwIL._CR0,60,500,281_.jpg',
          caption: '2013/11/13 THE IDOLM@STER CINDERELLA MASTER 021 佐久間まゆ'
        },
        {
          asin: 'B00FB1W1OQ',
          img: 'http://ecx.images-amazon.com/images/I/61lWXcP49iL._CR0,85,500,281_.jpg',
          caption: '2013/11/13 THE IDOLM@STER CINDERELLA MASTER 022 白坂小梅'
        },
        {
          asin: 'B00FB1W1O6',
          img: 'http://ecx.images-amazon.com/images/I/61X7E11uJOL._CR0,50,500,281_.jpg',
          caption: '2013/11/13 THE IDOLM@STER CINDERELLA MASTER 023 緒方智絵里'
        },
        {
          asin: 'B00FB1W1UK',
          img: 'http://ecx.images-amazon.com/images/I/61QAChtmVUL._CR0,15,500,281_.jpg',
          caption: '2013/11/13 THE IDOLM@STER CINDERELLA MASTER 024 アナスタシア'
        },
        {
          asin: 'B00FB1W1TQ',
          img: 'http://ecx.images-amazon.com/images/I/61rGikCSjIL._CR0,50,500,281_.jpg',
          caption: '2013/11/13 THE IDOLM@STER CINDERELLA MASTER 025 高森藍子'
        },
        {
          asin: '4758007667',
          img: 'http://ecx.images-amazon.com/images/I/51M0EZG0NdL._CR0,70,352,198_.jpg',
          caption: '2013/8/31 アイドルマスター シンデレラガールズ コミックアンソロジー cool VOL.2 クールなドラマCD付'
        },
        {
          asin: '4758007772',
          img: 'http://ecx.images-amazon.com/images/I/51dUay4NeoL._CR0,40,344,193_.jpg',
          caption: '2013/9/30 アイドルマスター シンデレラガールズ コミックアンソロジー cute VOL.2 キュートなドラマCD付'
        },
        {
          asin: '4758007780',
          img: 'http://ecx.images-amazon.com/images/I/61NbWZWKnGL._CR0,40,353,198_.jpg',
          caption: '2013/10/31 アイドルマスター シンデレラガールズ コミックアンソロジー passion VOL.2 パッションなドラマCD付'
        },
        {
          asin: 'B00DAP3R3Y',
          img: 'http://ecx.images-amazon.com/images/I/61AoUO6aI2L._SX640_CR0,60,640,360_.jpg',
          caption: '2013/10/29 アイドルマスター シンデレラガールズ ねんどろいどぷち アイドルマスター シンデレラガールズ ステージ02'
        },
        {
          asin: 'B00DW2LIM2',
          img: 'http://ecx.images-amazon.com/images/I/61gWKkSU1NL._CR0,161,500,281_.jpg',
          caption: '2013/12/18 THE IDOLM@STER 765PRO ALLSTARS+GRE@TEST BEST! -LOVE&PEACE! -'
        }
      ];

    var n = Math.floor(Math.random() * data.length);
    var html = '<a href="http://www.amazon.co.jp/exec/obidos/ASIN/' +
        data[n].asin + '/' + id +
        '/" target="_blank"><img src="' + data[n].img +
        '" id="adimg"><span class="caption">' + data[n].caption + '</span></a>';

    var ad = $('#ad');
    ad.html(html);
    $('#adimg').bind('load', function(){
      ad.show();
    });
  }

  try {
    var t = new Toast('#toast', '#toastMessage');

    updateAd();

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
