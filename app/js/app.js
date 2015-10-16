'use strict';

var sGridWebsite = (function (document, $, hljs) {

	var _headerScroll = function () {
		var $window = $(window);
		var $stickyHeader = $('.js-sticky-header');
		var $arrow = $('.js-animated-arrow');
		$window.on('scroll', function () {
			if ($window.scrollTop() > 150 && !$stickyHeader.hasClass('scrolled')) {
				$arrow.hide();
				$stickyHeader.addClass('scrolled');
			}
			if ($window.scrollTop() <= 150 && $stickyHeader.hasClass('scrolled')) {
				$arrow.show();
				$stickyHeader.removeClass('scrolled');
			}
		});
	};

	var _init = function () {
		_headerScroll();
		$('pre code').each(function (i, block) {
			hljs.highlightBlock(block);
		});
	};

	return {
		init: _init
	};

})(document, jQuery, hljs);

// sGridWebsite init
(function () {
	sGridWebsite.init();
})();