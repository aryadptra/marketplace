CNVS.Filter = function() {
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

				__core.initFunction({ class: 'has-plugin-isotope-filter', event: 'pluginGridFilterReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function() {
					var element = jQuery(this),
						elCon = element.attr('data-container'),
						elActClass = element.attr('data-active-class'),
						elDefFilter = element.attr('data-default');

					if( !elActClass ) {
						elActClass = 'activeFilter';
					}

					if( !jQuery(elCon).hasClass('grid-container') ) {
						return false;
					}

					element.find('a').off( 'click' ).on( 'click', function(){
						element.find('li').removeClass( elActClass );
						jQuery(this).parent('li').addClass( elActClass );
						var selector = jQuery(this).attr('data-filter');
						jQuery(elCon).isotope({ filter: selector });
						return false;
					});

					if( elDefFilter ) {
						element.find('li').removeClass( elActClass );
						element.find('[data-filter="'+ elDefFilter +'"]').parent('li').addClass( elActClass );
						jQuery(elCon).isotope({ filter: elDefFilter });
					}

					jQuery(elCon).on( 'arrangeComplete layoutComplete', function(event, filteredItems) {
						jQuery(elCon).addClass('grid-container-filterable');
						if( jQuery(elCon).attr('data-lightbox') == 'gallery' ) {
							jQuery(elCon).find("[data-lightbox]").removeClass('grid-lightbox-filtered');
							filteredItems.forEach( function(item) {
								jQuery(item.element).find("[data-lightbox]").addClass('grid-lightbox-filtered');
							});
						}
						__modules.lightbox();
					});
				});

				jQuery('.grid-shuffle').off( 'click' ).on( 'click', function(){
					var element = jQuery(this),
						elCon = element.attr('data-container');

					if( !jQuery(elCon).hasClass('grid-container') ) {
						return false;
					}

					jQuery(elCon).isotope('shuffle');
				});
			});
		}
	};
}();
