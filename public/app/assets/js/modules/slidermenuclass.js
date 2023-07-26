CNVS.SliderMenuClass = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;

	var _swiper = function() {
		if( __core.getVars.elBody.classList.contains('is-expanded-menu') || ( __core.getVars.elHeader.classList.contains('transparent-header-responsive') && !__core.getVars.elBody.classList.contains('primary-menu-open') ) ) {
			var activeSlide = __core.getVars.elSlider.querySelector('.swiper-slide-active');
			_schemeChanger(activeSlide);
		}
	};

	var _revolution = function() {
		if( __core.getVars.elBody.classList.contains('is-expanded-menu') || ( __core.getVars.elHeader.classList.contains('transparent-header-responsive') && !__core.getVars.elBody.classList.contains('primary-menu-open') ) ) {
			var activeSlide = __core.getVars.elSlider.querySelector('.active-revslide');
			_schemeChanger(activeSlide);
		}
	};

	var _schemeChanger = function(activeSlide) {
		if( !activeSlide ) {
			return;
		}

		var darkExists = false,
			oldClassesArray,
			noOfOldClasses;

		if( activeSlide.classList.contains('dark') ){
			if( __core.getVars.headerClasses ) {
				oldClassesArray = __core.getVars.headerClasses;
			} else {
				oldClassesArray = '';
			}

			noOfOldClasses = oldClassesArray.length;

			if( noOfOldClasses > 0 ) {
				for( var i=0; i<noOfOldClasses; i++ ) {
					if( oldClassesArray[i] == 'dark' ) {
						darkExists = true;
						break;
					}
				}
			}

			var headerToChange = document.querySelector('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)');
			if( headerToChange ) {
				headerToChange.classList.add('dark');
			}

			if( !darkExists ) {
				var headerToChange = document.querySelector('#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header');
				if( headerToChange ) {
					headerToChange.classList.remove('dark');
				}
			}
			__core.getVars.elHeaderWrap.classList.remove('not-dark');
		} else {
			if( __core.getVars.elBody.classList.contains('dark') ) {
				activeSlide.classList.add('not-dark');
				document.querySelector('#header.transparent-header:not(.semi-transparent,.floating-header)').classList.remove('dark');
				document.querySelector('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').querySelector('#header-wrap').classList.add('not-dark');
			} else {
				document.querySelector('#header.transparent-header:not(.semi-transparent,.floating-header)').classList.remove('dark');
				__core.getVars.elHeaderWrap.classList.remove('not-dark');
			}
		}

		if( __core.getVars.elHeader.classList.contains('sticky-header') ) {
			__base.headers();
		}
	};

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			_swiper();
			_revolution();
			__base.setBSTheme();

			__core.getVars.resizers.slidermenuclass = function() {
				__base.sliderMenuClass();
			};
		}
	};
}();
