CNVS.Instagram = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	var _get = function(element, loader, limit, fetchAlert) {
		var alert = element.closest('.instagram-widget-alert');

		if( !alert ) {
			alert = document.createElement('div');
			alert.classList.add( 'alert', 'alert-warning', 'instagram-widget-alert', 'text-center' );
			element.insertAdjacentElement( 'beforebegin', alert );
			alert.innerHTML = '<div class="spinner-grow spinner-grow-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> ' + fetchAlert;
		}

		fetch(loader).then( function(response) {
			return response.json();
		}).then( function(images) {
			if( images.length > 0 ) {
				alert.remove();
				for (var i = 0; i < limit; i++) {
					if ( i === limit )
						continue;

					var photo = images[i],
						thumb = photo.media_url;
					if( photo.media_type === 'VIDEO' ) {
						thumb = photo.thumbnail_url;
					}

					element.innerHTML += '<a class="grid-item" href="'+ photo.permalink +'" target="_blank"><img src="'+ thumb +'" alt="Image"></a>';
				}
			}

			element.classList.remove('customjs');
			__core.imagesLoaded(element);

			element.addEventListener( 'CanvasImagesLoaded', function() {
				__modules.masonryThumbs();
				__modules.lightbox();
			});
		}).catch( function(err) {
			console.log(err);
			alert.classList.remove( 'alert-warning' );
			alert.classList.add( 'alert-danger' );
			alert.innerHTML = 'Could not fetch Photos from Instagram API. Please try again later.';
		});
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-instagram', event: 'pluginInstagramReady' });

			selector = __core.getSelector( selector, false, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(element) {
				var elLimit = element.getAttribute('data-count') || 12,
					elLoader = element.getAttribute('data-loader') || 'include/instagram/instagram.php',
					elFetch = element.getAttribute('data-fetch-message') || 'Fetching Photos from Instagram...';

				if( Number( elLimit ) > 12 ) {
					elLimit = 12;
				}

				_get(element, elLoader, elLimit, elFetch);
			});
		}
	};
}();
