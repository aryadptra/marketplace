CNVS.Logo = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var head = __core.getVars.elHead,
				style,
				css;

			if( selector[0].querySelector('.logo-dark') ) {
				style = document.createElement('style');
				head.appendChild(style);
				css = '.dark #header-wrap:not(.not-dark) #logo [class^="logo-"], .dark .header-row:not(.not-dark) #logo [class^="logo-"] { display: none; } .dark #header-wrap:not(.not-dark) #logo .logo-dark, .dark .header-row:not(.not-dark) #logo .logo-dark { display: flex; }';
				style.appendChild(document.createTextNode(css));
			}

			if( selector[0].querySelector('.logo-sticky') ) {
				style = document.createElement('style');
				head.appendChild(style);
				css = '.sticky-header #logo [class^="logo-"] { display: none; } .sticky-header #logo .logo-sticky { display: flex; }';
				style.appendChild(document.createTextNode(css));
			}

			if( selector[0].querySelector('.logo-sticky-shrink') ) {
				style = document.createElement('style');
				head.appendChild(style);
				css = '.sticky-header-shrink #logo [class^="logo-"] { display: none; } .sticky-header-shrink #logo .logo-sticky-shrink { display: flex; }';
				style.appendChild(document.createTextNode(css));
			}

			if( selector[0].querySelector('.logo-mobile') ) {
				style = document.createElement('style');
				head.appendChild(style);
				css = 'body:not(.is-expanded-menu) #logo [class^="logo-"] { display: none; } body:not(.is-expanded-menu) #logo .logo-mobile { display: flex; }';
				style.appendChild(document.createTextNode(css));
			}
		}
	};
}();
