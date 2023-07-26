CNVS.TopCart = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			if( !document.getElementById('top-cart-trigger') ) {
				return false;
			}

			document.getElementById('top-cart-trigger').onclick = function(e) {
				e.stopPropagation();
				e.preventDefault();

				selector[0].classList.toggle('top-cart-open');
			};

			document.addEventListener('click', function(e) {
				if( !e.target.closest('#top-cart') ) {
					selector[0].classList.remove('top-cart-open');
				}
			}, false);
		}
	};
}();
