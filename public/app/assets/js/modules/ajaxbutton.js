CNVS.AjaxButton = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-ajaxbutton', event: 'pluginAjaxButtonReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(el) {
				el.onclick = function(e) {
					e.preventDefault();

					var trigger = el,
						elLoader = el.getAttribute('data-ajax-loader'),
						elContainer = document.querySelector( el.getAttribute('data-ajax-container') ),
						elContentPlacement = el.getAttribute('data-ajax-insertion') || 'append',
						elTriggerHide = el.getAttribute('data-ajax-trigger-hide') || 'true',
						elTriggerDisable = el.getAttribute('data-ajax-trigger-disable') || 'true';

					fetch(elLoader).then( function(response) {
						return response.text();
					}).then( function(html) {
						var domParser = new DOMParser();
						var parsedHTML = domParser.parseFromString(html, 'text/html');

						if( elContentPlacement == 'append' ) {
							elContainer?.insertAdjacentHTML('beforeend', parsedHTML.body.innerHTML);
						} else {
							elContainer?.insertAdjacentHTML('afterbegin', parsedHTML.body.innerHTML);
						}

						if( elTriggerHide == 'true' ) {
							el.classList.add('d-none');
						}

						__core.runContainerModules(elContainer);

						if( elTriggerDisable == 'true' ) {
							setTimeout( function() {
								trigger.onclick = function(e) {
									e.stopPropagation();
									e.preventDefault();

									return false;
								};
							}, 1000);
						}
					}).catch( function(err) {
						var errorDIV = document.createElement("div");
						errorDIV.classList.add( 'd-inline-block', 'text-danger', 'me-3' );
						errorDIV.innerText = 'Content Cannot be Loaded!';
						elContainer?.prepend( errorDIV, ': ' + err );
					});
				};
			});
		}
	};
}();
