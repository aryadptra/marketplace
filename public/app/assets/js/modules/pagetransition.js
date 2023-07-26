CNVS.PageTransition = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			var body = __core.getVars.elBody;

			__core.initFunction({ class: 'has-plugin-pagetransition', event: 'pluginPageTransitionReady' });

			if( body.classList.contains('no-transition') ) {
				return true;
			}

			if( !body.classList.contains('page-transition') ) {
				body.classList.add('page-transition');
			}

			window.onpageshow = function(event) {
				if(event.persisted) {
					window.location.reload();
				}
			};

			var pageTransition = document.querySelector('.page-transition-wrap');

			var elAnimIn = body.getAttribute('data-animation-in') || 'fadeIn',
				elSpeedIn = body.getAttribute('data-speed-in') || 1000,
				elTimeoutActive = false,
				elTimeout = body.getAttribute('data-loader-timeout'),
				elLoader = body.getAttribute('data-loader'),
				elLoaderColor = body.getAttribute('data-loader-color'),
				elLoaderHtml = body.getAttribute('data-loader-html'),
				elLoaderAppend = '',
				elLoaderCSSVar = '';

			if( !elTimeout ) {
				elTimeoutActive = false;
				elTimeout = false;
			} else {
				elTimeoutActive = true;
				elTimeout = Number(elTimeout);
			}

			if( elLoaderColor ) {
				if( elLoaderColor == 'theme' ) {
					elLoaderCSSVar = ' style="--cnvs-loader-color:var(--cnvs-themecolor);"';
				} else {
					elLoaderCSSVar = ' style="--cnvs-loader-color:'+elLoaderColor+';"';
				}
			}

			var elLoaderBefore = '<div class="css3-spinner"'+elLoaderCSSVar+'>',
				elLoaderAfter = '</div>';

			if( elLoader == '2' ) {
				elLoaderAppend = '<div class="css3-spinner-flipper"></div>';
			} else if( elLoader == '3' ) {
				elLoaderAppend = '<div class="css3-spinner-double-bounce1"></div><div class="css3-spinner-double-bounce2"></div>';
			} else if( elLoader == '4' ) {
				elLoaderAppend = '<div class="css3-spinner-rect1"></div><div class="css3-spinner-rect2"></div><div class="css3-spinner-rect3"></div><div class="css3-spinner-rect4"></div><div class="css3-spinner-rect5"></div>';
			} else if( elLoader == '5' ) {
				elLoaderAppend = '<div class="css3-spinner-cube1"></div><div class="css3-spinner-cube2"></div>';
			} else if( elLoader == '6' ) {
				elLoaderAppend = '<div class="css3-spinner-scaler"></div>';
			} else if( elLoader == '7' ) {
				elLoaderAppend = '<div class="css3-spinner-grid-pulse"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
			} else if( elLoader == '8' ) {
				elLoaderAppend = '<div class="css3-spinner-clip-rotate"><div></div></div>';
			} else if( elLoader == '9' ) {
				elLoaderAppend = '<div class="css3-spinner-ball-rotate"><div></div><div></div><div></div></div>';
			} else if( elLoader == '10' ) {
				elLoaderAppend = '<div class="css3-spinner-zig-zag"><div></div><div></div></div>';
			} else if( elLoader == '11' ) {
				elLoaderAppend = '<div class="css3-spinner-triangle-path"><div></div><div></div><div></div></div>';
			} else if( elLoader == '12' ) {
				elLoaderAppend = '<div class="css3-spinner-ball-scale-multiple"><div></div><div></div><div></div></div>';
			} else if( elLoader == '13' ) {
				elLoaderAppend = '<div class="css3-spinner-ball-pulse-sync"><div></div><div></div><div></div></div>';
			} else if( elLoader == '14' ) {
				elLoaderAppend = '<div class="css3-spinner-scale-ripple"><div></div><div></div><div></div></div>';
			} else {
				elLoaderAppend = '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>';
			}

			if( !elLoaderHtml ) {
				elLoaderHtml = elLoaderAppend;
			}

			elLoaderHtml = elLoaderBefore + elLoaderHtml + elLoaderAfter;

			if( elAnimIn == 'fadeIn' ) {
				__core.getVars.elWrapper.classList.add('op-1');
			} else {
				__core.getVars.elWrapper.classList.add('not-animated');
			}

			if( !pageTransition ) {
				var divPT = document.createElement('div');
				divPT.classList.add('page-transition-wrap');
				divPT.innerHTML = elLoaderHtml;
				body.prepend( divPT );
				pageTransition = document.querySelector('.page-transition-wrap');
			}

			if( elSpeedIn ) {
				__core.getVars.elWrapper.style.setProperty('--cnvs-animate-duration', Number(elSpeedIn)+'ms');
				if( elAnimIn == 'fadeIn' ) {
					pageTransition.style.setProperty('--cnvs-animate-duration', Number(elSpeedIn)+'ms');
				}
			}

			var endPageTransition = function() {
				elAnimIn.split(" ").forEach( function(_class) {
					pageTransition.classList.remove(_class);
				});

				pageTransition.classList.add('fadeOut', 'animated');

				var removePageTransition = function() {
					pageTransition.remove();
					if( elAnimIn != 'fadeIn' ) {
						__core.getVars.elWrapper.classList.remove('not-animated');
						(elAnimIn + ' animated').split(" ").forEach(function(_class) {
							__core.getVars.elWrapper.classList.add(_class);
						});
					}
				};

				var displayContent = function() {
					body.classList.remove('page-transition');

					setTimeout(function() {
						(elAnimIn + ' animated').split(" ").forEach( function(_class) {
							__core.getVars.elWrapper.classList.remove(_class);
						});
					}, 333);

					setTimeout(function() {
						__core.getVars.elWrapper.style.removeProperty('--cnvs-animate-duration');
					}, 666);
				};

				pageTransition.addEventListener('transitionend', removePageTransition);
				pageTransition.addEventListener('animationend', removePageTransition);
				__core.getVars.elWrapper.addEventListener('transitionend', displayContent);
				__core.getVars.elWrapper.addEventListener('animationend', displayContent);

				return true;
			};

			if( document.readyState === 'complete' ) {
				endPageTransition();
			}

			if( elTimeoutActive ) {
				setTimeout( endPageTransition, elTimeout );
			}

			window.addEventListener('load', function(){
				endPageTransition();
			});
		}
	};
}();
