var slStageSongsSearch;

(function(){
  'use strict';

  slStageSongsSearch = angular.module('slStageSongsSearch', ['ngStorage']);

  slStageSongsSearch.config(['$localStorageProvider', function($localStorageProvider) {
    $localStorageProvider.namespace('slStageSongsSearch.');
  }]);

  // localStorageに保存するユーザー別設定のデフォルト値
  slStageSongsSearch.constant('defaultSettings', {
    showSongDifficulty: true,
    showSongType: true,
    showSongLevel: true,
    showSongStamina: true,
    showSongExp: true,
    showSongAffection: true
  });

  // 楽曲Lv
  slStageSongsSearch.constant('songLv', {
     5: { stamina: 10, exp: 35, affection:  9 },
     6: { stamina: 10, exp: 35, affection:  9 },
     7: { stamina: 10, exp: 35, affection:  9 },
     8: { stamina: 11, exp: 42, affection: 10 },
     9: { stamina: 11, exp: 42, affection: 10 },
    10: { stamina: 12, exp: 46, affection: 14 },
    11: { stamina: 12, exp: 46, affection: 14 },
    12: { stamina: 13, exp: 46, affection: 15 },
    13: { stamina: 13, exp: 46, affection: 15 },
    14: { stamina: 14, exp: 49, affection: 16 },
    15: { stamina: 15, exp: 49, affection: 20 },
    16: { stamina: 15, exp: 49, affection: 20 },
    17: { stamina: 16, exp: 53, affection: 22 },
    18: { stamina: 16, exp: 53, affection: 22 },
    19: { stamina: 17, exp: 56, affection: 23 },
    20: { stamina: 18, exp: 56, affection: 26 },
    21: { stamina: 18, exp: 56, affection: 26 },
    22: { stamina: 18, exp: 56, affection: 26 },
    23: { stamina: 18, exp: 56, affection: 26 },
    24: { stamina: 18, exp: 56, affection: 26 },
    25: { stamina: 19, exp: 63, affection: 27 },
    26: { stamina: 19, exp: 63, affection: 27 },
    27: { stamina: 19, exp: 63, affection: 27 },
    28: { stamina: 19, exp: 63, affection: 27 }
  });

  // 難易度
  slStageSongsSearch.constant('songDifficulty', {
    DEBUT:   0,
    REGULAR: 1,
    PRO:     2,
    MASTER:  3,
    0: 'DEBUT',
    1: 'REGULAR',
    2: 'PRO',
    3: 'MASTER'
  });

  // タイプ
  slStageSongsSearch.constant('songType', {
    全タイプ:   0,
    キュート:   1,
    クール:     2,
    パッション: 3,
    0: '全タイプ',
    1: 'キュート',
    2: 'クール',
    3: 'パッション'
  });

  slStageSongsSearch.controller('MainController', ['$scope', '$localStorage', 'defaultSettings', 'songLv', 'songDifficulty', 'songType', function($scope, $localStorage, defaultSettings, songLv, songDifficulty, songType) {
    /**
     * 絞り込み用のリストを作成
     */
    function createFilterList() {
      // 重複を削除するfilter
      function removeDuplicateValues(element, index, self) {
        return self.indexOf(element) === index;
      }

      // 数値としてsortする関数
      function byNumber(a, b) {
        return a - b;
      }

      var songDifficultyList = [], songTypeList = [], songLvList = [],
          songStaminaList = [], songExpList = [], songAffectionList = [];

      // 難易度
      Object.keys(songDifficulty).forEach(function(element) {
        if (isNaN(element)) {
          songDifficultyList.push({ label: element, value: songDifficulty[element] });
        }
      });

      // タイプ
      Object.keys(songType).forEach(function(element) {
        if (isNaN(element)) {
          songTypeList.push({ label: element, value: songType[element] });
        }
      });

      // 楽曲Lv
      Object.keys(songLv).forEach(function(key) {
        // 数値化して入れておかないとfilterが機能しない
        songLvList.push(parseInt(key, 10));
      });

      // スタミナ、経験値、親愛度
      songLvList.forEach(function(element) {
        songStaminaList.push(songLv[element].stamina);
        songExpList.push(songLv[element].exp);
        songAffectionList.push(songLv[element].affection);
      });

      // 重複した値を削除
      songStaminaList = songStaminaList.filter(removeDuplicateValues);
      songExpList = songExpList.filter(removeDuplicateValues);
      songAffectionList = songAffectionList.filter(removeDuplicateValues);

      // ソート
      songStaminaList.sort(byNumber);
      songExpList.sort(byNumber);
      songAffectionList.sort(byNumber);

      $scope.songDifficultyList = songDifficultyList;
      $scope.songTypeList = songTypeList;
      $scope.songLvList = songLvList;
      $scope.songStaminaList = songStaminaList;
      $scope.songExpList = songExpList;
      $scope.songAffectionList = songAffectionList;
    }

    // 絞り込み用のリストを作成
    createFilterList();

    // ストレージから設定を読み込む
    $scope.$storage = $localStorage.$default(defaultSettings);

    $scope.songLv = songLv;
    $scope.songDifficulty = songDifficulty;
    $scope.songType = songType;

    /**
     * 楽曲フィルター
     * @returns {boolean} 表示するならtrue、表示しないならfalse
     */
    $scope.songFilter = function(song) {
      var result = true, i, name;

      // 難易度、タイプ、楽曲Lv
      name = [
        ['songFilterDifficulty', 'difficulty'],
        ['songFilterType',       'type'],
        ['songFilterLevel' ,     'lv']
      ];

      for (i = 0; i <name.length; i++) {
        if ($scope.$storage[name[i][0]] != null) {
          result = result && (song[name[i][1]] === $scope.$storage[name[i][0]]);
        }
      }

      // スタミナ、経験値、親愛度
      name = [
        ['songFilterStamina'  , 'stamina'],
        ['songFilterExp'      , 'exp'],
        ['songFilterAffection', 'affection']
      ];

      for (i = 0; i <name.length; i++) {
        if ($scope.$storage[name[i][0]] > 0) {
          result = result && ($scope.songLv[song.lv][name[i][1]] === $scope.$storage[name[i][0]]);
        }
      }

      return result;
    };

    /**
     * 楽曲データ読み込み完了時の処理
     * @param {object} event イベント情報
     * @param {string} songs 楽曲データ
     */
    $scope.$on('load', function(event, songs) {
      $scope.songs = songs;
    });

    /**
     * エラーイベント時の処理
     * @param {object} event イベント情報
     * @param {string} errorMessage エラーメッセージ
     */
    $scope.$on('error', function(event, errorMessage) {
      $scope.errorMessage = errorMessage;
    });
}]);

  slStageSongsSearch.run(['$rootScope', '$http', 'songType', function($rootScope, $http, songType) {
    /**
     * データ取得正常終了時の処理
     * @param {object} data サーバーから取得したデータ
     */
    function getDataSuccess(data) {
      // 最低行数
      var MIN_ROWS = 3;
      // 最低列数
      var MIN_COLUMNS = 6;
      // 列番号(zero-based)
      var COLUMN = {
        TITLE: 0,
        TYPE: 1,
        LEVEL: 2,
        // 楽曲Lv内の難易度列番号(zero-based)
        DEBUT: 0,
        REGULAR: 1,
        PRO: 2,
        MASTER: 3
      };

      var i, j, song, songs = [], line, lines = data;

      // 改行コードを\nにする
      lines = lines.replace(/\r\n/g, '\n');
      lines = lines.replace(/\r/g, '\n');
      // 行で分割
      lines = lines.split('\n');

      if (lines.length < MIN_ROWS) {
        $rootScope.$broadcast('error', '楽曲データの行数が少なすぎます。');
        return;
      }

      for (i = 2; i < lines.length; i++) {
        line = lines[i].split('\t');

        if (line.length < MIN_COLUMNS) {
          $rootScope.$broadcast('error', '楽曲データの列数が少なすぎます。');
          return;
        }

        for (j = COLUMN.DEBUT; j <= COLUMN.MASTER; j++) {
          song = {
            title: line[COLUMN.TITLE],
            difficulty: j,
            type: songType[line[COLUMN.TYPE]],
            lv: parseInt(line[COLUMN.LEVEL + j], 10)
          };
          songs.push(song);
        }
      }

      $rootScope.$broadcast('load', songs);
    }

    /**
     * データ取得異常終了時の処理
     */
    function getDataError() {
      $rootScope.$broadcast('error', '楽曲データの取得に失敗しました。');
    }

    // 楽曲データを取得する
    $http.get('./songs.tsv')
      .success(getDataSuccess)
      .error(getDataError);
  }]);
})();
