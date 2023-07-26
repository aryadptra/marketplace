CNVS.BSComponents = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.bootstrap.js', id: 'canvas-bootstrap-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof bootstrap !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-bscomponents', event: 'pluginBsComponentsReady' });

				selector = __core.getSelector( selector, false );
				if( selector.length < 1 ){
					return true;
				}

				var tooltips = [].slice.call(__core.getVars.baseEl.querySelectorAll('[data-bs-toggle="tooltip"]'));
				var tooltipList = tooltips.map( function(tooltipEl) {
					return new bootstrap.Tooltip(tooltipEl, {container: 'body'});
				});

				var popovers = [].slice.call(__core.getVars.baseEl.querySelectorAll('[data-bs-toggle="popover"]'));
				var popoverList = popovers.map( function(popoverEl) {
					return new bootstrap.Popover(popoverEl, {container: 'body'});
				});

				var tabs = document.querySelectorAll('[data-bs-toggle="tab"],[data-bs-toggle="pill"]');

				var tabTargetShow = function(target) {
					var tabTrigger = new bootstrap.Tab(target);
					tabTrigger.show();
				};

				document.querySelectorAll('.canvas-tabs').forEach( function(el) {
					var activeTab = el.getAttribute('data-active');

					if( activeTab ) {
						activeTab = Number(activeTab) - 1;
						tabTargetShow(el.querySelectorAll('[data-bs-target]')[activeTab]);
					}
				});

				document.querySelectorAll('.tab-hover').forEach( function(el) {
					el.querySelectorAll('[data-bs-target]').forEach( function(tab) {
						tab.addEventListener( 'mouseover', function() {
							tabTargetShow(tab);
						});
					});
				});

				if( __core.getVars.hash && document.querySelector('[data-bs-target="'+__core.getVars.hash+'"]') ) {
					tabTargetShow(document.querySelector('[data-bs-target="'+__core.getVars.hash+'"]'));
				}

				tabs.forEach( function(el) {
					el.addEventListener('shown.bs.tab', function(e) {
						if( !el.classList.contains('container-modules-loaded') ) {
							var tabContent = el.getAttribute('data-bs-target') ? el.getAttribute('data-bs-target') : el.getAttribute('href');
							__core.runContainerModules(document.querySelector(tabContent));

							document.querySelector(tabContent).querySelectorAll('.flexslider').forEach( function(flex) {
								setTimeout( function() {
									jQuery(flex).find('.slide').resize();
								}, 500);
							});

							el.classList.add('container-modules-loaded');
						}
					});
				});

				document.querySelectorAll('.style-msg .btn-close').forEach( function(el) {
					el.onclick = function(e) {
						e.preventDefault();

						el.closest( '.style-msg' ).classList.add('d-none');
					};
				});
			});
		}
	};
}();
