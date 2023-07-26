CNVS.SidePanel = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			var body = __core.getVars.elBody.classList;

			document.addEventListener('click', function(e) {
				if( !e.target.closest('#side-panel') && !e.target.closest('.side-panel-trigger') ) {
					body.remove('side-panel-open');
				}
			}, false);

			document.querySelectorAll('.side-panel-trigger').forEach( function(el) {
				el.onclick = function(e) {
					e.preventDefault();

					body.toggle('side-panel-open');
					if( body.contains('device-touch') && body.contains('side-push-panel') ) {
						body.toggle('ohidden');
					}
				};
			});
		}
	};
}();
