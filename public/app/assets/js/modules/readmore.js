CNVS.ReadMore = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	var _HEXtoRGBA = function(hex, op) {
		var c;

		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length==3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+op+')';
		}

		console.log('Bad Hex');
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.initFunction({ class: 'has-plugin-readmore', event: 'pluginReadMoreReady' });

			selector = __core.getSelector( selector, false );
			if( selector.length < 1 ){
				return true;
			}

			selector.forEach( function(el) {
				var element = el,
					elSize = element.getAttribute('data-readmore-size') || '10rem',
					elSpeed = element.getAttribute('data-readmore-speed') || 500,
					elScrollUp = element.getAttribute('data-readmore-scrollup') || 'false',
					elTrigger = element.getAttribute('data-readmore-trigger') || '.read-more-trigger',
					elTriggerO = element.getAttribute('data-readmore-trigger-open') || 'Read More',
					elTriggerC = element.getAttribute('data-readmore-trigger-close') || 'Read Less',
					elMask;

				element.style.height = '';
				element.classList.remove('read-more-wrap-open');

				var elHeight = element.offsetHeight;

				var elTriggerElement = element.querySelector( elTrigger );
				elTriggerElement.classList.remove('d-none');
				var elHeightN = elHeight + elTriggerElement.offsetHeight;

				elTriggerElement.innerHTML = elTriggerO;
				elSpeed = Number( elSpeed );

				element.classList.add('read-more-wrap');
				element.style.height = elSize;
				element.style.transitionDuration = elSpeed + 'ms';

				if( !element.querySelector('.read-more-mask') ) {
					element.innerHTML += '<div class="read-more-mask"></div>';
				}

				elMask = element.querySelector('.read-more-mask');

				var elMaskD = element.getAttribute('data-readmore-mask') || 'true',
					elMaskColor = element.getAttribute('data-readmore-maskcolor') || '#FFF',
					elMaskSize = element.getAttribute('data-readmore-masksize') || '100%';

				if( elMaskD == 'true' ) {
					elMask.style.height = elMaskSize;
					elMask.style.backgroundImage = 'linear-gradient( '+ _HEXtoRGBA( elMaskColor, 0 ) +', '+ _HEXtoRGBA( elMaskColor, 1 ) +' )';
					elMask.classList.add('op-ts', 'op-1');
				} else {
					elMask.classList.add('d-none');
				}

				var elTriggerEl = element.querySelector(elTrigger);

				// console.log( (element.getBoundingClientRect().top + document.body.scrollTop - __core.getVars.topScrollOffset) );

				elTriggerEl.onclick = function(e) {
					e.preventDefault();

					if( element.classList.contains('read-more-wrap-open') ) {
						element.style.height = elSize;
						element.classList.remove('read-more-wrap-open');
						elTriggerEl.innerHTML = elTriggerO;
						setTimeout( function() {
							if( elScrollUp == 'true' ) {
								window.scrollTo({
									top: (element.offsetTop - __core.getVars.topScrollOffset),
									behavior: 'smooth'
								});
							}
						}, elSpeed );
						if( elMaskD == 'true' ) {
							elMask.classList.add('op-ts', 'op-1');
						}
					} else {
						if( elTriggerC == 'false' ) {
							elTriggerEl.classList.add('d-none');
						}
						element.style.height = elHeightN + 'px';
						element.style.overflow = '';
						element.classList.add('read-more-wrap-open');
						if( elTriggerEl ) {
							elTriggerEl.innerHTML = elTriggerC;
						}
						if( elMaskD == 'true' ) {
							elMask.classList.remove('op-1');
							elMask.classList.add('op-0');
						}
					}

					elTriggerEl = element.querySelector(elTrigger);
				};
			});

			__core.getVars.resizers.readmore = function() {
				__modules.readmore();
			};
		}
	};
}();
