CNVS.PortfolioAjax = function() {
	var __core = SEMICOLON.Core;

	var _newNextPrev = function(portPostId) {
		var portNext = _getNext(portPostId);
		var portPrev = _getPrev(portPostId);
		var portNav = document.getElementById('portfolio-navigation');

		if( !document.getElementById('prev-portfolio') && portPrev ) {
			var prevPortItem = document.createElement('a');
			prevPortItem.setAttribute('href', '#');
			prevPortItem.setAttribute('id', 'prev-portfolio');
			prevPortItem.setAttribute('data-id', portPrev);
			prevPortItem.innerHTML = '<i class="bi-arrow-left"></i>';
			prevPortItem && portNav?.insertBefore(prevPortItem, document.getElementById('close-portfolio'));
		}

		if( !document.getElementById('next-portfolio') && portNext ) {
			var nextPortItem = document.createElement('a');
			nextPortItem.setAttribute('href', '#');
			nextPortItem.setAttribute('id', 'next-portfolio');
			nextPortItem.setAttribute('data-id', portNext);
			nextPortItem.innerHTML = '<i class="bi-arrow-right"></i>';
			nextPortItem && portNav?.insertBefore(nextPortItem, document.getElementById('close-portfolio'));
		}
	};

	var _load = function(portPostId, prevPostPortId, getIt) {
		if( !getIt ) {
			getIt = false;
		}

		var portNext = _getNext(portPostId);
		var portPrev = _getPrev(portPostId);

		if( getIt == false ) {
			_close();
			__core.getVars.elBody.classList.add('portfolio-ajax-loading');
			// __core.getVars.portfolioAjax.loader.classList.add('loader-overlay-display');
			var portfolioDataLoader = document.getElementById(portPostId).getAttribute('data-loader');

			fetch(portfolioDataLoader).then( function(response) {
				return response.text();
			}).then( function(html) {
				__core.getVars.portfolioAjax.container.innerHTML = html;

				var nextPortfolio = document.getElementById('next-portfolio'),
					prevPortfolio = document.getElementById('prev-portfolio');

				nextPortfolio?.classList.add('d-none');
				prevPortfolio?.classList.add('d-none');

				if( portNext ) {
					nextPortfolio?.setAttribute('data-id', portNext);
					nextPortfolio?.classList.remove('d-none');
				}

				if( portPrev ) {
					prevPortfolio?.setAttribute('data-id', portPrev);
					prevPortfolio?.classList.remove('d-none');
				}

				_initAjax(portPostId);
				_open();

				__core.getVars.portfolioAjax.items.forEach( function(item) {
					item.classList.remove('portfolio-active');
				});

				document.getElementById(portPostId).classList.add('portfolio-active');
			}).catch( function(error) {
				console.warn('Something went wrong.', error);
			});
		}
	};

	var _close = function() {
		if( __core.getVars.portfolioAjax.wrapper && __core.getVars.portfolioAjax.wrapper.offsetHeight > 32 ) {
			__core.getVars.elBody.classList.remove('portfolio-ajax-loading');
			// __core.getVars.portfolioAjax.loader.classList.add('loader-overlay-display');
			__core.getVars.portfolioAjax.wrapper.classList.remove('portfolio-ajax-opened');

			__core.getVars.portfolioAjax.wrapper.querySelector('#portfolio-ajax-single').addEventListener('transitionend', function() {
				__core.getVars.portfolioAjax.wrapper.querySelector('#portfolio-ajax-single').remove();
			});

			__core.getVars.portfolioAjax.items.forEach( function(item) {
				item.classList.remove('portfolio-active');
			});
		}
	};

	var _open = function() {
		var countImages = __core.getVars.portfolioAjax.container.querySelectorAll('img').length;

		if( countImages < 1 ) {
			_display();
		} else {
			__core.imagesLoaded(__core.getVars.portfolioAjax.container);
			__core.getVars.portfolioAjax.container.addEventListener( 'CanvasImagesLoaded', function() {
				_display();
			});
		}
	};

	var _display = function() {
		__core.getVars.portfolioAjax.container.style.display = 'block';
		__core.getVars.portfolioAjax.wrapper.classList.add('portfolio-ajax-opened');
		__core.getVars.elBody.classList.remove('portfolio-ajax-loading');
		// __core.getVars.portfolioAjax.loader.classList.remove('loader-overlay-display');
		setTimeout( function() {
			__core.runContainerModules( __core.getVars.portfolioAjax.wrapper );
			window.scrollTo({
				top: __core.getVars.portfolioAjax.wrapperOffset - __core.getVars.topScrollOffset - 60,
				behavior: 'smooth'
			});
		}, 500);
	}

	var _getNext = function(portPostId) {
		var portNext = false;
		var hasNext = document.getElementById(portPostId).nextElementSibling;

		if( hasNext ) {
			portNext = hasNext.getAttribute('id');
		}

		return portNext;
	};

	var _getPrev = function(portPostId) {
		var portPrev = false;
		var hasPrev = document.getElementById(portPostId).previousElementSibling;

		if( hasPrev ) {
			portPrev = hasPrev.getAttribute('id');
		}

		return portPrev;
	};

	var _initAjax = function(portPostId) {
		__core.getVars.portfolioAjax.prevItem = document.getElementById(portPostId);

		_newNextPrev(portPostId);

		document.querySelectorAll('#next-portfolio, #prev-portfolio').forEach( function(el) {
			el.onclick = function(e) {
				e.preventDefault();
				_close();

				var portPostId = el.getAttribute('data-id');
				document.getElementById(portPostId).classList.add('portfolio-active');
				_load(portPostId, __core.getVars.portfolioAjax.prevItem);
			};
		})

		document.getElementById('close-portfolio').onclick = function(e) {
			e.preventDefault();
			_close();
		};
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-ajaxportfolio', event: 'pluginAjaxPortfolioReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			__core.getVars.portfolioAjax.items = selector[0].querySelectorAll('.portfolio-item');
			__core.getVars.portfolioAjax.wrapper = document.getElementById('portfolio-ajax-wrap');
			__core.getVars.portfolioAjax.wrapperOffset = __core.offset(__core.getVars.portfolioAjax.wrapper).top;
			__core.getVars.portfolioAjax.container = document.getElementById('portfolio-ajax-container');
			__core.getVars.portfolioAjax.loader = document.getElementById('portfolio-ajax-loader');
			__core.getVars.portfolioAjax.prevItem = '';

			selector[0].querySelectorAll('.portfolio-ajax-trigger').forEach( function(el) {
				if( !el.querySelector('i:nth-child(2)') ) {
					el.innerHTML += '<i class="bi-arrow-repeat icon-spin"></i>';
				}

				el.onclick = function(e) {
					e.preventDefault();

					var portPostId = e.target.closest('.portfolio-item').getAttribute('id');

					if( !e.target.closest('.portfolio-item').classList.contains('portfolio-active') ) {
						_load(portPostId, __core.getVars.portfolioAjax.prevItem);
					}
				};
			});
		}
	};
}();
