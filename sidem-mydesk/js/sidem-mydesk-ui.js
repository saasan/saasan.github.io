/* jshint indent: 2, browser: true */
/* global SideMMyDesk */
var SideMMyDeskUI;

(function(){
  'use strict';

  /**
   * SideM風会話ジェネレータのUI
   * @constructor
   */
  SideMMyDeskUI = function() {
  };

  SideMMyDeskUI.prototype = {
    /** SideMMyDesk */
    sidem: null,
    /** ドラッグ中のコマ番号。ドラッグ中でなければnull。 */
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
     * 吹き出しの表示状態、名前、台詞が変更された時の処理を行う関数を返す
     * @param {string} method 実際に処理を行うSideMMyDeskクラスのメソッド名
     * @param {number} frame コマの番号(zero-based)
     * @param {string} property methodに渡す値が入っているプロパティ名
     * @return {function} 関数
     */
    _onChange: function(method, frame, property) {
      var self = this;
      return (function() {
        self.sidem[method](frame, this[property]);
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
      var i, j, element, frame, self = this;
      this.sidem = new SideMMyDesk();

      // キャンバスを初期化
      element = document.getElementById('sidem-mydesk');
      this.sidem.setCanvas(element).drawBase();

      // canvasのイベントリスナーを設定
      var canvasEvents = [
        // ファイルのD&D用イベント
        { event: 'dragenter', listener: this._doNothing },
        { event: 'dragover', listener: this._doNothing },
        { event: 'drop', listener: this._onDrop() },
        // マウス系イベント
        { event: 'mousedown', listener: this._onMouseDown() },
        { event: 'mouseup', listener: this._onMouseUp() },
        { event: 'mousemove', listener: this._onMouseMove() },
        { event: 'mousewheel', listener: this._onMouseWheel() },
        { event: 'DOMMouseScroll', listener: this._onMouseWheel() }
      ];
      for (i = 0; i < canvasEvents.length; i++) {
        element.addEventListener(canvasEvents[i].event, canvasEvents[i].listener, false);
      }

      // 保存用画像作成
      element = document.getElementById('output');
      element.addEventListener('click', this._onOutput(), false);

      // UIのイベントリスナーを設定
      var uiEvents = [
        // 吹き出しの表示
        {
          query: 'input.balloonVisible',
          event: 'change',
          method: 'setBalloonVisible',
          property: 'checked'
        },
        // 名前
        {
          query: 'input.name',
          event: 'input',
          method: 'setName',
          property: 'value'
        },
        // 台詞
        {
          query: 'input.line',
          event: 'input',
          method: 'setLine',
          property: 'value'
        }
      ];
      for (i = 0; i < uiEvents.length; i++) {
        element = document.querySelectorAll(uiEvents[i].query);
        for (j = 0; j < element.length; j++) {
          frame = parseInt(element[j].dataset.number, 10);
          element[j].addEventListener(uiEvents[i].event, this._onChange(uiEvents[i].method, frame, uiEvents[i].property), false);
        }
      }
    }
  };
})();
