/* jshint indent: 2, browser: true */
/* global createjs, IMAGE_IDS */
(function () {
  "use strict";

  // 穴
  Hole.prototype = new createjs.Container();
  function Hole() {
    createjs.Container.call(this);

    this.width = 480;
    this.height = 502;
    this.holeH = 80;

    var hole = new createjs.Shape();
    this.addChild(hole);
    hole.graphics.beginFill('black').drawEllipse(0, -this.holeH/2, this.width, this.holeH);
  }

  // 穴にもぐらを入れる
  Hole.prototype.addMole = function() {
    var mole = this.mole = new Mole();
    this.addChild(mole);
    mole.y = 0;

    // もぐら絵の下端を穴に沿って切り抜く
    mole.mask = new createjs.Shape();
    mole.mask.graphics
      .rect(0, -mole.height, mole.width, mole.height)
      .drawEllipse(0, -this.holeH/2, this.width, this.holeH);

    // もぐらを叩いた
    var hole = this;
    mole.on('click', function(e) {
      hole.poka(function() {
        setTimeout(function() {
          hole.removeMole();
          hole.nyoki();
        }, 1000);
      });
    });
  };

  // もぐらを取り除く
  Hole.prototype.removeMole = function() {
    this.removeChild(this.mole);
    delete this.mole;
  };

  // ニョキ
  Hole.prototype.nyoki = function() {
    if (this.mole) return; // すでにいたらやめる

    this.addMole();

    this.mole.y = this.mole.height;
    createjs.Tween.get(this.mole)
      .to({y: 80}, 1000, createjs.Ease.backOut);
  };

  // ポカ
  Hole.prototype.poka = function(callback) {
    if (!callback) callback = function(){};
    var s = this.mole;
    createjs.Tween.removeTweens(s);
    createjs.Tween.get(s)
      .to({scaleX: 1.2, scaleY: 0.8}, 180, createjs.Ease.sineOut)
      .to({scaleX: 0.8, scaleY: 1.1, y: s.height*1.1}, 120, createjs.Ease.sineIn)
      .to({scaleX: 1, scaleY: 1})
      .call(callback);
  };

  // もぐら
  function Mole() {
    var ids = IMAGE_IDS;
    var url = ids[Math.floor(Math.random()*ids.length)];

    var bmp = new createjs.Bitmap(url);
    bmp.width = 480;
    bmp.height = 502;

    // ピクセルを取れないので適当な当たり判定
    bmp.hitArea = new createjs.Shape();
    bmp.hitArea.graphics.beginFill('black').rect(130, 20, 250, 442);

    // まんなか下端が中心
    bmp.x = bmp.width/2;
    bmp.regX = bmp.width/2;
    bmp.regY = bmp.height;

    return bmp;
  }

  function Game(canvas) {
    var stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);

    var holes = this.holes = [];
    var positions = [
      {x: 40, y: 240},
      {x: 360, y: 240},
      {x: 200, y: 360},
      {x: 40, y: 480},
      {x: 360, y: 480},
    ];
    this.holes = positions.map(function(p) {
      var hole = new Hole();
      holes.push(hole);
      stage.addChild(hole);

      hole.x = p.x;
      hole.y = p.y;
      hole.scaleX = hole.scaleY = 0.5;

      hole.nyoki();
      return hole;
    });

    return stage;
  }

  function main() {
    var canvas = document.getElementById('canvas');
    canvas.addEventListener('selectstart', function(e) {e.preventDefault();}, false);
    var game = window.game = new Game(canvas);
    createjs.Ticker.addEventListener('tick', function() {
      game.update();
    });
  }

  main();
}());