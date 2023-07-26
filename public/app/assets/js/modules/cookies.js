CNVS.Cookies = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.cookie.js', id: 'canvas-cookie-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof Cookies !== "undefined";
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-cookie', event: 'pluginCookieReady' });

				selector = __core.getSelector( selector, false );
				if( selector.length < 1 ){
					return true;
				}

				var cookieBar = document.querySelector('.gdpr-settings'),
					elSpeed = cookieBar?.getAttribute('data-speed') || 300,
					elExpire = cookieBar?.getAttribute('data-expire') || 30,
					elDelay = cookieBar?.getAttribute('data-delay') || 1500,
					elPersist = cookieBar?.getAttribute('data-persistent'),
					elDirection = 'bottom',
					elHeight = cookieBar?.offsetHeight + 100,
					elWidth = cookieBar?.offsetWidth + 100,
					elSize,
					elSettings = document.querySelector('.gdpr-cookie-settings'),
					elSwitches = elSettings?.querySelectorAll('[data-cookie-name]');

				if( !cookieBar && !elSettings ) {
					return true;
				}

				if( cookieBar ) {
					if( elPersist == 'true' ) {
						Cookies.set('cnvsUsesCookies', '');
					}

					if( cookieBar?.classList.contains('gdpr-settings-sm') && cookieBar?.classList.contains('gdpr-settings-right') ) {
						elDirection = 'right';
					} else if( cookieBar?.classList.contains('gdpr-settings-sm') ) {
						elDirection = 'left';
					}

					if( elDirection == 'left' ) {
						elSize = -elWidth;
						cookieBar.style.right = 'auto';
						cookieBar.style.marginLeft = '1rem';
					} else if( elDirection == 'right' ) {
						elSize = -elWidth;
						cookieBar.style.left = 'auto';
						cookieBar.style.marginRight = '1rem';
					} else {
						elSize = -elHeight;
					}

					cookieBar.style[elDirection] = elSize + 'px';

					if( Cookies.get('cnvsUsesCookies') != 'yesConfirmed' ) {
						setTimeout( function() {
							cookieBar.style[elDirection] = 0;
							cookieBar.style.opacity = 1;
						}, Number( elDelay ) );
					}

					document.querySelector('.gdpr-accept').onclick = function(e) {
						e.preventDefault();

						cookieBar.style[elDirection] = elSize + 'px';
						cookieBar.style.opacity = 0;
						Cookies.set('cnvsUsesCookies', 'yesConfirmed', { expires: Number( elExpire ) });
					};
				}

				elSwitches?.forEach( function(el) {
					var elCookie = el.getAttribute( 'data-cookie-name' ),
						getCookie = Cookies.get( elCookie );

					if( typeof getCookie !== 'undefined' && getCookie == '1' ) {
						el.checked = true;
					} else {
						el.checked = false;
					}
				});

				if( document.querySelector('.gdpr-save-cookies') ) {
					document.querySelector('.gdpr-save-cookies').onclick = function(e) {
						e.preventDefault();

						elSwitches.forEach( function(el) {
							var elCookie = el.getAttribute( 'data-cookie-name' );

							if( el.checked == true ) {
								Cookies.set( elCookie, '1', { expires: Number( elExpire ) });
							} else {
								Cookies.remove( elCookie, '' );
							}
						});

						if( elSettings.closest( '.mfp-content' ).length > 0 ) {
							jQuery$.magnificPopup.close();
						}

						setTimeout( function() {
							window.location.reload();
						}, 500);
					};
				}

				document.querySelectorAll('.gdpr-container')?.forEach( function(element) {
					var elCookie = element.getAttribute('data-cookie-name'),
						elContent = element.getAttribute('data-cookie-content'),
						elContentAjax = element.getAttribute('data-cookie-content-ajax'),
						getCookie = Cookies.get( elCookie );

					if( typeof getCookie !== 'undefined' && getCookie == '1' ) {
						element.classList.add('gdpr-content-active');
						if( elContentAjax ) {
							fetch( elContentAjax ).then( function(response) {
								return response.text();
							}).then( function(html) {
								var domParser = new DOMParser();
								var parsedHTML = domParser.parseFromString(html, 'text/html');

								element?.insertAdjacentHTML('beforeend', parsedHTML.body.innerHTML);
							}).catch( function(err) {
								console.log(err);
							});
						} else {
							if( elContent ) {
								element.innerHTML += elContent;
							}
						}
						__core.runContainerModules(element);
					} else {
						element.classList.add('gdpr-content-blocked');
					}
				});
			});
		}
	};
}();
