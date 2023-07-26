CNVS.NavTree = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-navtree', event: 'pluginNavTreeReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function(){
					var element = jQuery(this),
						elSpeed = element.attr('data-speed') || 250,
						elEasing = element.attr('data-easing') || 'swing',
						elArrow = element.attr('data-arrow-class') || 'fa-solid fa-angle-right';

					element.find( 'ul li:has(ul)' ).addClass('sub-menu');
					element.find( 'ul li:has(ul) > a' ).filter(':not(:has(.sub-menu-indicator))').append( '<i class="sub-menu-indicator '+ elArrow +'"></i>' );

					if( element.hasClass('on-hover') ){
						element.find( 'ul li:has(ul):not(.active)' ).hover( function(e){
							jQuery(this).children('ul').stop(true, true).slideDown( Number(elSpeed), elEasing);
						}, function(){
							jQuery(this).children('ul').delay(250).slideUp( Number(elSpeed), elEasing);
						});
					} else {
						element.find( 'ul li:has(ul) > a' ).off( 'click' ).on( 'click', function(){
							var childElement = jQuery(this);

							element.find( 'ul li' ).not(childElement.parents()).removeClass('active');

							childElement.parent().children('ul').slideToggle( Number(elSpeed), elEasing, function(){
								jQuery(this).find('ul').hide();
								jQuery(this).find('li.active').removeClass('active');
							});

							element.find( 'ul li > ul' ).not(childElement.parent().children('ul')).not(childElement.parents('ul')).slideUp( Number(elSpeed), elEasing );
							childElement.parent('li:has(ul)').toggleClass('active');

							return true;
						});
					}
				});
			});
		}
	};
}();
