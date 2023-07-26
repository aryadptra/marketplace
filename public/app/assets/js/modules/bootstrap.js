CNVS.Bootstrap = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			__core.loadJS({ file: 'plugins.bootstrap.js', id: 'canvas-bootstrap-js', jsFolder: true });
			__core.isFuncTrue( function() {
				return typeof bootstrap !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-bootstrap', event: 'pluginBootstrapReady' });
			});
		}
	};
}();
