/* jshint indent: 2, jquery: true */

(function($){
  'use strict';

  $.fn.closeButton = function() {
    return this.each(function() {
      var $this = $(this);

      $this.click(function(e) {
        var selector = $this.data('target');

        if (!selector) return;

        var target = $(selector);

        if (e) e.preventDefault();

        target.trigger(e = $.Event('close'));

        if (e.isDefaultPrevented()) return;

        target.trigger('closed').hide();
      });
    });
  };
})(jQuery);
