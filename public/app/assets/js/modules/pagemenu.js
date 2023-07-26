CNVS.PageMenu = function() {
	var __core = SEMICOLON.Core;

	var _sticky = function(stickyOffset) {
		var pageMenu = __core.getVars.elPageMenu;

		if( window.pageYOffset > stickyOffset ) {
			if( __core.getVars.elBody.classList.contains('device-up-lg') ) {
				pageMenu.classList.add('sticky-page-menu');
			} else {
				if( pageMenu.getAttribute('data-mobile-sticky') == 'true' ) {
					pageMenu.classList.add('sticky-page-menu');
				}
			}
		} else {
			pageMenu.classList.remove('sticky-page-menu');
		}
	};

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var pageMenu = __core.getVars.elPageMenu,
				pageMenuWrap = pageMenu.querySelector('#page-menu-wrap'),
				pageMenuClone = pageMenu.querySelector('.page-menu-wrap-clone');

			if( !pageMenuClone ) {
				pageMenuClone = document.createElement('div');
				pageMenuClone.classList = 'page-menu-wrap-clone';

				pageMenuWrap.parentNode.insertBefore( pageMenuClone, pageMenuWrap.nextSibling);
				pageMenuClone = pageMenu.querySelector('.page-menu-wrap-clone');
			}

			pageMenuClone.style.height = pageMenu.querySelector('#page-menu-wrap').offsetHeight + 'px';

			pageMenu.querySelector('#page-menu-trigger').onclick = function(e) {
				e.preventDefault();

				__core.getVars.elBody.classList.remove('top-search-open');
				pageMenu.classList.toggle('page-menu-open');
			};

			pageMenu.querySelector('nav').onclick = function(e) {
				__core.getVars.elBody.classList.remove('top-search-open');
				document.getElementById('top-cart').classList.remove('top-cart-open');
			};

			document.addEventListener('click', function(e) {
				if( !e.target.closest('#page-menu') ) {
					pageMenu.classList.remove('page-menu-open');
				}
			}, false);

			if( pageMenu.classList.contains('no-sticky') || pageMenu.classList.contains('dots-menu') ) {
				return true;
			}

			var headerHeight;

			if( __core.getVars.elHeader.classList.contains('no-sticky') || __core.getVars.elHeader.getAttribute('data-sticky-shrink') == 'false' ) {
				headerHeight = getComputedStyle(__core.getVars.elHeader).getPropertyValue('--cnvs-header-height').split('px')[0];
			} else {
				headerHeight = getComputedStyle(__core.getVars.elHeader).getPropertyValue('--cnvs-header-height-shrink').split('px')[0];
			}

			if( __core.getVars.elHeader.getAttribute('data-sticky-shrink') == 'false' ) {
				pageMenu.style.setProperty("--cnvs-page-submenu-sticky-offset", headerHeight+'px');
			}

			setTimeout(function() {
				__core.getVars.pageMenuOffset = __core.offset(pageMenu).top - headerHeight;
				_sticky( __core.getVars.pageMenuOffset );
			}, 500);

			window.addEventListener('scroll', function(){
				_sticky( __core.getVars.pageMenuOffset );
			});

			__core.getVars.resizers.pagemenu = function() {
				setTimeout( function() {
					__core.getVars.pageMenuOffset = __core.offset(pageMenu).top - headerHeight;
					_sticky( __core.getVars.pageMenuOffset );
				}, 250);
			};
		}
	};
}();
