/* global angular: true */

var slStageSongsSearch = angular.module('slStageSongsSearch', ['ngStorage']);

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
  'DEBUT':   '0',
  'REGULAR': '1',
  'PRO':     '2',
  'MASTER':  '3',
  '0': 'DEBUT',
  '1': 'REGULAR',
  '2': 'PRO',
  '3': 'MASTER'
});

// タイプ
slStageSongsSearch.constant('songType', {
  '全タイプ':   '0',
  'キュート':   '1',
  'クール':     '2',
  'パッション': '3',
  '0': '全タイプ',
  '1': 'キュート',
  '2': 'クール',
  '3': 'パッション'
});

// 楽曲
slStageSongsSearch.constant('songs', [
  { title: 'お願い！シンデレラ', difficulty: 0, type: 0, lv: 5 },
  { title: 'とどけ！アイドル', difficulty: 0, type: 0, lv: 5 },
  { title: '輝く世界の魔法', difficulty: 0, type: 0, lv: 7 },
  { title: 'We\'re the friends!', difficulty: 0, type: 0, lv: 6 },
  { title: 'メッセージ', difficulty: 0, type: 0, lv: 7 },
  { title: 'S(mile)ing!', difficulty: 0, type: 1, lv: 6 },
  { title: 'Never say never', difficulty: 0, type: 2, lv: 6 },
  { title: 'ミツボシ☆☆★', difficulty: 0, type: 3, lv: 8 },
  { title: 'おねだりShall We ～？', difficulty: 0, type: 1, lv: 8 },
  { title: 'Twilight Sky', difficulty: 0, type: 2, lv: 7 },
  { title: 'DOKIDOKIリズム', difficulty: 0, type: 3, lv: 8 },
  { title: '風色メロディ', difficulty: 0, type: 1, lv: 6 },
  { title: 'ましゅまろ☆キッス', difficulty: 0, type: 3, lv: 8 },
  { title: 'あんずのうた', difficulty: 0, type: 1, lv: 9 },
  { title: '華蕾夢ミル狂詩曲 ～魂ノ導～', difficulty: 0, type: 2, lv: 6 },
  { title: 'ショコラ・ティアラ', difficulty: 0, type: 1, lv: 6 },
  { title: 'Star!!', difficulty: 0, type: 0, lv: 6 },
  { title: '夕映えプレゼント', difficulty: 0, type: 0, lv: 8 },
  { title: 'Memories', difficulty: 0, type: 2, lv: 6 },
  { title: '-LEGNE- 仇なす剣 光の旋律', difficulty: 0, type: 2, lv: 9 },
  { title: 'Happy×2 Days', difficulty: 0, type: 1, lv: 8 },
  { title: 'LET\'S GO HAPPY!!', difficulty: 0, type: 3, lv: 7 },
  { title: 'ØωØver!!', difficulty: 0, type: 1, lv: 8 },
  { title: 'できたて Evo! Revo! Generation!', difficulty: 0, type: 0, lv: 7 },
  { title: 'GOIN\'!!!', difficulty: 0, type: 0, lv: 9 },
  { title: 'Shine!!', difficulty: 0, type: 0, lv: 8 },
  { title: '夢色ハーモニー', difficulty: 0, type: 0, lv: 8 },
  { title: 'ススメ☆オトメ ～jewel parade～ (全タイプ)', difficulty: 0, type: 0, lv: 8 },
  { title: 'ススメ☆オトメ ～jewel parade～ (キュート)', difficulty: 0, type: 1, lv: 8 },
  { title: 'ススメ☆オトメ ～jewel parade～ (クール)', difficulty: 0, type: 2, lv: 8 },
  { title: 'ススメ☆オトメ ～jewel parade～ (パッション)', difficulty: 0, type: 3, lv: 8 },
  { title: 'アタシポンコツアンドロイド', difficulty: 0, type: 1, lv: 8 },
  { title: 'お願い！シンデレラ', difficulty: 1, type: 0, lv: 10 },
  { title: 'とどけ！アイドル', difficulty: 1, type: 0, lv: 11 },
  { title: '輝く世界の魔法', difficulty: 1, type: 0, lv: 13 },
  { title: 'We\'re the friends!', difficulty: 1, type: 0, lv: 12 },
  { title: 'メッセージ', difficulty: 1, type: 0, lv: 13 },
  { title: 'S(mile)ing!', difficulty: 1, type: 1, lv: 11 },
  { title: 'Never say never', difficulty: 1, type: 2, lv: 12 },
  { title: 'ミツボシ☆☆★', difficulty: 1, type: 3, lv: 12 },
  { title: 'おねだりShall We ～？', difficulty: 1, type: 1, lv: 13 },
  { title: 'Twilight Sky', difficulty: 1, type: 2, lv: 13 },
  { title: 'DOKIDOKIリズム', difficulty: 1, type: 3, lv: 13 },
  { title: '風色メロディ', difficulty: 1, type: 1, lv: 11 },
  { title: 'ましゅまろ☆キッス', difficulty: 1, type: 3, lv: 13 },
  { title: 'あんずのうた', difficulty: 1, type: 1, lv: 14 },
  { title: '華蕾夢ミル狂詩曲 ～魂ノ導～', difficulty: 1, type: 2, lv: 13 },
  { title: 'ショコラ・ティアラ', difficulty: 1, type: 1, lv: 13 },
  { title: 'Star!!', difficulty: 1, type: 0, lv: 12 },
  { title: '夕映えプレゼント', difficulty: 1, type: 0, lv: 14 },
  { title: 'Memories', difficulty: 1, type: 2, lv: 11 },
  { title: '-LEGNE- 仇なす剣 光の旋律', difficulty: 1, type: 2, lv: 14 },
  { title: 'Happy×2 Days', difficulty: 1, type: 1, lv: 13 },
  { title: 'LET\'S GO HAPPY!!', difficulty: 1, type: 3, lv: 13 },
  { title: 'ØωØver!!', difficulty: 1, type: 1, lv: 12 },
  { title: 'できたて Evo! Revo! Generation!', difficulty: 1, type: 0, lv: 11 },
  { title: 'GOIN\'!!!', difficulty: 1, type: 0, lv: 13 },
  { title: 'Shine!!', difficulty: 1, type: 0, lv: 14 },
  { title: '夢色ハーモニー', difficulty: 1, type: 0, lv: 14 },
  { title: 'ススメ☆オトメ ～jewel parade～ (全タイプ)', difficulty: 1, type: 0, lv: 13 },
  { title: 'ススメ☆オトメ ～jewel parade～ (キュート)', difficulty: 1, type: 1, lv: 13 },
  { title: 'ススメ☆オトメ ～jewel parade～ (クール)', difficulty: 1, type: 2, lv: 13 },
  { title: 'ススメ☆オトメ ～jewel parade～ (パッション)', difficulty: 1, type: 3, lv: 13 },
  { title: 'アタシポンコツアンドロイド', difficulty: 1, type: 1, lv: 12 },
  { title: 'お願い！シンデレラ', difficulty: 2, type: 0, lv: 15 },
  { title: 'とどけ！アイドル', difficulty: 2, type: 0, lv: 15 },
  { title: '輝く世界の魔法', difficulty: 2, type: 0, lv: 18 },
  { title: 'We\'re the friends!', difficulty: 2, type: 0, lv: 16 },
  { title: 'メッセージ', difficulty: 2, type: 0, lv: 16 },
  { title: 'S(mile)ing!', difficulty: 2, type: 1, lv: 15 },
  { title: 'Never say never', difficulty: 2, type: 2, lv: 17 },
  { title: 'ミツボシ☆☆★', difficulty: 2, type: 3, lv: 17 },
  { title: 'おねだりShall We ～？', difficulty: 2, type: 1, lv: 18 },
  { title: 'Twilight Sky', difficulty: 2, type: 2, lv: 18 },
  { title: 'DOKIDOKIリズム', difficulty: 2, type: 3, lv: 17 },
  { title: '風色メロディ', difficulty: 2, type: 1, lv: 16 },
  { title: 'ましゅまろ☆キッス', difficulty: 2, type: 3, lv: 18 },
  { title: 'あんずのうた', difficulty: 2, type: 1, lv: 19 },
  { title: '華蕾夢ミル狂詩曲 ～魂ノ導～', difficulty: 2, type: 2, lv: 18 },
  { title: 'ショコラ・ティアラ', difficulty: 2, type: 1, lv: 18 },
  { title: 'Star!!', difficulty: 2, type: 0, lv: 16 },
  { title: '夕映えプレゼント', difficulty: 2, type: 0, lv: 18 },
  { title: 'Memories', difficulty: 2, type: 2, lv: 16 },
  { title: '-LEGNE- 仇なす剣 光の旋律', difficulty: 2, type: 2, lv: 19 },
  { title: 'Happy×2 Days', difficulty: 2, type: 1, lv: 17 },
  { title: 'LET\'S GO HAPPY!!', difficulty: 2, type: 3, lv: 18 },
  { title: 'ØωØver!!', difficulty: 2, type: 1, lv: 17 },
  { title: 'できたて Evo! Revo! Generation!', difficulty: 2, type: 0, lv: 19 },
  { title: 'GOIN\'!!!', difficulty: 2, type: 0, lv: 17 },
  { title: 'Shine!!', difficulty: 2, type: 0, lv: 18 },
  { title: '夢色ハーモニー', difficulty: 2, type: 0, lv: 18 },
  { title: 'ススメ☆オトメ ～jewel parade～ (全タイプ)', difficulty: 2, type: 0, lv: 18 },
  { title: 'ススメ☆オトメ ～jewel parade～ (キュート)', difficulty: 2, type: 1, lv: 17 },
  { title: 'ススメ☆オトメ ～jewel parade～ (クール)', difficulty: 2, type: 2, lv: 17 },
  { title: 'ススメ☆オトメ ～jewel parade～ (パッション)', difficulty: 2, type: 3, lv: 17 },
  { title: 'アタシポンコツアンドロイド', difficulty: 2, type: 1, lv: 17 },
  { title: 'お願い！シンデレラ', difficulty: 3, type: 0, lv: 20 },
  { title: 'とどけ！アイドル', difficulty: 3, type: 0, lv: 21 },
  { title: '輝く世界の魔法', difficulty: 3, type: 0, lv: 25 },
  { title: 'We\'re the friends!', difficulty: 3, type: 0, lv: 22 },
  { title: 'メッセージ', difficulty: 3, type: 0, lv: 25 },
  { title: 'S(mile)ing!', difficulty: 3, type: 1, lv: 21 },
  { title: 'Never say never', difficulty: 3, type: 2, lv: 25 },
  { title: 'ミツボシ☆☆★', difficulty: 3, type: 3, lv: 24 },
  { title: 'おねだりShall We ～？', difficulty: 3, type: 1, lv: 25 },
  { title: 'Twilight Sky', difficulty: 3, type: 2, lv: 24 },
  { title: 'DOKIDOKIリズム', difficulty: 3, type: 3, lv: 24 },
  { title: '風色メロディ', difficulty: 3, type: 1, lv: 23 },
  { title: 'ましゅまろ☆キッス', difficulty: 3, type: 3, lv: 24 },
  { title: 'あんずのうた', difficulty: 3, type: 1, lv: 28 },
  { title: '華蕾夢ミル狂詩曲 ～魂ノ導～', difficulty: 3, type: 2, lv: 27 },
  { title: 'ショコラ・ティアラ', difficulty: 3, type: 1, lv: 26 },
  { title: 'Star!!', difficulty: 3, type: 0, lv: 25 },
  { title: '夕映えプレゼント', difficulty: 3, type: 0, lv: 26 },
  { title: 'Memories', difficulty: 3, type: 2, lv: 22 },
  { title: '-LEGNE- 仇なす剣 光の旋律', difficulty: 3, type: 2, lv: 28 },
  { title: 'Happy×2 Days', difficulty: 3, type: 1, lv: 23 },
  { title: 'LET\'S GO HAPPY!!', difficulty: 3, type: 3, lv: 27 },
  { title: 'ØωØver!!', difficulty: 3, type: 1, lv: 26 },
  { title: 'できたて Evo! Revo! Generation!', difficulty: 3, type: 0, lv: 26 },
  { title: 'GOIN\'!!!', difficulty: 3, type: 0, lv: 27 },
  { title: 'Shine!!', difficulty: 3, type: 0, lv: 25 },
  { title: '夢色ハーモニー', difficulty: 3, type: 0, lv: 26 },
  { title: 'ススメ☆オトメ ～jewel parade～ (全タイプ)', difficulty: 3, type: 0, lv: 25 },
  { title: 'ススメ☆オトメ ～jewel parade～ (キュート)', difficulty: 3, type: 1, lv: 24 },
  { title: 'ススメ☆オトメ ～jewel parade～ (クール)', difficulty: 3, type: 2, lv: 24 },
  { title: 'ススメ☆オトメ ～jewel parade～ (パッション)', difficulty: 3, type: 3, lv: 24 },
  { title: 'アタシポンコツアンドロイド', difficulty: 3, type: 1, lv: 26 }
]);

