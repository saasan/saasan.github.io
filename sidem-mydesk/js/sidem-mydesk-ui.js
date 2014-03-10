/* jshint indent: 2, browser: true */
/* global SideMMyDesk */
var SideMMyDeskUI;

(function(){
  'use strict';

  /**
   * SideMマイデスク風ジェネレータのUI
   * @constructor
   */
  SideMMyDeskUI = function() {
  };

  SideMMyDeskUI.prototype = {
    /** SideMMyDesk */
    sidem: null,
    /** ドラッグ中か */
    dragging: null,
    /** 以前のカーソルX座標 */
    prevX: 0,
    /** 以前のカーソルY座標 */
    prevY: 0,

    /**
     * D&Dのデフォルトの動作をキャンセルする
     */
    _doNothing: function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    },

    /**
     * 画像を取得する
     */
    _getImage: function(dt, image) {
      // 選択されたファイルを取得
      var file = dt.files[0];

      if (typeof file !== 'undefined') {
        // 画像ファイル以外は処理中止
        if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;

        var reader = new FileReader();

        // ファイルの読み込みが完了したら設定する
        reader.addEventListener('load', function(evt) {
          image.src = evt.target.result;
        }, false);

        // ファイルを読み込む
        reader.readAsDataURL(file);
      }
    },

    /**
     * ドロップ時の処理を行う
     */
    _onDrop: function() {
      var self = this;
      return (function(evt) {
        self._doNothing(evt);

        // ドロップされた座標を調べる
        var pos = self._getCursorPositionInCanvas(evt);
        // ドロップされた場所のコマを得る
        var frame = self.sidem.isPointInFrame(pos.x, pos.y);

        // ドロップされた場所がコマ外なら終了
        if (frame === null) return;

        var dt = evt.dataTransfer;
        var image = new Image();

        // 画像の読み込みが完了したら設定する
        image.addEventListener('load', function() {
          self.sidem.setImage(frame, image);
        }, false);

        // 画像を取得する
        self._getImage(dt, image);
      });
    },

    /**
     * MouseDown
     */
    _onMouseDown: function() {
      var self = this;
      return (function(evt) {
        var pos = self._getCursorPositionInCanvas(evt);
        var frame = self.sidem.isPointInFrame(pos.x, pos.y);

        // コマ外なら終了
        if (frame === null) return;

        var draggable = self.sidem.isDraggableFrame(frame);

        if (draggable) {
          self.prevX = pos.x;
          self.prevY = pos.y;
          self.dragging = frame;
        }
      });
    },

    /**
     * MouseUp
     */
    _onMouseUp: function() {
      var self = this;
      return (function() {
        self.dragging = null;
      });
    },

    /**
     * MouseMove
     */
    _onMouseMove: function() {
      var self = this;
      return (function(evt) {
        var pos = self._getCursorPositionInCanvas(evt);

        if (self.dragging === null) {
          // マウスカーソルの位置によってカーソルの形状を変更
          var draggable = self.sidem.isDraggablePosition(pos.x, pos.y);
          this.style.cursor = (draggable ? 'move' : 'auto');
        }
        else {
          var deltaX = pos.x - self.prevX;
          var deltaY = pos.y - self.prevY;
          self.prevX = pos.x;
          self.prevY = pos.y;
          self.sidem.moveFramePosition(self.dragging, deltaX, deltaY);
        }
      });
    },

    /**
     * MouseWheel
     */
    _onMouseWheel: function() {
      var self = this;
      return (function(evt) {
        self._doNothing(evt);

        var pos = self._getCursorPositionInCanvas(evt);
        var frame = self.sidem.isPointInFrame(pos.x, pos.y);

        // コマ外なら終了
        if (frame === null) return;

        var draggable = self.sidem.isDraggableFrame(frame);

        if (draggable) {
          var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
          self.sidem.zoomFrame(frame, delta * 0.05);
        }
      });
    },

    /**
     * 名前が変更された時の処理を行う
     */
    _onChangeName: function() {
      var self = this;
      return (function() {
        var frame = parseInt(this.dataset.number, 10);
        self.sidem.setName(frame, this.value);
      });
    },

    /**
     * 台詞が変更された時の処理を行う
     */
    _onChangeLine: function(evt) {
      var self = this;
      return (function() {
        var frame = parseInt(this.dataset.number, 10);
        self.sidem.setLine(frame, this.value);
      });
    },

    /**
     * 画像として出力する
     */
    _onOutput: function(evt) {
      var self = this;
      return (function() {
        var img;
        try {
          img = self.sidem.toDataURL();
        }
        catch (e) {
          document.getElementById("result").innerHTML = 'エラーが発生しました：' + e.message;
          return;
        }
        document.getElementById("result").innerHTML = '<img id="result_img" class="center-block">';
        document.getElementById("result_img").src = img;
      });
    },

    /**
     * canvas内でのカーソル位置を取得する
     * @return {Object} x,y座標が入ったオブジェクト
     */
    _getCursorPositionInCanvas: function(evt) {
      var rect = evt.target.getBoundingClientRect();
      var x = evt.clientX - rect.left;
      var y = evt.clientY - rect.top;

      return {'x': x, 'y': y};
    },

    /**
     * ロード時の処理を行う
     */
    onLoad: function() {
      var i, element, self = this;

      this.sidem = new SideMMyDesk();

      // キャンバスを初期化
      element = document.getElementById('sidem-mydesk');
      this.sidem.setCanvas(element).drawBase();

      // ファイルのD&D用イベント
      element.addEventListener('dragenter', this._doNothing, false);
      element.addEventListener('dragover', this._doNothing, false);
      element.addEventListener('drop', this._onDrop(), false);

      // マウス系イベント
      element.addEventListener('mousedown', this._onMouseDown(), false);
      element.addEventListener('mouseup', this._onMouseUp(), false);
      element.addEventListener('mousemove', this._onMouseMove(), false);
      element.addEventListener('mousewheel', this._onMouseWheel(), false);
      element.addEventListener('DOMMouseScroll', this._onMouseWheel(), false);

      // 保存用画像作成
      element = document.getElementById('output');
      element.addEventListener('click', this._onOutput(), false);

      // 名前の設定
      element = document.querySelectorAll('input.name');
      for (i = 0; i < element.length; i++) {
        element[i].addEventListener('input', this._onChangeName(), false);
      }

      // 台詞の設定
      element = document.querySelectorAll('input.line');
      for (i = 0; i < element.length; i++) {
        element[i].addEventListener('input', this._onChangeLine(), false);
      }
    }
  };
})();
