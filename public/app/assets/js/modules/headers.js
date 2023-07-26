CNVS.Headers = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;
	var __modules = SEMICOLON.Modules;

	var _offset = function() {
		var elHeader = __core.getVars.elHeader;
		var elHeaderInc = document.querySelector('.include-header');

		__core.getVars.headerOffset = elHeader.offsetTop;
		if( __core.getVars.elHeader?.classList.contains('floating-header') || elHeaderInc?.classList.contains('include-topbar') ) {
			__core.getVars.headerOffset = __core.offset(elHeader).top;
		}
		__core.getVars.elHeaderWrap?.classList.add('position-absolute');
		__core.getVars.headerWrapOffset = __core.getVars.headerOffset + __core.getVars.elHeaderWrap?.offsetTop;
		__core.getVars.elHeaderWrap?.classList.remove('position-absolute');

		if( elHeader.hasAttribute('data-sticky-offset') ) {
			var headerDefinedOffset = elHeader.getAttribute('data-sticky-offset');
			if( headerDefinedOffset == 'full' ) {
				__core.getVars.headerWrapOffset = __core.viewport().height;
				var headerOffsetNegative = elHeader.getAttribute('data-sticky-offset-negative');
				if( typeof headerOffsetNegative !== 'undefined' ) {
					if( headerOffsetNegative == 'auto' ) {
						__core.getVars.headerWrapOffset = __core.getVars.headerWrapOffset - elHeader.offsetHeight - 1;
					} else {
						__core.getVars.headerWrapOffset = __core.getVars.headerWrapOffset - Number(headerOffsetNegative) - 1;
					}
				}
			} else {
				__core.getVars.headerWrapOffset = Number(headerDefinedOffset);
			}
		}
	};

	var _sticky = function(stickyOffset) {
		if( !__core.getVars.elBody.classList.contains('is-expanded-menu') && __core.getVars.mobileSticky != 'true' ) {
			return true;
		}

		if( window.pageYOffset > stickyOffset ) {
			if( !__core.getVars.elBody.classList.contains('side-header') ) {
				__core.getVars.elHeader.classList.add('sticky-header');
				_changeMenuClass('sticky');

				if( __core.getVars.elBody.classList.contains('is-expanded-menu') && __core.getVars.stickyShrink == 'true' && !__core.getVars.elHeader.classList.contains('no-sticky') ) {
					if( ( window.pageYOffset - stickyOffset ) > Number( __core.getVars.stickyShrinkOffset ) ) {
						__core.getVars.elHeader.classList.add('sticky-header-shrink');
					} else {
						__core.getVars.elHeader.classList.remove('sticky-header-shrink');
					}
				}
			}
		} else {
			_removeSticky();
			if( __core.getVars.mobileSticky == 'true' ) {
				_changeMenuClass('responsive');
			}
		}
	};

	var _removeSticky = function() {
		__core.getVars.elHeader.className = __core.getVars.headerClasses;
		__core.getVars.elHeader.classList.remove('sticky-header', 'sticky-header-shrink');

		if( __core.getVars.elHeaderWrap ) {
			__core.getVars.elHeaderWrap.className = __core.getVars.headerWrapClasses;
		}
		if( !__core.getVars.elHeaderWrap?.classList.contains('force-not-dark') ) {
			__core.getVars.elHeaderWrap?.classList.remove('not-dark');
		}

		__base.sliderMenuClass();
	};

	var _changeMenuClass = function(type) {
		var newClassesArray = '';

		if( 'responsive' == type ) {
			if( __core.getVars.elBody.classList.contains('is-expanded-menu') ){
				return true;
			}

			if( __core.getVars.mobileHeaderClasses ) {
				newClassesArray = __core.getVars.mobileHeaderClasses.split(/ +/);
			}
		} else {
			if( !__core.getVars.elHeader.classList.contains('sticky-header') ){
				return true;
			}

			if( __core.getVars.stickyHeaderClasses ) {
				newClassesArray = __core.getVars.stickyHeaderClasses.split(/ +/);
			}
		}

		var noOfNewClasses = newClassesArray.length;

		if( noOfNewClasses > 0 ) {
			var i = 0;
			for( i=0; i<noOfNewClasses; i++ ) {
				if( newClassesArray[i] == 'not-dark' ) {
					__core.getVars.elHeader.classList.remove('dark');
					if( !__core.getVars.elHeaderWrap?.classList.contains('.not-dark') ) {
						__core.getVars.elHeaderWrap?.classList.add('not-dark');
					}
				} else if( newClassesArray[i] == 'dark' ) {
					__core.getVars.elHeaderWrap?.classList.remove('not-dark force-not-dark');
					if( !__core.getVars.elHeader.classList.contains( newClassesArray[i] ) ) {
						__core.getVars.elHeader.classList.add( newClassesArray[i] );
					}
				} else if( !__core.getVars.elHeader.classList.contains( newClassesArray[i] ) ) {
					__core.getVars.elHeader.classList.add( newClassesArray[i] );
				}
			}
		}

		__base.setBSTheme();
	};

	var _includeHeader = function() {
		var elHeaderInc = document.querySelector('.include-header');

		if( !elHeaderInc ) {
			return true;
		}

		elHeaderInc.style.marginTop = '';

		if( !__core.getVars.elBody.classList.contains('is-expanded-menu') ) {
			return true;
		}

		if( __core.getVars.elHeader.classList.contains('floating-header') || elHeaderInc.classList.contains('include-topbar') ) {
			__core.getVars.headerHeight = __core.getVars.elHeader.offsetHeight + __core.offset(__core.getVars.elHeader).top;
		}

		elHeaderInc.style.marginTop = (__core.getVars.headerHeight * -1) + 'px';
		__modules.sliderParallax();
	}

	var _sideHeader = function() {
		var headerTrigger = document.getElementById("header-trigger");
		if( headerTrigger ) {
			headerTrigger.onclick = function(e) {
				e.preventDefault();
				__core.getVars.elBody.classList.contains('open-header') && __core.getVars.elBody.classList.toggle("side-header-open");
			};
		}
	};

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var elHeader = __core.getVars.elHeader;
			var isSticky = elHeader.classList.contains('no-sticky') ? false : true;
			var headerWrapClone = elHeader.querySelector('.header-wrap-clone');

			__core.getVars.stickyHeaderClasses = elHeader.getAttribute('data-sticky-class');
			__core.getVars.mobileHeaderClasses = elHeader.getAttribute('data-responsive-class');
			__core.getVars.stickyShrink = elHeader.getAttribute('data-sticky-shrink') || 'true';
			__core.getVars.stickyShrinkOffset = elHeader.getAttribute('data-sticky-shrink-offset') || 300;
			__core.getVars.mobileSticky = elHeader.getAttribute('data-mobile-sticky') || 'false';
			__core.getVars.headerHeight = elHeader.offsetHeight;

			if( !headerWrapClone ) {
				headerWrapClone = document.createElement('div');
				headerWrapClone.classList = 'header-wrap-clone';

				__core.getVars.elHeaderWrap?.parentNode.insertBefore( headerWrapClone, __core.getVars.elHeaderWrap?.nextSibling);
				headerWrapClone = elHeader.querySelector('.header-wrap-clone');
			}

			if( isSticky ) {
				setTimeout( function() {
					_offset();
					_sticky( __core.getVars.headerWrapOffset );
					_changeMenuClass('sticky');
				}, 500);

				window.addEventListener('scroll', function(){
					_sticky( __core.getVars.headerWrapOffset );
				});
			}

			_changeMenuClass('responsive');
			_includeHeader();
			_sideHeader();

			__core.getVars.resizers.headers = function() {
				setTimeout( function() {
					_removeSticky();
					if( isSticky ) {
						_offset();
						_sticky( __core.getVars.headerWrapOffset );
						_changeMenuClass('sticky');
					}
					_changeMenuClass('responsive');
					_includeHeader();
				}, 250);
			};
		}
	};
}();