slStageSongsSearch.controller('MainController', ['$scope', '$localStorage', 'defaultSettings', 'songLv', 'songDifficulty', 'songType', 'songs', function($scope, $localStorage, defaultSettings, songLv, songDifficulty, songType, songs) {
  'use strict';

  // 絞り込み用のリストを作成
  function createFilterList() {
    // 重複を削除するfilter
    function removeDuplicateValues(element, index, self) {
      return self.indexOf(element) === index;
    }

    // 数値としてsortする関数
    function byNumber(a, b) {
      return a - b;
    }

    var songDifficultyList = [], songTypeList = [], songLvList,
        songStaminaList = [], songExpList = [], songAffectionList = [];

    Object.keys(songDifficulty).forEach(function(element) {
      if (isNaN(element)) {
        songDifficultyList.push({ label: element, value: songDifficulty[element] });
      }
    });

    Object.keys(songType).forEach(function(element) {
      if (isNaN(element)) {
        songTypeList.push({ label: element, value: songType[element] });
      }
    });

    songLvList = Object.keys(songLv);

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
  $scope.songs = songs;

  $scope.songFilter = function(song) {
    var result = true, i, name;

    name = [
      ['songFilterDifficulty', 'difficulty'],
      ['songFilterType',       'type'],
      ['songFilterLevel' ,     'lv']
    ];

    for (i = 0; i <name.length; i++) {
      if ($scope.$storage[name[i][0]] != null) {
        result = result && (song[name[i][1]] == $scope.$storage[name[i][0]]);
      }
    }

    name = [
      ['songFilterStamina'  , 'stamina'],
      ['songFilterExp'      , 'exp'],
      ['songFilterAffection', 'affection']
    ];

    for (i = 0; i <name.length; i++) {
      if ($scope.$storage[name[i][0]] > 0) {
        result = result && ($scope.songLv[song.lv][name[i][1]] == $scope.$storage[name[i][0]]);
      }
    }

    return result;
  };
}]);
