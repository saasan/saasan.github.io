(function(){
  function initGoogleAnalytics() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-42938817-1', 'saasan.github.io');
    ga('send', 'pageview');
  }
  
  function initGoogleAdSense() {
    if (!window.adsbygoogle) window.adsbygoogle = [];
    var i = document.getElementsByClassName('adsbygoogle').length;
    while (i-- > 0) {
      window.adsbygoogle.push({});
    }
  }
  
  window.addEventListener('load', function(){
    initGoogleAnalytics();
    initGoogleAdSense();
  }, false);
})();
