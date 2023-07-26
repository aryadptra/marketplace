CNVS.ViewportDetect = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-viewportdetect', event: 'pluginViewportDetectReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var observer = new IntersectionObserver( function(entries) {
				entries.forEach( function(entry) {
					var elTarget = entry.target;
					var elDelay = elTarget.getAttribute('data-delay') || 0;
					var elViewportClass = elTarget.getAttribute('data-viewport-class') || "";

					if( entry.isIntersecting ) {
						setTimeout( function() {
							elTarget.classList.add('is-in-viewport');
							elViewportClass.split(" ").forEach( function(_class) {
								_class && elTarget.classList.add(_class);
							});
						}, Number(elDelay));
					} else {
						elTarget.classList.remove('is-in-viewport');
						elViewportClass.split(" ").forEach( function(_class) {
							_class && elTarget.classList.remove(_class);
						});
					}
				});
			}, {
				threshold: 1.0,
			});

			selector.forEach( function(el) {
				observer.observe(el);
			});
		}
	};
}();
