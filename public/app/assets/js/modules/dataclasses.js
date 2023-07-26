CNVS.DataClasses = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-dataclasses', event: 'pluginDataClassesReady' });

			selector = __core.getSelector( selector, false, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(el) {
				var classes = el.getAttribute('data-class');

				classes = classes.split(/ +/);
				if( classes.length > 0 ) {
					classes.forEach( function(_class) {
						var deviceClass = _class.split(":");
						if( __core.getVars.elBody.classList.contains(deviceClass[0] == 'dark' ? deviceClass[0] : 'device-' + deviceClass[0]) ) {
							el.classList.add(deviceClass[1]);
						} else {
							el.classList.remove(deviceClass[1]);
						}
					});
				}
			});

			__core.getVars.resizers.dataClasses = function() {
				setTimeout( function() {
					__modules.dataClasses();
				}, 333);
			};
		}
	};
}();
