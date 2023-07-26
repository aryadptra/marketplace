CNVS.StickySidebar = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.stickysidebar.js', id: 'canvas-stickysidebar-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().scwStickySidebar;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-stickysidebar', event: 'pluginStickySidebarReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return false;
				}

				selector.each( function(){
					var element = jQuery(this),
						elTop = element.attr('data-offset-top') || 110,
						elBottom = element.attr('data-offset-bottom') || 50;

					element.scwStickySidebar({
						additionalMarginTop: Number(elTop),
						additionalMarginBottom: Number(elBottom)
					});
				});
			});
		}
	};
}();
