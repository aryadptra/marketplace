CNVS.Counter = function() {
	var __core = SEMICOLON.Core;

	var _run = function(elCounter, elFormat) {
		if( elFormat.comma == 'true' ) {
			var reFormat = '\\B(?=(\\d{'+ elFormat.places +'})+(?!\\d))',
				regExp = new RegExp( reFormat, "g" );

			elCounter.find('span').countTo({
				formatter: function(value, options) {
					value = value.toFixed( options.decimals );
					value = value.replace( regExp, elFormat.sep );
					return value;
				}
			});
		} else {
			elCounter.find('span').countTo();
		}
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.counter.js', id: 'canvas-counter-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().countTo;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-counter', event: 'pluginCounterReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each(function(){
					var element = jQuery(this),
						elComma = element.find('span').attr('data-comma'),
						elSep = element.find('span').attr('data-sep') || ',',
						elPlaces = element.find('span').attr('data-places') || 3;

					var elCommaObj = {
						comma: elComma,
						sep: elSep,
						places: Number( elPlaces )
					}

					if( element.hasClass('counter-instant') ) {
						_run(element, elCommaObj);
						return;
					}

					var observer = new IntersectionObserver( function(entries, observer) {
						entries.forEach( function(entry) {
							if (entry.isIntersecting) {
								_run(element, elCommaObj);
								observer.unobserve(entry.target);
							}
						});
					}, {rootMargin: '0px 0px 50px'});

					observer.observe( element[0] );
				});
			});
		}
	};
}();
