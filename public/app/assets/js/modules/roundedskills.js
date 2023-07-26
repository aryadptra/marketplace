CNVS.RoundedSkills = function() {
	var __core = SEMICOLON.Core;

	var _run = function(element, properties) {
		element.easyPieChart({
			size: properties.size,
			animate: properties.speed,
			scaleColor: false,
			trackColor: properties.trackcolor,
			lineWidth: properties.width,
			lineCap: 'square',
			barColor: properties.color
		});
	};

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.piechart.js', id: 'canvas-piechart-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().easyPieChart;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-piechart', event: 'pluginRoundedSkillReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each(function(){
					var element = jQuery(this),
						elSize = element.attr('data-size') || 140,
						elSpeed = element.attr('data-speed') || 2000,
						elWidth = element.attr('data-width') || 4,
						elColor = element.attr('data-color') || '#0093BF',
						elTrackColor = element.attr('data-trackcolor') || 'rgba(0,0,0,0.04)';

					var properties = {
						size: Number( elSize ),
						speed: Number( elSpeed ),
						width: Number( elWidth ),
						color: elColor,
						trackcolor:	elTrackColor
					};

					element.css({ 'width': elSize+'px', 'height': elSize+'px', 'line-height': elSize+'px' });

					if( jQuery('body').hasClass('device-up-lg') ){
						element.animate({opacity:0}, 10);
						var observer = new IntersectionObserver( function(entries, observer){
							entries.forEach( function(entry){
								if (entry.isIntersecting) {
									if (!element.hasClass('skills-animated')) {
										setTimeout( function(){
											element.css({opacity: 1});
										}, 100);

										_run(element, properties);
										element.addClass('skills-animated');
									}
									observer.unobserve( entry.target );
								}
							});
						}, {rootMargin: '0px 0px 50px'});
						observer.observe( element[0] );
					} else {
						_run(element, properties);
					}
				});
			});
		}
	};
}();
