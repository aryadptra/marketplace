CNVS.Quantity = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-quantity', event: 'pluginQuantityReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(element) {
				var plus = element.querySelector('.plus'),
					minus = element.querySelector('.minus'),
					input = element.querySelector('.qty');

				var eventChange = new Event("change");

				plus.onclick = function(e) {
					e.preventDefault();

					var value = input.value,
						step = input.getAttribute('step') || 1,
						max = input.getAttribute('max'),
						intRegex = /^\d+$/;

					if( max && ( Number(elValue) >= Number( max ) ) ) {
						return false;
					}

					if( intRegex.test( value ) ) {
						var valuePlus = Number(value) + Number(step);
						input.value = valuePlus;
					} else {
						input.value = Number(step);
					}

					input.dispatchEvent(eventChange);
				};

				minus.onclick = function(e) {
					e.preventDefault();

					var value = input.value,
						step = input.getAttribute('step') || 1,
						min = input.getAttribute('min'),
						intRegex = /^\d+$/;

					if( !min || min < 0 ) {
						min = 1;
					}

					if( intRegex.test( value ) ) {
						if( Number(value) > Number(min) ) {
							var valueMinus = Number(value) - Number(step);
							input.value = valueMinus;
						}
					} else {
						input.value = Number(step);
					}

					input.dispatchEvent(eventChange);
				};
			});
		}
	};
}();
