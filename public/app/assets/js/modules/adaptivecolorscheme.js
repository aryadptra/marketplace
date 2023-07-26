CNVS.AdaptiveColorScheme = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-adaptivecolorscheme', event: 'pluginAdaptiveColorSchemeReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var adaptiveEl = document.querySelector('[data-adaptive-light-class],[data-adaptive-dark-class]');
			var adaptLightClass;
			var adaptDarkClass;

			if( __core.getVars.elBody.contains(adaptiveEl) ) {
				adaptLightClass = adaptiveEl.getAttribute( 'data-adaptive-light-class' );
				adaptDarkClass = adaptiveEl.getAttribute( 'data-adaptive-dark-class' );
			}

			var adaptClasses = function(dark) {
				if( dark ) {
					__core.getVars.elBody.classList.add( 'dark' );
				} else {
					__core.getVars.elBody.classList.remove('dark');
				}

				if( __core.getVars.elBody.contains(adaptiveEl) ) {
					if( dark ) {
						adaptiveEl.classList.remove( adaptLightClass );
						adaptiveEl.classList.add( adaptDarkClass );
					} else {
						adaptiveEl.classList.remove( adaptDarkClass );
						adaptiveEl.classList.add( adaptLightClass );
					}
				}

				__base.setBSTheme();
			};

			if( window.matchMedia ) {
				adaptClasses( window.matchMedia('(prefers-color-scheme: dark)').matches );

				window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
					adaptClasses( e.matches );
				});
			}
		}
	};
}();
