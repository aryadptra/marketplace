CNVS.StickFooterOnSmall = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			__core.getVars.elFooter.style.marginTop = '';

			var windowH = __core.viewport().height,
				wrapperH = __core.getVars.elWrapper.offsetHeight;

			if( !__core.getVars.elBody.classList.contains('sticky-footer') && __core.getVars.elFooter !== 'undefined' && __core.getVars.elWrapper.contains( __core.getVars.elFooter ) ) {
				if( windowH > wrapperH ) {
					__core.getVars.elFooter.style.marginTop = (windowH - wrapperH)+'px';
				}
			}

			if( __core.getVars.elAppMenu ) {
				if((__core.viewport().height - (__core.getVars.elAppMenu.getBoundingClientRect().top + __core.getVars.elAppMenu.getBoundingClientRect().height)) === 0) {
					__core.getVars.elFooter.style.marginBottom = __core.getVars.elAppMenu.offsetHeight+'px';
				}
			}

			__core.getVars.resizers.stickfooter = function() {
				__base.stickFooterOnSmall();
			};
		}
	};
}();
