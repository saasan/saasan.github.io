/* jshint indent: 2, browser: true */

var SideMMyDesk;

(function(){
  'use strict';

  /**
   * SideMマイデスク風ジェネレータ
   * @constructor
   */
  SideMMyDesk = function() {
  };

  SideMMyDesk.prototype = {
    /** タイトル */
    TITLE: 'SideM風会話ジェネレータ ' + document.URL,
    /** 文字に使用するフォント */
    FONT: '"Lucida Grande", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',

    /** 背景 */
    BACKGROUND: {
      /** 幅 */
      WIDTH: 640,
      /** 高さ */
      HEIGHT: 586,
      /** 色 */
      COLOR: 'black'
    },

    /** 吹き出し */
    BALLOON: {
      /** 幅 */
      WIDTH: 616,
      /** 高さ */
      HEIGHT: 82,
      /** 色 */
      COLOR: 'white',
      /** 枠 */
      BORDER: {
        /** 太さ */
        WIDTH: 4
      },
      /** 角の半径 */
      RADIUS: 15,
      /** 影 */
      SHADOW: {
        /** 色 */
        COLOR: 'white',
        BLUR: 7,
        OFFSET: {
          X: 0,
          Y: 0
        }
      },
      /** 矢印 */
      ARROW: {
        /** 幅 */
        WIDTH: 32,
        /** 高さ */
        HEIGHT: 32
      },
      /** 名前 */
      NAME: {
        /** フォントサイズ(px) */
        FONT_SIZE: 20,
        /** 左 */
        LEFT: 16,
        /** ベースライン */
        BASELINE: 28,
        /** 影 */
        SHADOW: {
          LIGHT:{
            /** 色 */
            COLOR: 'white',
            BLUR: 2,
            OFFSET: {
              X: 2,
              Y: 2
            }
          },
          DARK: {
            /** 色 */
            COLOR: '#AAA',
            BLUR: 4,
            OFFSET: {
              X: 3,
              Y: 3
            }
          }
        },
      },
      /** 台詞 */
      LINE: {
        /** フォントサイズ(px) */
        FONT_SIZE: 26,
        /** 左 */
        LEFT: 16,
        /** ベースライン */
        BASELINE: 16,
        /** 影 */
        SHADOW: {
          LIGHT:{
            /** 色 */
            COLOR: 'white',
            BLUR: 2,
            OFFSET: {
              X: 1,
              Y: 1
            }
          },
          DARK: {
            /** 色 */
            COLOR: '#CCC',
            BLUR: 4,
            OFFSET: {
              X: 3,
              Y: 3
            }
          }
        },
      }
    },

    /** 上吹き出し */
    TOP_BALLOON: {
      /** 色 */
      COLOR: 'rgb(0, 149, 59)',
      /** 左 */
      LEFT: 12,
      /** 上 */
      TOP: 14,
      /** 矢印 */
      ARROW: {
        /** 左 */
        LEFT: 546,
        /** 上 */
        TOP: 76,
      }
    },

    /** 下吹き出し */
    BOTTOM_BALLOON: {
      /** 色 */
      COLOR: 'rgb(0, 15, 158)',
      /** 左 */
      LEFT: 12,
      /** 上 */
      TOP: 482,
      /** 矢印 */
      ARROW: {
        /** 左 */
        LEFT: 424,
        /** 上 */
        TOP: 470,
      }
    },

    /** コマ */
    FRAMES: [
      {
        CORNER: [[480, 84], [498, 483], [640, 483], [640, 84]],
        CENTER: [563, 284],
        IMAGE_CENTER: [563, 284]
      },
      {
        CORNER: [[338, 84], [314, 483], [486, 483], [468, 84]],
        CENTER: [400, 284],
        IMAGE_CENTER: [400, 284]
      },
      {
        CORNER: [[154, 84], [173, 297], [312, 312], [326, 84]],
        CENTER: [240, 184],
        IMAGE_CENTER: [240, 284]
      },
      {
        CORNER: [[0, 84], [0, 277], [160, 295], [142, 84]],
        CENTER: [74, 184],
        IMAGE_CENTER: [74, 284]
      },
      {
        CORNER: [[0, 290], [0, 483], [301, 483], [311, 325]],
        CENTER: [155, 405],
        IMAGE_CENTER: [155, 484]
      }
    ],

    /** 画像 */
    images: [
      {
        data: null,
        width: 0,
        height: 0,
        ratio: 1,
        x: 0,
        y: 0
      },
      {
        data: null,
        width: 0,
        height: 0,
        ratio: 1,
        x: 0,
        y: 0
      },
      {
        data: null,
        width: 0,
        height: 0,
        ratio: 1,
        x: 0,
        y: 0
      },
      {
        data: null,
        width: 0,
        height: 0,
        ratio: 1,
        x: 0,
        y: 0
      },
      {
        data: null,
        width: 0,
        height: 0,
        ratio: 1,
        x: 0,
        y: 0
      }
    ],

    /** 名前 */
    names: ["", ""],
    /** 台詞 */
    lines: ["", ""],

    /**
     * 角丸矩形を塗りつぶす
     */
    _fillRoundRect: function(left, top, width, height, radius) {
      var pi = Math.PI;

      this.ctx.save();

      this.ctx.beginPath();
      this.ctx.arc(left + radius, top + radius, radius, - pi, - 0.5 * pi, false);
      this.ctx.arc(left + width - radius, top + radius, radius, - 0.5 * pi, 0, false);
      this.ctx.arc(left + width - radius, top + height - radius, radius, 0, 0.5 * pi, false);
      this.ctx.arc(left + radius, top + height - radius, radius, 0.5 * pi, pi, false);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    },

    /**
     * 多角形のパスを設定する
     */
    _setPath: function(pos) {
      this.ctx.beginPath();

      for (var i = 0; i < pos.length; i++) {
        if (i === 0) {
          this.ctx.moveTo(pos[i][0], pos[i][1]);
        }
        else {
          this.ctx.lineTo(pos[i][0], pos[i][1]);
        }
      }

      this.ctx.closePath();
    },

    /**
     * 多角形を塗りつぶす
     */
    _fillPolygon: function(pos) {
      this.ctx.save();

      this._setPath(pos);
      this.ctx.fill();

      this.ctx.restore();
    },

    /**
     * 多角形のクリップを設定する
     */
    _clipPolygon: function(pos) {
      this._setPath(pos);
      this.ctx.clip();
    },

    /**
     * 文字列を描く
     */
    _drawString: function(str, x, y, font, color, textAlign, textBaseline) {
      var f = (typeof font === 'undefined' ? '' : font);
      var c = (typeof color === 'undefined' ? 'black' : color);
      var a = (typeof textAlign === 'undefined' ? 'start' : textAlign);
      var b = (typeof textBaseline === 'undefined' ? 'alphabetic' : textBaseline);

      this.ctx.save();

      this.ctx.font = f;
      this.ctx.fillStyle = c;
      this.ctx.textAlign = a;
      this.ctx.textBaseline = b;
      this.ctx.fillText(str, x, y);

      this.ctx.restore();
    },

    /**
     * 背景を描く
     */
    _drawBackground: function() {
      this.ctx.save();

      this.ctx.fillStyle = this.BACKGROUND.COLOR;
      this.ctx.fillRect(0, 0, this.BACKGROUND.WIDTH, this.BACKGROUND.HEIGHT);

      this.ctx.restore();
    },

    /**
     * 吹き出しを描く
     */
    _drawBalloon: function(left, top, arrowLeft, arrowTop, color) {
      var aw2 = this.BALLOON.ARROW.WIDTH / 2;
      var ah2 = this.BALLOON.ARROW.HEIGHT / 2;
      var abw = this.BALLOON.BORDER.WIDTH * Math.sqrt(2);
      var b2 = this.BALLOON.BORDER.WIDTH * 2;

      this.ctx.save();

      // 影の設定
      this.ctx.shadowColor = this.BALLOON.SHADOW.COLOR;
      this.ctx.shadowBlur = this.BALLOON.SHADOW.BLUR;
      this.ctx.shadowOffsetX = this.BALLOON.SHADOW.OFFSET.X;
      this.ctx.shadowOffsetY = this.BALLOON.SHADOW.OFFSET.Y;

      // 枠
      this.ctx.fillStyle = color;
      this._fillRoundRect(left, top, this.BALLOON.WIDTH, this.BALLOON.HEIGHT, this.BALLOON.RADIUS);

      this.ctx.restore();
      this.ctx.save();

      // 矢印の枠
      this.ctx.fillStyle = color;
      this._fillPolygon([
        [arrowLeft,                             arrowTop + ah2],
        [arrowLeft + aw2,                       arrowTop + this.BALLOON.ARROW.HEIGHT],
        [arrowLeft + this.BALLOON.ARROW.WIDTH,  arrowTop + ah2],
        [arrowLeft + aw2,                       arrowTop]
      ]);

      // 内側
      this.ctx.fillStyle = this.BALLOON.COLOR;
      this._fillRoundRect(
        left + this.BALLOON.BORDER.WIDTH,
        top + this.BALLOON.BORDER.WIDTH,
        this.BALLOON.WIDTH - b2,
        this.BALLOON.HEIGHT - b2,
        this.BALLOON.RADIUS - this.BALLOON.BORDER.WIDTH
      );

      // 矢印
      this._fillPolygon([
        [arrowLeft + abw,                             arrowTop + ah2],
        [arrowLeft + aw2,                             arrowTop + this.BALLOON.ARROW.HEIGHT - abw],
        [arrowLeft + this.BALLOON.ARROW.WIDTH - abw,  arrowTop + ah2],
        [arrowLeft + aw2,                             arrowTop + abw]
      ]);

      this.ctx.restore();
    },

    /**
     * 名前を描く
     */
    _drawName: function(BalloonLeft, BalloonTop, name, color) {
      if (typeof name === null) return;

      this.ctx.save();

      // 黒い影を付けて白文字で描く
      this.ctx.shadowColor = this.BALLOON.NAME.SHADOW.DARK.COLOR;
      this.ctx.shadowBlur = this.BALLOON.NAME.SHADOW.DARK.BLUR;
      this.ctx.shadowOffsetX = this.BALLOON.NAME.SHADOW.DARK.OFFSET.X;
      this.ctx.shadowOffsetY = this.BALLOON.NAME.SHADOW.DARK.OFFSET.Y;
      this._drawString(name, BalloonLeft + this.BALLOON.NAME.LEFT, BalloonTop + this.BALLOON.NAME.BASELINE, 'bold ' + this.BALLOON.NAME.FONT_SIZE + 'px ' + this.FONT, 'white', 'left');

      this.ctx.restore();
      this.ctx.save();

      // 白い影を付けて普通の文字色で描く
      this.ctx.shadowColor = this.BALLOON.NAME.SHADOW.LIGHT.COLOR;
      this.ctx.shadowBlur = this.BALLOON.NAME.SHADOW.LIGHT.BLUR;
      this.ctx.shadowOffsetX = this.BALLOON.NAME.SHADOW.LIGHT.OFFSET.X;
      this.ctx.shadowOffsetY = this.BALLOON.NAME.SHADOW.LIGHT.OFFSET.Y;
      this._drawString(name, BalloonLeft + this.BALLOON.NAME.LEFT, BalloonTop + this.BALLOON.NAME.BASELINE, 'bold ' + this.BALLOON.NAME.FONT_SIZE + 'px ' + this.FONT, color, 'left');

      this.ctx.restore();
    },

    /**
     * 台詞を描く
     */
    _drawLine: function(BalloonLeft, BalloonBottom, line, color) {
      if (typeof line === null) return;

      this.ctx.save();

      // 黒い影を付けて白文字で描く
      this.ctx.shadowColor = this.BALLOON.LINE.SHADOW.DARK.COLOR;
      this.ctx.shadowBlur = this.BALLOON.LINE.SHADOW.DARK.BLUR;
      this.ctx.shadowOffsetX = this.BALLOON.LINE.SHADOW.DARK.OFFSET.X;
      this.ctx.shadowOffsetY = this.BALLOON.LINE.SHADOW.DARK.OFFSET.Y;
      this._drawString(line, BalloonLeft + this.BALLOON.LINE.LEFT, BalloonBottom - this.BALLOON.LINE.BASELINE, 'bold ' + this.BALLOON.LINE.FONT_SIZE + 'px ' + this.FONT, 'white', 'left');

      this.ctx.restore();
      this.ctx.save();

      // 白い影を付けて普通の文字色で描く
      this.ctx.shadowColor = this.BALLOON.LINE.SHADOW.LIGHT.COLOR;
      this.ctx.shadowBlur = this.BALLOON.LINE.SHADOW.LIGHT.BLUR;
      this.ctx.shadowOffsetX = this.BALLOON.LINE.SHADOW.LIGHT.OFFSET.X;
      this.ctx.shadowOffsetY = this.BALLOON.LINE.SHADOW.LIGHT.OFFSET.Y;
      this._drawString(line, BalloonLeft + this.BALLOON.LINE.LEFT, BalloonBottom - this.BALLOON.LINE.BASELINE, 'bold ' + this.BALLOON.LINE.FONT_SIZE + 'px ' + this.FONT, color, 'left');

      this.ctx.restore();
    },

    /**
     * 上の吹き出しを描く
     */
    _drawTopBalloon: function() {
      this._drawBalloon(this.TOP_BALLOON.LEFT, this.TOP_BALLOON.TOP, this.TOP_BALLOON.ARROW.LEFT, this.TOP_BALLOON.ARROW.TOP, this.TOP_BALLOON.COLOR);
      this._drawName(this.TOP_BALLOON.LEFT, this.TOP_BALLOON.TOP, this.names[0], this.TOP_BALLOON.COLOR);
      this._drawLine(this.TOP_BALLOON.LEFT, this.TOP_BALLOON.TOP + this.BALLOON.HEIGHT, this.lines[0], 'black');
    },

    /**
     * 下の吹き出しを描く
     */
    _drawBottomBalloon: function() {
      this._drawBalloon(this.BOTTOM_BALLOON.LEFT, this.BOTTOM_BALLOON.TOP, this.BOTTOM_BALLOON.ARROW.LEFT, this.BOTTOM_BALLOON.ARROW.TOP, this.BOTTOM_BALLOON.COLOR);
      this._drawName(this.BOTTOM_BALLOON.LEFT, this.BOTTOM_BALLOON.TOP, this.names[1], this.BOTTOM_BALLOON.COLOR);
      this._drawLine(this.BOTTOM_BALLOON.LEFT, this.BOTTOM_BALLOON.TOP + this.BALLOON.HEIGHT, this.lines[1], 'black');
    },

    /**
     * 空白のコマを描く
     * @param {number} frame 描くコマの番号(zero-based)
     */
    _drawWhiteFrame: function(frame) {
      this.ctx.save();

      this.ctx.fillStyle = 'white';

      var charCode = '①'.charCodeAt(0);

      // 白で塗り潰す
      this._fillPolygon(this.FRAMES[frame].CORNER);
      // コマ番号
      this._drawString(String.fromCharCode(charCode + frame), this.FRAMES[frame].CENTER[0], this.FRAMES[frame].CENTER[1], '50px ' + this.FONT, '#888', 'center', 'middle');

      this.ctx.restore();
    },

    /**
     * コマを描く
     * @param {number} frame 描くコマの番号(zero-based)
     */
    _drawFrame: function(frame) {
      // データが無ければ空白のコマを描く
      if (!this.images[frame].data) {
        this._drawWhiteFrame(frame);
        return;
      }

      // 縮小したサイズ
      var w = this.images[frame].width * this.images[frame].ratio;
      var h = this.images[frame].height * this.images[frame].ratio;

      this.ctx.save();

      this._clipPolygon(this.FRAMES[frame].CORNER);
      this.ctx.drawImage(
        this.images[frame].data,
        this.images[frame].x - (w / 2),
        this.images[frame].y - (h / 2),
        w,
        h
      );

      this.ctx.restore();
    },

    /**
     * ソースを描く
     */
    _drawSource: function() {
      this._drawString(this.TITLE, this.BACKGROUND.WIDTH  - 5, this.BACKGROUND.HEIGHT  - 2, '12px ' + this.FONT, '#FFF', 'right', 'bottom');
    },

    /**
     * canvasを設定する
     * @param {Object} canvas canvas要素のDOMオブジェクト
     */
    setCanvas: function(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');

      return this;
    },

    /**
     * 土台を描く
     */
    drawBase: function() {
      var i;

      // 背景
      this._drawBackground();

      // コマ
      for (i = 0; i < this.FRAMES.length; i++) {
        this._drawWhiteFrame(i);
      }

      // 上の吹き出し
      this._drawTopBalloon();
      // 下の吹き出し
      this._drawBottomBalloon();

      // ソース
      this._drawSource();

      return this;
    },

    /**
     * 描く
     */
    draw: function() {
      var i;

      // 背景
      this._drawBackground();

      // コマ
      for (i = 0; i < this.FRAMES.length; i++) {
        this._drawFrame(i);
      }

      // 上の吹き出し
      this._drawTopBalloon();
      // 下の吹き出し
      this._drawBottomBalloon();

      // ソース
      this._drawSource();

      return this;
    },

    /**
     * 画像を設定する
     * @param {number} frame 設定するコマの番号(zero-based)
     * @param {Image} image 画像
     */
    setImage: function(frame, image) {
      var w = this.images[frame].width = image.width;
      var h = this.images[frame].height = image.height;
      var r = 1;

      // サイズが大きければ縮小
      if (h > 400) {
        r = 400 / h;
      }

      this.images[frame].data = image;
      this.images[frame].ratio = r;
      this.images[frame].x = this.FRAMES[frame].IMAGE_CENTER[0];
      this.images[frame].y = this.FRAMES[frame].IMAGE_CENTER[1];

      this.draw();

      return this;
    },

    /**
     * 名前を設定する
     * @param {number} frame 設定するコマの番号(zero-based)
     * @param {string} name 名前
     */
    setName: function(frame, name) {
      this.names[frame] = name;
      this.draw();

      return this;
    },

    /**
     * 台詞を設定する
     * @param {number} frame 設定するコマの番号(zero-based)
     * @param {string} line 台詞
     */
    setLine: function(frame, line) {
      this.lines[frame] = line;
      this.draw();

      return this;
    },

    /**
     * 指定した座標がコマの中にあるか確認する
     * @param {number} x X座標
     * @param {number} y Y座標
     * @return {number} コマの中で無ければnull。コマの中ならその番号。
     */
    isPointInFrame: function(x, y) {
      var i, result = null;

      this.ctx.save();

      for (i = 0; i < this.FRAMES.length; i++) {
        this._setPath(this.FRAMES[i].CORNER);
        if (this.ctx.isPointInPath(x, y)) {
          result = i;
          break;
        }
      }

      this.ctx.restore();
      return result;
    },

    /**
     * 指定した座標がドラッグ可能か確認する
     * @param {number} x X座標
     * @param {number} y Y座標
     * @return {boolean} ドラッグ可能ならtrue。そうでなければfalse。
     */
    isDraggablePosition: function(x, y) {
      var frame = this.isPointInFrame(x, y);
      if (frame === null) {
        return false;
      }
      return (this.images[frame].data !== null);
    },

    /**
     * 指定したコマがドラッグ可能か確認する
     * @param {number} frame コマの番号(zero-based)
     * @return {boolean} ドラッグ可能ならtrue。そうでなければfalse。
     */
    isDraggableFrame: function(frame) {
      return (typeof this.images[frame] !== 'undefined' && this.images[frame].data !== null);
    },

    /**
     * コマを移動する
     * @param {number} frame コマの番号(zero-based)
     * @param {number} x X方向の移動距離
     * @param {number} y Y方向の移動距離
     */
    moveFramePosition: function(frame, x, y) {
      this.images[frame].x += x;
      this.images[frame].y += y;
      this.draw();
    },

    /**
     * コマを拡大縮小する
     * @param {number} frame コマの番号(zero-based)
     * @param {number} inout マイナスで縮小/プラスで拡大
     */
    zoomFrame: function(frame, inout) {
      var newRatio = this.images[frame].ratio + inout;
      if (newRatio > 0) {
        this.images[frame].ratio = newRatio;
      }
      this.draw();
    },

    /**
     * toDataURL
     * @return {object} canvas.toDataURL()の結果を返す
     */
    toDataURL: function() {
      return this.canvas.toDataURL('image/jpeg');
    }
  };
})();
