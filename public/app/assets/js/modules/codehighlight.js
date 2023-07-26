CNVS.CodeHighlight = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadCSS({ file: 'components/prism.css', id: 'canvas-prism-css', cssFolder: true });
			__core.loadJS({ file: 'plugins.prism.js', id: 'canvas-prism-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof Prism !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-codehighlight', event: 'pluginCodeHighlightReady' });

				selector = __core.getSelector( selector, false );
				if( selector.length < 1 ){
					return true;
				}

				selector.forEach( function(el) {
					Prism.highlightElement( el.querySelector('code') );
				});
			});
		}
	};
}();
