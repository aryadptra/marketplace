CNVS.SliderDimensions = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var slider = document.querySelector('.slider-element'),
				sliderParallaxEl = document.querySelector('.slider-parallax'),
				body = __core.getVars.elBody,
				parallaxElHeight = sliderParallaxEl?.offsetHeight,
				parallaxElWidth = sliderParallaxEl?.offsetWidth,
				slInner = sliderParallaxEl?.querySelector('.slider-inner'),
				slSwiperW = slider.querySelector('.swiper-wrapper'),
				slSwiperS = slider.querySelector('.swiper-slide'),
				slFlexHeight = slider.classList.contains('h-auto') || slider.classList.contains('min-vh-0');

			if( body.classList.contains('device-up-lg') ) {
				setTimeout(function() {
					if( slInner ) {
						slInner.style.height = parallaxElHeight + 'px';
					}
					if( slFlexHeight ) {
						parallaxElHeight = slider.querySelector('.slider-inner')?.querySelector('*').offsetHeight;
						slider.style.height = parallaxElHeight + 'px';
						if( slInner ) {
							slInner.style.height = parallaxElHeight + 'px';
						}
					}
				}, 500);

				if( slFlexHeight && slSwiperS ) {
					var slSwiperFC = slSwiperS.querySelector('*');
					if( slSwiperFC.classList.contains('container') || slSwiperFC.classList.contains('container-fluid') ) {
						slSwiperFC = slSwiperFC.querySelector('*');
					}
					if( slSwiperFC.offsetHeight > slSwiperW.offsetHeight ) {
						slSwiperW.style.height = 'auto';
					}
				}

				if( body.classList.contains('side-header') && slInner ) {
					slInner.style.width = parallaxElWidth + 'px';
				}

				if( !body.classList.contains('stretched') ) {
					parallaxElWidth = __core.getVars.elWrapper.offsetWidth;
					if( slInner ) {
						slInner.style.width = parallaxElWidth + 'px';
					}
				}
			} else {
				if( slSwiperW ) {
					slSwiperW.style.height = '';
				}

				if( sliderParallaxEl ) {
					sliderParallaxEl.style.height = '';
				}

				if( slInner ) {
					slInner.style.width = '';
					slInner.style.height = '';
				}
			}

			__core.getVars.resizers.sliderdimensions = function() {
				__base.sliderDimensions();
			};
		}
	};
}();
