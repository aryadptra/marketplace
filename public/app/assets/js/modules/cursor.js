CNVS.Cursor = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			__core.initFunction({ class: 'has-plugin-cursor', event: 'pluginCursorReady' });

			var cursor = document.querySelector('.cnvs-cursor');
			var cursorFollower = document.querySelector('.cnvs-cursor-follower');
			var cursorDot = document.querySelector('.cnvs-cursor-dot');

			var addCursorEl = function(selector, parent) {
				var el = document.createElement('div');
				el.classList.add(selector.split('.')[1]);

				parent.prepend( el );
				return document.querySelector(selector);
			};

			if( !cursor ) {
				cursor = addCursorEl('.cnvs-cursor', __core.getVars.elWrapper);
			}

			if( !cursorFollower ) {
				cursorFollower = addCursorEl('.cnvs-cursor-follower', cursor);
			}

			if( !cursorDot ) {
				cursorDot = addCursorEl('.cnvs-cursor-dot', cursor);
			}

			var onMouseMove = function(event) {
				cursor.style.transform = "translate3d("+ event.clientX + 'px'+","+event.clientY+'px'+",0px)";
			}

			document.addEventListener('mousemove', onMouseMove);

			document.querySelectorAll('a,button').forEach( function(el) {
				el.addEventListener('mouseenter', function() {
					cursor.classList.add('cnvs-cursor-action');
				});

				el.addEventListener('mouseleave', function() {
					cursor.classList.remove('cnvs-cursor-action');
				});
			});
		}
	};
}();
