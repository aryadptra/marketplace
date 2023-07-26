CNVS.Accordion = function() {
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

				__core.initFunction({ class: 'has-plugin-accordions', event: 'pluginAccordionsReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function(){
					var element = jQuery(this),
						elState = element.attr('data-state'),
						elActive = element.attr('data-active') || 1,
						elActiveClass = element.attr('data-active-class') || '',
						elCollapsible = element.attr('data-collapsible') || 'false',
						windowHash = location.hash,
						accActive;

					elActive = Number( elActive ) - 1;

					if( typeof windowHash !== 'undefined' && windowHash != '' ) {
						accActive = element.find('.accordion-header'+ windowHash);
						if( accActive.length > 0 ) {
							elActive = accActive.index() / 2;
						}
					}

					element.find('.accordion-content').hide();

					if( elState != 'closed' ) {
						element.find('.accordion-header:eq('+ Number(elActive) +')').addClass('accordion-active ' + elActiveClass).next().show();
					}

					element.find('.accordion-header').off( 'click' ).on( 'click', function(){
						var clickTarget = jQuery(this);

						if( clickTarget.next().is(':hidden') ) {
							element.find('.accordion-header').removeClass('accordion-active ' + elActiveClass).next().slideUp("normal");
							clickTarget.toggleClass('accordion-active ' + elActiveClass, true).next().stop(true,true).slideDown("normal", function(){
								if( ( jQuery('body').hasClass('device-sm') || jQuery('body').hasClass('device-xs') ) && element.hasClass('scroll-on-open') ) {
									jQuery('html,body').stop(true,true).animate({
										'scrollTop': clickTarget.offset().top - ( Core.getVars.topScrollOffset - 40 )
									}, 800, 'easeOutQuad' );
								}

								__core.runContainerModules( clickTarget.next()[0] );
							});
						} else {
							if( elCollapsible == 'true' ) {
								clickTarget.toggleClass('accordion-active ' + elActiveClass, false).next().stop(true,true).slideUp("normal");
							}
						}

						return false;
					});
				});
			});
		}
	};
}();
