CNVS.Easing = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			__core.loadJS({ file: 'plugins.easing.js', id: 'canvas-easing-js', jsFolder: true });
			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && typeof jQuery.easing["easeOutQuad"] !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-easing', event: 'pluginEasingReady' });
			});
		}
	};
}();
