// ==UserScript==
// @name        pixiv Tags
// @description 設定したタグをpixiv内に常時表示する
// @namespace   http://saasan.github.io/
// @include     http://www.pixiv.net/*
// @require     http://github.com/sizzlemctwizzle/GM_config/raw/master/gm_config.js
// @author      s2works
// @version     1.01
// ==/UserScript==

(function(){

const SCRIPT_NAME = 'pixiv Tags';

function setStyle() {
  var style;

  style = '\
    #pixivTags\
    {\
      position : fixed;\
      left : 10px;\
      top : 10px;\
      width : 8em;\
      height : 2em;\
      background-color : #FFF;\
      border: 1px solid #D6DEE5;\
      border-radius: 5px 5px 5px 5px;\
      padding : 5px;\
      line-height : 1.7em;\
      z-index : 100;\
      overflow : hidden;\
      opacity : 0.8;\
    }\
\
    #pixivTags li\
    {\
      display : none;\
    }\
\
    #pixivTags:hover\
    {\
      width : 300px;\
      height : 100%;\
      opacity : 1;\
    }\
\
    #pixivTags:hover li\
    {\
      display : inline-block;\
    }\
\
    @media screen and (min-width : 1450px) {\
      #pixivTags, #pixivTags:hover\
      {\
        width : 200px;\
        height : 100%;\
        opacity : 1;\
      }\
\
      #pixivTags li\
      {\
        display : inline-block;\
      }\
    }\
\
    @media screen and (min-width : 1550px) {\
      #pixivTags, #pixivTags:hover\
      {\
        width : 250px;\
      }\
    }\
\
    @media screen and (min-width : 1650px) {\
      #pixivTags, #pixivTags:hover\
      {\
        width : 300px;\
      }\
    }\
\
    @media screen and (min-width : 1750px) {\
      #pixivTags, #pixivTags:hover\
      {\
        width : 350px;\
      }\
    }\
\
    @media screen and (min-width : 1850px) {\
      #pixivTags, #pixivTags:hover\
      {\
        width : 400px;\
      }\
    }\
\
    @media screen and (min-width : 1920px) {\
      #pixivTags, #pixivTags:hover\
      {\
        width : 435px;\
      }\
    }\
  ';

  GM_addStyle(style);
}

function optimizeTags() {
  var tags = GM_config.get('tags');
  tags = tags.replace(/[ 　\t]+/g, ' ');
  tags = tags.replace(/\n+/g, '\n');
  tags = tags.replace(/^\n|\n$/g, '');
  GM_config.set('tags', tags);
  GM_config.write();
}

function generateHTML() {
  optimizeTags();

  var ul = document.createElement('ul');
  ul.className = 'tags';

  var tags = GM_config.get('tags');
  tags = tags.split('\n');

  for (var i = 0; i < tags.length; i++) {
    if (!tags[i].length) continue;

    var encodedTag = encodeURI(tags[i].replace(/ /g, '+'));
    var url = '/search.php?s_mode=s_tag' + (tags[i].indexOf(' ') < 0 ? '_full' : '') + '&word=';

    var li = document.createElement('li');
    li.className = 'tag';

    var portal = document.createElement('a');
    portal.className = 'portal';
    portal.href = url + encodedTag;
    portal.appendChild(document.createTextNode('c'));

    var a = document.createElement('a');
    a.className = 'text';
    a.href = url + encodedTag;
    a.appendChild(document.createTextNode(tags[i]));

    li.appendChild(portal);
    li.appendChild(a);

    ul.appendChild(li);
    ul.appendChild(document.createTextNode(' '));
  }

  var div = document.createElement('div');
  div.innerHTML = '<h1 class="unit-title">' + SCRIPT_NAME + '</h1>';
  div.appendChild(ul);

  return div.innerHTML;
}

function updateHTML(html) {
  var id = SCRIPT_NAME.replace(/ /g, '');

  var parentNode = document.getElementById('wrapper');
  if (parentNode == null) return; // null or undefined

  var div = document.getElementById(id);
  if (div == null) { // null or undefined
    div = document.createElement('div');
    div.id = id;
    parentNode.appendChild(div);
  }

  div.innerHTML = html;
}

function addTag() {
  var url = location.href;
  if (!/^http:\/\/www\.pixiv\.net\/(search|tags)\.php\?/.test(url)) {
    alert('検索結果を表示した状態で実行して下さい。');
    return;
  }

  var word = url.replace(/^.*[\?&](word|tag)=([^&=\?]+).*$/, '$2');
  word = decodeURIComponent(word.replace(/\+/g, ' '));
  var tags = GM_config.get('tags');
  tags += '\n' + word;
  GM_config.set('tags', tags);
  GM_config.write();
  updateHTML(generateHTML());

  alert('「' + word + '」を追加しました。');
}

GM_config.init(
  SCRIPT_NAME,
  {
    tags :
    {
      section : ['タグ(各タグは改行で分ける)'],
      type : 'textarea',
      cols : 60,
      rows : 20,
      default : 'Greasemonkeyの「ユーザスクリプトコマンド」でタグを設定できます。\nタグは1行に1つ書いて下さい。\nAND/OR検索もできます。\n\n↓例↓\nオリジナル\nなにこれかわいい\n俺の 黒猫\nパチュリー OR パチェ'
    }
  },
  '#GM_config_field_tags{ width : 100%; }',
  {
    save : function() {
      GM_config.close();
      updateHTML(generateHTML());
    }
  }
);

setStyle();
updateHTML(generateHTML());
GM_registerMenuCommand(SCRIPT_NAME + ' - 設定', function(){ GM_config.open(); });
GM_registerMenuCommand(SCRIPT_NAME + ' - 現在表示中のタグを追加', function(){  addTag(); });

})();
