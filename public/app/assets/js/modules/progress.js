CNVS.Progress = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-progress', event: 'pluginProgressReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(element) {
				var elValue	= element.getAttribute('data-percent') || 90,
					elSpeed	= element.getAttribute('data-speed') || 1200,
					elBar = element.querySelector('.skill-progress-percent');

				elSpeed = Number(elSpeed) + 'ms';

				elBar.style.setProperty( '--cnvs-progress-speed', elSpeed );

				var observer = new IntersectionObserver( function(entries, observer){
					entries.forEach( function(entry) {
						if (entry.isIntersecting) {
							if (!elBar.classList.contains('skill-animated')) {
								__modules.counter(element.querySelector('.counter'));

								if ( element.classList.contains('skill-progress-vertical') ) {
									elBar.style.height = elValue + "%";
									elBar.classList.add('skill-animated');
								} else {
									elBar.style.width = elValue + "%";
									elBar.classList.add('skill-animated');
								}
							}

							observer.unobserve( entry.target );
						}
					});
				}, {rootMargin: '0px 0px 50px'});

				observer.observe( elBar );
			});
		}
	};
}();
