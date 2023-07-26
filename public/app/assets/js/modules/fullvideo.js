CNVS.FullVideo = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-html5video', event: 'pluginHtml5VideoReady' });

			selector = __core.getSelector( selector, false, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(element) {
				var elVideo = element.querySelector('video'),
					elRatio = element.getAttribute('data-ratio') || '16/9';

				if( !elVideo ) {
					return true;
				}

				elRatio = elRatio.split('/');

				elVideo.style.left = '';
				elVideo.style.top = '';

				var divWidth = element.offsetWidth,
					divHeight = element.offsetHeight,
					elWidth = ( Number(elRatio[0])*divHeight)/Number(elRatio[1]),
					elHeight = divHeight;

				if( elWidth < divWidth ) {
					elWidth = divWidth;
					elHeight = (Number(elRatio[1])*divWidth)/Number(elRatio[0]);
				}

				elVideo.style.width = elWidth + 'px';
				elVideo.style.height = elHeight + 'px';

				if( elHeight > divHeight ) {
					elVideo.style.left = '';
					elVideo.style.top = -( ( elHeight - divHeight )/2 ) + 'px';
				}

				if( elWidth > divWidth ) {
					elVideo.style.left = -( ( elWidth - divWidth )/2 ) + 'px';
					elVideo.style.top = '';
				}

				if( SEMICOLON.Mobile.any() && !element.classList.contains('no-placeholder') ) {
					var placeholderImg = elVideo.getAttribute('poster');

					if( placeholderImg != '' ) {
						element.innerHTML += '<div class="video-placeholder" style="background-image: url('+ placeholderImg +');"></div>';
					}

					elVideo.classList.add('d-none');
				}
			});

			__core.getVars.resizers.html5video = function() {
				__modules.html5Video();
			};
		}
	};
}();
