CNVS.HoverAnimations = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-hoveranimation', event: 'pluginHoverAnimationReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(element) {
				var elAnimate = element.getAttribute( 'data-hover-animate' ),
					elAnimateOut = element.getAttribute( 'data-hover-animate-out' ) || 'fadeOut',
					elSpeed = element.getAttribute( 'data-hover-speed' ) || 600,
					elDelay = element.getAttribute( 'data-hover-delay' ),
					elParent = element.getAttribute( 'data-hover-parent' ),
					elReset = element.getAttribute( 'data-hover-reset' ) || 'false',
					elMobile = element.getAttribute( 'data-hover-mobile' ) || 'true';

				if( elMobile != 'true' ) {
					if( elMobile == 'false' ) {
						if( !__core.getVars.elBody.classList.contains('device-up-lg') ) {
							return true;
						}
					} else {
						if( !__core.getVars.elBody.classList.contains('device-up-' + elMobile) ) {
							return true;
						}
					}
				}

				element.classList.add( 'not-animated' );

				if( !elParent ) {
					if( element.closest( '.bg-overlay' ) ) {
						elParent = element.closest( '.bg-overlay' );
					} else {
						elParent = element;
					}
				} else {
					if( elParent == 'self' ) {
						elParent = element;
					} else {
						elParent = element.closest( elParent );
					}
				}

				var elDelayT = 0;

				if( elDelay ) {
					elDelayT = Number( elDelay );
				}

				if( elSpeed ) {
					element.style.animationDuration = Number( elSpeed ) + 'ms';
				}

				var t, x;

				elParent.addEventListener( 'mouseover', function() {
					clearTimeout(x);

					t = setTimeout( function() {
						element.classList.add( 'not-animated' );

						(elAnimateOut + ' not-animated').split(" ").forEach( function(_class) {
							element.classList.remove(_class);
						});

						(elAnimate + ' animated').split(" ").forEach( function(_class) {
							element.classList.add(_class);
						});
					}, elDelayT );
				}, false);

				elParent.addEventListener( 'mouseleave', function() {
					element.classList.add( 'not-animated' );

					(elAnimate + ' not-animated').split(" ").forEach( function(_class) {
						element.classList.remove(_class);
					});

					(elAnimateOut + ' animated').split(" ").forEach( function(_class) {
						element.classList.add(_class);
					});

					if( elReset == 'true' ) {
						x = setTimeout( function() {
							(elAnimateOut + ' animated').split(" ").forEach( function(_class) {
								element.classList.remove(_class);
							});

							element.classList.add( 'not-animated' );
						}, Number( elSpeed ) );
					}

					clearTimeout(t);
				}, false);
			});
		}
	};
}();
