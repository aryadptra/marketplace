CNVS.Toggle = function() {
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

				__core.initFunction({ class: 'has-plugin-toggles', event: 'pluginTogglesReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function(){
					var element = jQuery(this),
						elSpeed = element.attr('data-speed') || 300,
						elState = element.attr('data-state');

					if( elState != 'open' ){
						element.children('.toggle-content').hide();
					} else {
						element.addClass('toggle-active').children('.toggle-content').slideDown( Number(elSpeed) );
					}

					element.children('.toggle-header').off( 'click' ).on( 'click', function(){
						element.toggleClass('toggle-active').children('.toggle-content').slideToggle( Number(elSpeed) );
						return true;
					});
				});
			});
		}
	};
}();
