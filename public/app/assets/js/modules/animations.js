CNVS.Animations = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-animations', event: 'pluginAnimationsReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var SELECTOR = '[data-animate]',
				ANIMATE_CLASS_NAME = 'animated';

			var isAnimated = function(element) {
				element.classList.contains(ANIMATE_CLASS_NAME);
			};

			var intersectionObserver = new IntersectionObserver(
				function(entries, observer) {
					entries.forEach( function(entry) {
						var element = entry.target,
							elAnimation = element.getAttribute('data-animate'),
							elAnimOut = element.getAttribute('data-animate-out'),
							elAnimDelay = element.getAttribute('data-delay'),
							elAnimDelayOut = element.getAttribute('data-delay-out'),
							elAnimDelayTime = 0,
							elAnimDelayOutTime = 3000,
							elAnimations = elAnimation.split(' ');

						if( element.closest('.fslider.no-thumbs-animate') ) {
							return true;
						}

						if( element.closest('.swiper-slide') ) {
							return true;
						}

						if( elAnimDelay ) {
							elAnimDelayTime = Number( elAnimDelay ) + 500;
						} else {
							elAnimDelayTime = 500;
						}

						if( elAnimOut && elAnimDelayOut ) {
							elAnimDelayOutTime = Number( elAnimDelayOut ) + elAnimDelayTime;
						}

						if( !element.classList.contains('animated') ) {
							element.classList.add('not-animated');
							if( entry.intersectionRatio > 0 ) {
								setTimeout( function() {
									element.classList.remove('not-animated');
									elAnimations.forEach( function(item) {
										element.classList.add(item);
									});
									element.classList.add('animated');
								}, elAnimDelayTime);

								if( elAnimOut ) {
									setTimeout( function() {
										elAnimations.forEach( function(item) {
											element.classList.remove(item);
										});

										elAnimOut.split(' ').forEach( function(item) {
											element.classList.add(item);
										});
									}, elAnimDelayOutTime);
								}
							}
						}

						if( !element.classList.contains('not-animated') ) {
							observer.unobserve(element);
						}
					});
				}
			);

			var elements = [].filter.call(document.querySelectorAll(SELECTOR), function(element) {
				return !isAnimated(element, ANIMATE_CLASS_NAME);
			});

			elements.forEach( function(element) {
				return intersectionObserver.observe(element);
			});
		}
	};
}();
