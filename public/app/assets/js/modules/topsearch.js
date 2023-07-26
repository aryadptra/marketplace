CNVS.TopSearch = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var searchForm = document.querySelector('.top-search-form');

			if( !searchForm ) {
				return true;
			}

			searchForm.closest('.header-row').classList.add( 'top-search-parent' );

			var topSearchParent = document.querySelector('.top-search-parent'),
				timeout;

			selector[0].onclick = function(e) {
				e.stopPropagation();
				e.preventDefault();

				clearTimeout( timeout );

				__core.getVars.elBody.classList.toggle('top-search-open');
				document.getElementById('top-cart')?.classList.remove('top-cart-open');

				__core.getVars.recalls.menureset();

				if( __core.getVars.elBody.classList.contains('top-search-open') ) {
					topSearchParent.classList.add('position-relative');
				} else {
					timeout = setTimeout( function() {
						topSearchParent.classList.remove('position-relative');
					}, 500);
				}

				__core.getVars.elBody.classList.remove("primary-menu-open");
				__core.getVars.elPageMenu && __core.getVars.elPageMenu.classList.remove('page-menu-open');

				if (__core.getVars.elBody.classList.contains('top-search-open')){
					searchForm.querySelector('input').focus();
				}
			};

			document.addEventListener( 'click', function(e) {
				if (!e.target.closest('.top-search-form')) {
					__core.getVars.elBody.classList.remove('top-search-open');
					timeout = setTimeout( function() {
						topSearchParent.classList.remove('position-relative');
					}, 500);
				}
			}, false);
		}
	};
}();
