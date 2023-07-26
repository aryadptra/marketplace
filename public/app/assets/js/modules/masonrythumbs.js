CNVS.MasonryThumbs = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && typeof Isotope !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-masonrythumbs', event: 'pluginMasonryThumbsReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function() {
					var element = jQuery(this),
						elChildren = element.children(),
						elBig = element.attr('data-big');

					if( elChildren.length < 1 ) {
						return false;
					}

					elChildren.removeClass('grid-item-big').css({ 'width': '' });

					var compStyle = window.getComputedStyle( elChildren.eq(0)[0] );
					var firstElementWidth = Number(compStyle.getPropertyValue('width').split('px')[0]);

					if( element.filter('.has-init-isotope').length > 0 ) {
						element.isotope({
							masonry: {
								columnWidth: firstElementWidth
							}
						});
					}

					if( elBig ) {
						elBig = elBig.split(",");

						var elBigNum = '',
							bigi = '';

						for( bigi = 0; bigi < elBig.length; bigi++ ){
							elBigNum = Number(elBig[bigi]) - 1;
							elChildren.eq(elBigNum).addClass('grid-item-big');
						}
					}

					setTimeout( function() {
						element.find('.grid-item-big').css({ width: (firstElementWidth * 2) + 'px' });
					}, 500);

					setTimeout( function() {
						element.filter('.has-init-isotope').isotope( 'layout' );
					}, 1000);

					element[0].addEventListener( 'transitionend', function() {
						__modules.readmore();
					});
				});

				__core.getVars.resizers.masonryThumbs = function() {
					__modules.masonryThumbs();
				};
			});
		}
	};
}();
