CNVS.Countdown = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			core.loadJS({ file: 'plugins.countdown.js', id: 'canvas-countdown-js', jsFolder: true });
			core.loadJS({ file: 'components/moment.js', id: 'canvas-moment-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && typeof moment !== "undefined" && jQuery().countdown;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-countdown', event: 'pluginCountdownReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function(){
					var element = jQuery(this),
						elFormat = element.attr( 'data-format' ) || 'dHMS',
						elSince = element.attr( 'data-since' ),
						elYear = element.attr( 'data-year' ),
						elMonth = element.attr( 'data-month' ),
						elDay = element.attr( 'data-day' ),
						elHour = element.attr( 'data-hour' ),
						elMin = element.attr( 'data-minute' ),
						elSec = element.attr( 'data-second' ),
						elRedirect = element.attr( 'data-redirect' ),
						dateFormat, setDate;

					if( elYear ){
						dateFormat = elYear;
					}

					if( elMonth && elMonth < 13 ){
						dateFormat = dateFormat +"-"+ ( elMonth < 10 ? '0'+elMonth : elMonth);
					} else {
						if( elYear ) {
							dateFormat = dateFormat +"-01";
						}
					}

					if( elDay && elDay < 32 ){
						dateFormat = dateFormat +"-"+ ( elDay < 10 ? '0'+elDay : elDay);
					} else {
						if( elYear ) {
							dateFormat = dateFormat +"-01";
						}
					}

					setDate = dateFormat != '' ? new Date( moment( dateFormat ) ) : new Date();

					if( elHour && elHour < 25 ){
						setDate.setHours( setDate.getHours() + Number( elHour ) );
					}

					if( elMin && elMin < 60 ){
						setDate.setMinutes( setDate.getMinutes() + Number( elMin ) );
					}

					if( elSec && elSec < 60 ){
						setDate.setSeconds( setDate.getSeconds() + Number( elSec ) );
					}

					if( !elRedirect ) {
						elRedirect = false;
					}

					if( elSince == 'true' ) {
						element.countdown({
							since: setDate,
							format: elFormat,
							expiryUrl: elRedirect,
						});
					} else {
						element.countdown({
							until: setDate,
							format: elFormat,
							expiryUrl: elRedirect,
						});
					}
				});
			});
		}
	};
}();
