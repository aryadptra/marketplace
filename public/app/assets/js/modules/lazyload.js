CNVS.LazyLoad = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.lazyload.js', id: 'canvas-lazyload-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof LazyLoad !== "undefined"
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-lazyload', event: 'pluginlazyLoadReady' });

				window.lazyLoadInstance = new LazyLoad({
					threshold: 150,
					elements_selector: '.lazy:not(.lazy-loaded)',
					class_loading: 'lazy-loading',
					class_loaded: 'lazy-loaded',
					class_error: 'lazy-error',
					callback_loaded: function(el) {
						__core.addEvent( window, 'lazyLoadLoaded' );
						if( el.parentNode.getAttribute('data-lazy-container') == 'true' ) {
							__core.runContainerModules( el.parentNode );
						}
						__modules.parallax();
					}
				});
			});
		}
	};
}();
