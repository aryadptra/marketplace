CNVS.PricingSwitcher = function() {
	var __core = SEMICOLON.Core;

	var _switcher = function(checkbox, parent, pricing, defClass, actClass) {
		parent.querySelectorAll('.pts-left,.pts-right').forEach( function(el) {
			actClass.split(" ").forEach( function(_class) {
				el.classList.remove(_class);
			});

			defClass.split(" ").forEach( function(_class) {
				el.classList.add(_class);
			});
		});

		pricing.querySelectorAll('.pts-switch-content-left,.pts-switch-content-right').forEach( function(el) {
			el.classList.add('d-none');
		});

		if( checkbox.checked == true ) {
			defClass.split(" ").forEach( function(_class) {
				parent.querySelector('.pts-right').classList.remove(_class);
			});

			actClass.split(" ").forEach( function(_class) {
				parent.querySelector('.pts-right').classList.add(_class);
			});
			pricing.querySelectorAll('.pts-switch-content-right').forEach( function(el) {
				el.classList.remove('d-none');
			});
		} else {
			defClass.split(" ").forEach( function(_class) {
				parent.querySelector('.pts-left').classList.remove(_class);
			});

			actClass.split(" ").forEach( function(_class) {
				parent.querySelector('.pts-left').classList.add(_class);
			});

			pricing.querySelectorAll('.pts-switch-content-left').forEach( function(el) {
				el.classList.remove('d-none');
			});
		}
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-pricing-switcher', event: 'pluginPricingSwitcherReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(element) {
				var elCheck = element.querySelector('[type="checkbox"]'),
					elParent = element.closest('.pricing-tenure-switcher'),
					elDefClass = element.getAttribute('data-default-class') || 'text-muted op-05',
					elActClass = element.getAttribute('data-active-class') || 'fw-bold',
					elPricing = document.querySelector( elParent.getAttribute('data-container') );

				_switcher(elCheck, elParent, elPricing, elDefClass, elActClass);

				elCheck.addEventListener( 'change', function() {
					_switcher(elCheck, elParent, elPricing, elDefClass, elActClass);
				});
			});
		}
	};
}();
