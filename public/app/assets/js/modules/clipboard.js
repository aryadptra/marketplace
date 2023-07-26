CNVS.Clipboard = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.clipboard.js', id: 'canvas-clipboard-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof ClipboardJS !== 'undefined';
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-clipboard', event: 'pluginClipboardReady' });

				selector = __core.getSelector( selector, false );
				if( selector.length < 1 ){
					return true;
				}

				var clipboards = [],
					count = 0;

				selector.forEach( function(el) {
					var trigger = el.querySelector('button'),
						triggerText = trigger.innerHTML,
						copiedtext = trigger.getAttribute('data-copied') || 'Copied',
						copiedTimeout = trigger.getAttribute('data-copied-timeout') || 5000;

					clipboards[count] = new ClipboardJS( trigger, {
						target: function(content) {
							return content.closest('.clipboard-copy').querySelector('code');
						}
					});

					clipboards[count].on('success', function(e) {
						trigger.innerHTML = copiedtext;
						trigger.disabled = true;

						setTimeout( function() {
							trigger.innerHTML = triggerText;
							trigger.disabled = false;
						}, Number(copiedTimeout));
					});

					count++;
				});
			});
		}
	};
}();
