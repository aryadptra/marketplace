CNVS.Parallax = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;
	var __mobile = SEMICOLON.Mobile;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.parallax.js', id: 'canvas-parallax-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof simpleParallax !== "undefined";
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-parallax', event: 'pluginParallaxReady' });

				selector = __core.getSelector( selector, false );
				if( selector.length < 1 ){
					return true;
				}

				var instances = [],
					i = 0;

				selector.forEach( function(el) {
					var speed = el.getAttribute('data-parallax-speed') || 0.4,
						scale = el.getAttribute('data-parallax-scale') || 1.25,
						overflow = el.getAttribute('data-parallax-overflow') || false,
						maxTrans = el.getAttribute('data-parallax-max-transition') || 0,
						mobile = el.getAttribute('data-mobile') || 'false',
						direction = el.getAttribute('data-direction') || 'up';

					if( overflow == "true" ) {
						overflow = true;
					}

					if( __mobile.any() && mobile == 'false' ) {
						el.classList.add('mobile-parallax');
					} else {
						instances[i] = new simpleParallax(el, {
							orientation: direction,
							scale: Number(scale),
							overflow: overflow,
							delay: Number(speed),
							maxTransition: Number(maxTrans)
						});
					}

					i++;
				});

				__core.getVars.resizers.parallax = function() {
					__modules.parallax();
				};
			});
		}
	};
}();
