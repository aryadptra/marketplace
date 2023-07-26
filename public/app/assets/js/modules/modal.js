CNVS.Modal = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			var hasCookies = false;
			__core.getSelector( selector, false ).forEach( function(el) {
				if( el.hasAttribute('data-cookies') ) {
					hasCookies = true;
					return true;
				}
			});

			var checkCookies = function() {
				if( hasCookies ) {
					if( typeof Cookies !== "undefined" ) {
						return true;
					}

					return false;
				} else {
					return true;
				}
			};

			__core.loadJS({ file: 'plugins.lightbox.js', id: 'canvas-lightbox-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().magnificPopup && checkCookies;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-modal', event: 'pluginModalReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				var closeButtonIcon = '<i class="bi-x-lg"></i>';

				selector.each( function(){
					var element = jQuery(this),
						elTarget = element.attr('data-target'),
						elTargetValue = elTarget.split('#')[1],
						elDelay = element.attr('data-delay') || 500,
						elTimeout = element.attr('data-timeout'),
						elAnimateIn = element.attr('data-animate-in'),
						elAnimateOut = element.attr('data-animate-out'),
						elBgClick = element.attr('data-bg-click'),
						elCloseBtn = element.attr('data-close-btn'),
						elCookies = element.attr('data-cookies'),
						elCookiePath = element.attr('data-cookie-path'),
						elCookieExp = element.attr('data-cookie-expire');

					if( elCookies == "false" ) {
						Cookies.remove( elTargetValue );
					}

					if( elCookies == 'true' ) {
						var elementCookie = Cookies.get( elTargetValue );

						if( typeof elementCookie !== 'undefined' && elementCookie == '0' ) {
							return true;
						}
					}

					if( elBgClick == 'false' ) {
						elBgClick = false;
					} else {
						elBgClick = true;
					}

					if( elCloseBtn == 'false' ) {
						elCloseBtn = false;
					} else {
						elCloseBtn = true;
					}

					elDelay = Number(elDelay) + 500;

					setTimeout(function() {
						jQuery.magnificPopup.open({
							items: { src: elTarget },
							type: 'inline',
							mainClass: 'mfp-no-margins mfp-fade',
							closeBtnInside: false,
							fixedContentPos: true,
							closeOnBgClick: elBgClick,
							showCloseBtn: elCloseBtn,
							removalDelay: 500,
							closeIcon: closeButtonIcon,
							callbacks: {
								open: function(){
									if( elAnimateIn != '' ) {
										jQuery(elTarget).addClass( elAnimateIn + ' animated' );
									}
								},
								beforeClose: function(){
									if( elAnimateOut != '' ) {
										jQuery(elTarget).removeClass( elAnimateIn ).addClass( elAnimateOut );
									}
								},
								afterClose: function() {
									if( elAnimateIn != '' || elAnimateOut != '' ) {
										jQuery(elTarget).removeClass( elAnimateIn + ' ' + elAnimateOut + ' animated' );
									}
									if( elCookies == 'true' ) {
										var cookieOps = {};

										if( elCookieExp ) {
											cookieOps.expires = Number( elCookieExp );
										}

										if( elCookiePath ) {
											cookieOps.path = elCookiePath;
										}

										Cookies.set( elTargetValue, '0', cookieOps );
									}
								}
							}
						}, 0);
					}, elDelay );

					if( elTimeout != '' ) {
						setTimeout(function() {
							jQuery.magnificPopup.close();
						}, elDelay + Number(elTimeout) );
					}
				});
			});
		}
	};
}();
