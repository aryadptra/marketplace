CNVS.GoToTop = function() {
	var __core = SEMICOLON.Core;

	var _init = function(element) {
		var elSpeed = element.getAttribute('data-speed') || 700,
			elEasing = element.getAttribute('data-easing');

		element.onclick = function(e) {
			if( elEasing ) {
				jQuery('body,html').stop(true).animate({
					'scrollTop': 0
				}, Number( elSpeed ), elEasing );
			} else {
				window.scrollTo({
					top: 0,
					behavior: 'smooth'
				});
			}

			e.preventDefault();
		};
	};

	var _scroll = function(element) {
		var body = __core.getVars.elBody.classList;

		var elMobile = element.getAttribute('data-mobile') || 'false',
			elOffset = element.getAttribute('data-offset') || 450;

		if( elMobile == 'false' && ( body.contains('device-xs') || body.contains('device-sm') || body.contains('device-md') ) ) {
			return true;
		}

		if( window.scrollY > Number(elOffset) ) {
			body.add('gototop-active');
		} else {
			body.remove('gototop-active');
		}
	};

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			_init(selector[0]);
			_scroll(selector[0]);

			window.addEventListener('scroll', function(){
				_scroll( selector[0] );
			});
		}
	};
}();
