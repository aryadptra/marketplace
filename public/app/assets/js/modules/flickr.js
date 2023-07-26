CNVS.Flickr = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.flickrfeed.js', id: 'canvas-flickrfeed-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().jflickrfeed;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-flickr', event: 'pluginFlickrFeedReady' });

				selector = __core.getSelector( selector, true, false );
				if( selector.length < 1 ){
					return true;
				}

				selector.each(function() {
					var element = jQuery(this),
						elID = element.attr('data-id'),
						elCount = element.attr('data-count') || 9,
						elType = element.attr('data-type'),
						elTypeGet = 'photos_public.gne';

					if( elType == 'group' ) { elTypeGet = 'groups_pool.gne'; }

					element.jflickrfeed({
						feedapi: elTypeGet,
						limit: Number(elCount),
						qstrings: {
							id: elID
						},
						itemTemplate: '<a class="grid-item" href="{{image_b}}" title="{{title}}" data-lightbox="gallery-item">' +
											'<img src="{{image_s}}" alt="{{title}}" />' +
									  '</a>'
					}, function(data) {
						element.removeClass('customjs');
						__core.imagesLoaded(element[0]);
						__modules.lightbox();

						element[0].addEventListener( 'CanvasImagesLoaded', function() {
							__modules.gridInit();
							__modules.masonryThumbs();
						});
					});
				});
			});
		}
	};
}();
