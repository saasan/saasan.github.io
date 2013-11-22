/* jshint indent: 2 */

var Birthday;

(function(){
  'use strict';

  /**
   * 誕生日
   * @constructor
   */
  Birthday = function() {
    for (var i = 1; i <= 12; i++) {
      this._data[i] = [];
    }

    this._data[1][1] = "道明寺歌鈴、鷹富士茄子";
    this._data[1][3] = "野々村そら、村上巴";
    this._data[1][6] = "三村かな子、安斎都";
    this._data[1][10] = "瀬名詩織";
    this._data[1][13] = "浜口あやめ";
    this._data[1][19] = "メアリー・コクラン";
    this._data[1][21] = "松山久美子、四条貴音";
    this._data[1][23] = "西園寺琴歌";
    this._data[1][28] = "太田優";
    this._data[2][6] = "江上椿";
    this._data[2][7] = "東郷あい";
    this._data[2][8] = "市原仁奈";
    this._data[2][11] = "浅野風香";
    this._data[2][14] = "相原雪乃、宮本フレデリカ";
    this._data[2][17] = "北川真尋";
    this._data[2][19] = "遊佐こずえ";
    this._data[2][22] = "前川みく";
    this._data[2][25] = "三船美優、如月千早";
    this._data[2][26] = "黒川千秋";
    this._data[3][3] = "今井加奈";
    this._data[3][5] = "小関麗奈";
    this._data[3][6] = "有浦柑奈";
    this._data[3][7] = "片桐早苗";
    this._data[3][9] = "工藤忍";
    this._data[3][10] = "ルーキートレーナー";
    this._data[3][13] = "堀裕子";
    this._data[3][16] = "柳瀬美由紀";
    this._data[3][18] = "衛藤美紗希";
    this._data[3][19] = "長富蓮実";
    this._data[3][20] = "大西由里子";
    this._data[3][21] = "松尾千鶴";
    this._data[3][23] = "中野有香";
    this._data[3][25] = "高峯のあ、高槻やよい";
    this._data[3][27] = "村松さくら";
    this._data[3][28] = "白坂小梅";
    this._data[4][1] = "古賀小春";
    this._data[4][3] = "天海春香";
    this._data[4][4] = "ヘレン";
    this._data[4][6] = "喜多日菜子";
    this._data[4][7] = "和久井留美";
    this._data[4][8] = "神崎蘭子、櫻井桃華、桐野アヤ";
    this._data[4][9] = "荒木比奈";
    this._data[4][10] = "上条春菜";
    this._data[4][12] = "大原みちる";
    this._data[4][14] = "赤城みりあ";
    this._data[4][15] = "相葉夕美";
    this._data[4][19] = "白菊ほたる";
    this._data[4][24] = "島村卯月";
    this._data[4][27] = "槙原志保、水木聖來";
    this._data[5][1] = "難波笑美";
    this._data[5][2] = "土屋亜子";
    this._data[5][4] = "日下部若葉";
    this._data[5][5] = "水瀬伊織";
    this._data[5][6] = "沢田麻理菜";
    this._data[5][7] = "大槻唯";
    this._data[5][8] = "高橋礼子、吉岡沙紀";
    this._data[5][9] = "早坂美玲";
    this._data[5][12] = "柳清良";
    this._data[5][15] = "安部菜々";
    this._data[5][18] = "古澤頼子";
    this._data[5][21] = "ライラ";
    this._data[5][22] = "双海亜美、双海真美";
    this._data[5][25] = "浜川愛結奈";
    this._data[5][29] = "綾瀬穂乃香";
    this._data[6][3] = "及川雫";
    this._data[6][4] = "丹羽仁美";
    this._data[6][6] = "星輝子";
    this._data[6][7] = "佐々木千枝";
    this._data[6][9] = "小室千奈美";
    this._data[6][10] = "池袋晶葉、トレーナー";
    this._data[6][11] = "緒方智絵里";
    this._data[6][12] = "奥山沙織";
    this._data[6][14] = "高垣楓";
    this._data[6][15] = "藤原肇";
    this._data[6][20] = "梅木音葉";
    this._data[6][23] = "秋月律子";
    this._data[6][25] = "三好紗南";
    this._data[6][27] = "仙崎恵磨";
    this._data[6][29] = "ナターリア";
    this._data[6][30] = "多田李衣菜";
    this._data[7][1] = "速水奏、藤居朋";
    this._data[7][7] = "桃井あずき、赤西瑛梨華";
    this._data[7][10] = "矢口美羽";
    this._data[7][13] = "氏家むつみ";
    this._data[7][16] = "岡崎泰葉";
    this._data[7][17] = "結城晴";
    this._data[7][19] = "三浦あずさ";
    this._data[7][20] = "杉坂海、龍崎薫";
    this._data[7][23] = "相馬夏美";
    this._data[7][25] = "高森藍子";
    this._data[7][27] = "新田美波";
    this._data[7][30] = "城ヶ崎莉嘉";
    this._data[7][31] = "橘ありす";
    this._data[8][1] = "愛野渚、棟方愛海";
    this._data[8][3] = "海老原菜帆";
    this._data[8][4] = "日野茜";
    this._data[8][7] = "向井拓海";
    this._data[8][8] = "木場真奈美";
    this._data[8][10] = "渋谷凛、五十嵐響子";
    this._data[8][15] = "ケイト";
    this._data[8][17] = "関裕美、西島櫂";
    this._data[8][18] = "首藤葵";
    this._data[8][19] = "木村夏樹";
    this._data[8][24] = "持田亜里沙";
    this._data[8][26] = "クラリス";
    this._data[8][27] = "井村雪菜、榊原里美、森久保乃々";
    this._data[8][28] = "涼宮星花";
    this._data[8][29] = "菊地真";
    this._data[8][30] = "若林智香";
    this._data[9][1] = "諸星きらり、松本沙理奈";
    this._data[9][2] = "双葉杏";
    this._data[9][5] = "北条加蓮";
    this._data[9][7] = "佐久間まゆ";
    this._data[9][9] = "栗原ネネ";
    this._data[9][10] = "ベテラントレーナー";
    this._data[9][13] = "南条光";
    this._data[9][14] = "姫川友紀";
    this._data[9][16] = "神谷奈緒";
    this._data[9][19] = "キャシー・グラハム、アナスタシア";
    this._data[9][20] = "脇山珠美";
    this._data[9][24] = "伊集院惠";
    this._data[9][26] = "冴島清美";
    this._data[9][28] = "佐城雪美";
    this._data[9][29] = "楊菲菲";
    this._data[10][1] = "松永涼";
    this._data[10][3] = "兵藤レナ";
    this._data[10][10] = "椎名法子、我那覇響";
    this._data[10][11] = "服部瞳子";
    this._data[10][14] = "並木芽衣子、藤本里奈";
    this._data[10][18] = "水本ゆかり、小早川紗枝";
    this._data[10][23] = "西川保奈美";
    this._data[10][26] = "上田鈴帆";
    this._data[10][27] = "鷺沢文香";
    this._data[10][30] = "月宮雅";
    this._data[11][3] = "成宮由愛";
    this._data[11][6] = "間中美里";
    this._data[11][7] = "八神マキノ";
    this._data[11][11] = "相川千夏、大石泉";
    this._data[11][12] = "城ヶ崎美嘉";
    this._data[11][13] = "岸部彩華";
    this._data[11][14] = "原田美世";
    this._data[11][17] = "小松伊吹";
    this._data[11][19] = "的場梨沙";
    this._data[11][22] = "篠原礼";
    this._data[11][23] = "星井美希";
    this._data[11][25] = "輿水幸子、川島瑞樹";
    this._data[12][1] = "本田未央";
    this._data[12][2] = "喜多見柚";
    this._data[12][5] = "水野翠";
    this._data[12][8] = "十時愛梨";
    this._data[12][10] = "マスタートレーナー";
    this._data[12][12] = "塩見周子";
    this._data[12][16] = "小日向美穂、大和亜季";
    this._data[12][18] = "横山千佳";
    this._data[12][24] = "イヴ・サンタクロース、萩原雪歩";
    this._data[12][25] = "柊志乃、望月聖";
    this._data[12][28] = "松原早耶";
    this._data[12][29] = "斉藤洋子、真鍋いつき";
  };

  Birthday.prototype = {
    _data: [],

    /**
     * 今日誕生日のアイドルを取得する
     * @return {string} アイドル名。該当無しならnull
     */
    getToday: function() {
      var today = new Date();
      var m = today.getMonth() + 1;
      var d = today.getDate();

      if (typeof this._data[m][d] === 'undefined') {
        return null;
      }
      else {
        return this._data[m][d];
      }
    },

    /**
     * 次誕生日のアイドルを取得する
     * @return {string} 日付とアイドル名
     */
    getNext: function() {
      var next = new Date();
      next.setDate(next.getDate() + 1);

      var m = next.getMonth() + 1;
      var d = next.getDate();

      while (typeof this._data[m][d] === 'undefined') {
        next.setDate(next.getDate() + 1);
        m = next.getMonth() + 1;
        d = next.getDate();
      }

      return m + '月' + d + '日：' + this._data[m][d];
    }
  };
})();
