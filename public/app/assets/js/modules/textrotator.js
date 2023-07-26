CNVS.TextRotator = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.textrotator.js', id: 'canvas-textrotator-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().Morphext && typeof Typed !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-textrotator', event: 'pluginTextRotatorReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function(){
					var element = jQuery(this),
						elTyped = element.attr('data-typed') || 'false',
						elRotator = element.find('.t-rotate'),
						elAnimation = element.attr('data-rotate') || 'fade',
						elSpeed = element.attr('data-speed') || 1200,
						elSep = element.attr('data-separator') || ',';

					if( elTyped == 'true' ) {
						var elTexts = elRotator.html().split( elSep ),
							elLoop = element.attr('data-loop') || 'true',
							elShuffle = element.attr('data-shuffle'),
							elCur = element.attr('data-cursor') || 'true',
							elSpeed = element.attr('data-speed') || 50,
							elBackSpeed = element.attr('data-backspeed') || 30,
							elBackDelay = element.attr('data-backdelay');

						if( elLoop == 'true' ) { elLoop = true; } else { elLoop = false; }
						if( elShuffle == 'true' ) { elShuffle = true; } else { elShuffle = false; }
						if( elCur == 'true' ) { elCur = true; } else { elCur = false; }

						elRotator.html( '' ).addClass('plugin-typed-init');

						var typed = new Typed( elRotator[0], {
							strings: elTexts,
							typeSpeed: Number( elSpeed ),
							loop: elLoop,
							shuffle: elShuffle,
							showCursor: elCur,
							backSpeed: Number( elBackSpeed ),
							backDelay: Number( elBackDelay )
						});
					} else {
						var pluginData = elRotator.Morphext({
							animation: elAnimation,
							separator: elSep,
							speed: Number(elSpeed)
						});
					}
				});
			});
		}
	};
}();
