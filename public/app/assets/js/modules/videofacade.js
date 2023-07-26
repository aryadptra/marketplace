CNVS.VideoFacade = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-videofacade', event: 'pluginVideoFacadeReady' });

			selector = __core.getSelector( selector, false );

			selector.forEach( function(element) {
				element.onclick = function(e) {
					e.preventDefault();

					var videoContent = element.getAttribute('data-video-html'),
						videoRatio = element.getAttribute('data-video-ratio') || 'ratio ratio-16x9',
						videoPreviewEl = element.querySelector('.video-facade-preview'),
						videoContentEl = element.querySelector('.video-facade-content');

					videoPreviewEl.classList.add('d-none');
					videoContentEl.innerHTML += videoContent;

					videoRatio.split(" ").forEach( function(ratioClass) {
						videoContentEl.classList.add(ratioClass);
					});
				};
			});
		}
	};
}();
