CNVS.ResizeVideos = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.fitvids.js', id: 'canvas-fitvids-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().fitVids;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-fitvids', event: 'pluginFitVidsReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.parent().fitVids({
					customSelector: 'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]',
					ignore: '.no-fv'
				});
			});
		}
	};
}();
