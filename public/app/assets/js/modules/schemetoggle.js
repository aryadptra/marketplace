CNVS.SchemeToggle = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;
	var __modules = SEMICOLON.Modules;

	var _toggle = function(element, sibling=false, action=false) {
		var bodyClassToggle = element.getAttribute('data-bodyclass-toggle') || 'dark';
		var classAdd = element.getAttribute('data-add-class') || 'scheme-toggler-active';
		var classRemove = element.getAttribute('data-remove-class') || 'scheme-toggler-active';
		var htmlAdd = element.getAttribute('data-add-html');
		var htmlRemove = element.getAttribute('data-remove-html');
		var toggleType = element.getAttribute('data-type') || 'trigger';
		var remember = element.getAttribute('data-remember') || 'false';

		if( __core.contains( bodyClassToggle, __core.getVars.elBody ) ) {
			__core.classesFn('add', classAdd, element);
			__core.classesFn('remove', classRemove, element);
			element.classList.add('body-state-toggled');

			// Set Storage
			if( remember == "true" && action ) {
				localStorage.setItem('cnvsBodyColorScheme', 'dark');
			}

			if( 'checkbox' == toggleType && sibling ) {
				element.querySelector('input[type=checkbox]').checked = true;
			} else {
				if( htmlAdd ) {
					element.innerHTML = htmlAdd;
				}
			}
		} else {
			__core.classesFn('add', classRemove, element);
			__core.classesFn('remove', classAdd, element);
			element.classList.remove('body-state-toggled');

			// Remove Storage
			if( remember == "true" && action ) {
				localStorage.removeItem('cnvsBodyColorScheme');
			}

			if( 'checkbox' == toggleType && sibling ) {
				element.querySelector('input[type=checkbox]').checked = false;
			} else {
				if( htmlRemove ) {
					element.innerHTML = htmlRemove;
				}
			}
		}

		__base.setBSTheme();
		__modules.dataClasses();
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-schemetoggler', event: 'pluginSchemeTogglerReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ) {
				return false;
			}

			selector.forEach( function(element) {
				var bodyClassToggle = element.getAttribute('data-bodyclass-toggle') || 'dark';
				var toggleType = element.getAttribute('data-type') || 'trigger';

				_toggle(element);

				if( 'checkbox' == toggleType ) {
					var elementCheck = element.querySelector('input[type=checkbox]');

					elementCheck.addEventListener( 'change', function() {
						__core.classesFn('toggle', bodyClassToggle, __core.getVars.elBody);
						_toggle(element, false, true);

						__core.siblings(element, selector).forEach( function(el) {
							_toggle(el, true);
						});
					});
				} else {
					element.onclick = function(e) {
						e.preventDefault();

						__core.classesFn('toggle', bodyClassToggle, __core.getVars.elBody);
						_toggle(element, false, true);

						__core.siblings(element, selector).forEach( function(el) {
							_toggle(el, true);
						});
					};
				}
			});
		}
	};
}();
