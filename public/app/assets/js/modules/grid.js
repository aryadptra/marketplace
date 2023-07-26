CNVS.Grid = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.isotope.js', id: 'canvas-isotope-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && typeof Isotope !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-isotope', event: 'pluginIsotopeReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function() {
					var element = jQuery(this),
						elTransition = element.attr('data-transition') || '0.65s',
						elLayoutMode = element.attr('data-layout') || 'masonry',
						elStagger = element.attr('data-stagger') || 0,
						elBase = element.attr('data-basewidth') || '.portfolio-item:not(.wide):eq(0)',
						elOriginLeft = true,
						elGrid;

					if( __core.getVars.isRTL ) {
						elOriginLeft = false;
					}

					if( element.hasClass('portfolio') || element.hasClass('post-timeline') ){
						elGrid = element.isotope({
							layoutMode: elLayoutMode,
							isOriginLeft: elOriginLeft,
							transitionDuration: elTransition,
							stagger: Number( elStagger ),
							percentPosition: true,
							masonry: {
								columnWidth: element.find( elBase )[0]
							}
						});
					} else {
						elGrid = element.isotope({
							layoutMode: elLayoutMode,
							isOriginLeft: elOriginLeft,
							transitionDuration: elTransition,
							stagger: Number( elStagger ),
							percentPosition: true,
						});
					}

					if( element.data('isotope') ) {
						element.addClass('has-init-isotope');
					}

					var elementInterval = setInterval( function() {
						if( element.find('.lazy.lazy-loaded').length == element.find('.lazy').length ) {
							setTimeout( function() {
								element.filter('.has-init-isotope').isotope('layout');
							}, 666);

							clearInterval( elementInterval );
						}
					}, 1000);

					jQuery(window).on( 'lazyLoadLoaded', function() {
						element.filter('.has-init-isotope').isotope('layout');
					});

					__core.getVars.resizers.isotope = function() {
						element.filter('.has-init-isotope').isotope('layout');
					};
				});
			});
		}
	};
}();
