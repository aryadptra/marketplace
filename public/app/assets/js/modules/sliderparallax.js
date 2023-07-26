CNVS.SliderParallax = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;
	var __mobile = SEMICOLON.Mobile;

	var _animationFrame = function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
										|| window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	};

	var _parallax = function(settings) {
		if( !settings.sliderPx.el ) {
			return true;
		}

		var el = settings.sliderPx.el,
			elHeight = el.offsetHeight,
			elClasses = el.classList,
			transform, transform2;

		settings.scrollPos.y = window.pageYOffset;

		if( settings.body.classList.contains('device-up-lg') && !settings.isMobile ) {
			if( ( elHeight + settings.sliderPx.offset + 50 ) > settings.scrollPos.y ){
				elClasses.add('slider-parallax-visible');
				elClasses.remove('slider-parallax-invisible');
				if ( settings.scrollPos.y > settings.sliderPx.offset ) {
					if( typeof el.querySelector('.slider-inner') === 'object' ) {

						transform = ((settings.scrollPos.y-settings.sliderPx.offset) * -.4);
						transform2 = ((settings.scrollPos.y-settings.sliderPx.offset) * -.15);

						_setParallax(0, transform, settings.sliderPx.inner);
						_setParallax(0, transform2, settings.sliderPx.caption);
					} else {
						transform = ((settings.scrollPos.y-settings.sliderPx.offset) / 1.5);
						transform2 = ((settings.scrollPos.y-settings.sliderPx.offset) / 7);

						_setParallax(0, transform, el);
						_setParallax(0, transform2, settings.sliderPx.caption);
					}
				} else {
					if( el.querySelector('.slider-inner') ) {
						_setParallax(0, 0, settings.sliderPx.inner);
						_setParallax(0, 0, settings.sliderPx.caption);
					} else {
						_setParallax(0, 0, el);
						_setParallax(0, 0, settings.sliderPx.caption);
					}
				}
			} else {
				elClasses.add('slider-parallax-invisible');
				elClasses.remove('slider-parallax-visible');
			}

			requestAnimationFrame( function(){
				_parallax(settings);
			});
		} else {
			if( el.querySelector('.slider-inner') ) {
				_setParallax(0, 0, settings.sliderPx.inner);
				_setParallax(0, 0, settings.sliderPx.caption);
			} else {
				_setParallax(0, 0, el);
				_setParallax(0, 0, settings.sliderPx.caption);
			}

			elClasses.add('slider-parallax-visible');
			elClasses.remove('slider-parallax-invisible');
		}
	};

	var _offset = function() {
		var sliderPx = __core.getVars.sliderParallax;

		var sliderParallaxOffsetTop = 0,
			headerHeight = __core.getVars.elHeader?.offsetHeight || 0;

		if( __core.getVars.elBody.classList.contains('side-header') || (__core.getVars.elHeader && __core.getNext(__core.getVars.elHeader, '.include-header').length > 0) ) {
			headerHeight = 0;
		}

		// if( $pageTitle.length > 0 ) {
		// 	sliderParallaxOffsetTop = $pageTitle.outerHeight() + headerHeight - 20;
		// } else {
		// 	sliderParallaxOffsetTop = headerHeight - 20;
		// }

		if( __core.getNext(__core.getVars.elSlider, '#header').length > 0 ) {
			sliderParallaxOffsetTop = 0;
		}

		sliderPx.offset = sliderParallaxOffsetTop;
	};

	var _setParallax = function(xPos, yPos, el) {
		if( el ) {
			el.style.transform = "translate3d(" + xPos + ", " + yPos + "px, 0)";
		}
	};

	var _elementFade = function(settings) {
		if( settings.sliderPx.el.length < 1 ) {
			return true;
		}

		if( settings.body.classList.contains('device-up-lg') && !settings.isMobile ) {
			var elHeight = settings.sliderPx.el.offsetHeight,
				tHeaderOffset;

			if( (settings.header && settings.header.classList.contains('transparent-header')) || settings.body.classList.contains('side-header') ) {
				tHeaderOffset = 100;
			} else {
				tHeaderOffset = 0;
			}

			if( settings.sliderPx.el.classList.contains('slider-parallax-visible') ) {
				settings.sliderPx.el.querySelectorAll('.slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade').forEach( function(el) {
					el.style.opacity = 1 - ( ( ( settings.scrollPos.y - tHeaderOffset ) * 1.85 ) / elHeight );
				});
			}
		} else {
			settings.sliderPx.el.querySelectorAll('.slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade').forEach( function(el) {
				el.style.opacity = 1;
			});
		}
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			_animationFrame();
			var pxSettings = {
				sliderPx: __core.getVars.sliderParallax,
				body: __core.getVars.elBody,
				header: __core.getVars.elHeader,
				scrollPos: __core.getVars.scrollPos,
				isMobile: __mobile.any(),
			};

			if( pxSettings.sliderPx.el.querySelector('.slider-inner') ) {
				_setParallax(0, 0, pxSettings.sliderPx.inner);
				_setParallax(0, 0, pxSettings.sliderPx.caption);
			} else {
				_setParallax(0, 0, pxSettings.sliderPx.el);
				_setParallax(0, 0, pxSettings.sliderPx.caption);
			}

			window.addEventListener('scroll', function(){
				_parallax(pxSettings);
				_elementFade(pxSettings);
			});

			__core.getVars.resizers.sliderparallax = function() {
				__modules.sliderParallax();
			};
		}
	};
}();
