CNVS.FlexSlider = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.flexslider.js', id: 'canvas-flexslider-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().flexslider;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-flexslider', event: 'pluginFlexSliderReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each(function() {
					var element = jQuery(this),
						elLazy = element.find('.lazy'),
						elAnimation = element.attr('data-animation') || 'slide',
						elEasing = element.attr('data-easing') || 'swing',
						elDirection = element.attr('data-direction') || 'horizontal',
						elReverse = element.attr('data-reverse'),
						elSlideshow = element.attr('data-slideshow'),
						elPause = element.attr('data-pause') || 5000,
						elSpeed = element.attr('data-speed') || 600,
						elVideo = element.attr('data-video'),
						elPagi = element.attr('data-pagi'),
						elArrows = element.attr('data-arrows'),
						elArrowLeft = element.attr('data-arrow-left') || 'uil uil-angle-left-b',
						elArrowRight = element.attr('data-arrow-right') || 'uil uil-angle-right-b',
						elThumbs = element.attr('data-thumbs'),
						elHover = element.attr('data-hover'),
						elSheight = element.attr('data-smooth-height'),
						elTouch = element.attr('data-touch'),
						elUseCSS = false;

					if( elEasing == 'swing' ) {
						elEasing = 'swing';
						elUseCSS = true;
					}
					if( elReverse == 'true' ) { elReverse = true; } else { elReverse = false; }
					if( elSlideshow == "false" ) { elSlideshow = false; } else { elSlideshow = true; }
					if( !elVideo ) { elVideo = false; }
					if( elSheight == 'false' ) { elSheight = false; } else { elSheight = true; }
					if( elDirection == 'vertical' ) { elSheight = false; }
					if( elPagi == 'false' ) { elPagi = false; } else { elPagi = true; }
					if( elThumbs == 'true' ) { elPagi = 'thumbnails'; } else { elPagi = elPagi; }
					if( elArrows == 'false' ) { elArrows = false; } else { elArrows = true; }
					if( elHover == 'false' ) { elHover = false; } else { elHover = true; }
					if( elTouch == 'false' ) { elTouch = false; } else { elTouch = true; }

					element.find('.flexslider').flexslider({
						selector: ".slider-wrap > .slide",
						animation: elAnimation,
						easing: elEasing,
						direction: elDirection,
						reverse: elReverse,
						slideshow: elSlideshow,
						slideshowSpeed: Number(elPause),
						animationSpeed: Number(elSpeed),
						pauseOnHover: elHover,
						video: elVideo,
						controlNav: elPagi,
						directionNav: elArrows,
						smoothHeight: elSheight,
						useCSS: elUseCSS,
						touch: elTouch,
						start: function( slider ){
							__modules.animations();
							__modules.lightbox();
							jQuery('.flex-prev').html('<i class="'+ elArrowLeft +'"></i>');
							jQuery('.flex-next').html('<i class="'+ elArrowRight +'"></i>');
							setTimeout( function(){
								if( slider.parents( '.grid-container.has-init-isotope' ).length > 0 ) {
									slider.parents( '.grid-container.has-init-isotope' ).isotope('layout');
								}
							}, 1200 );
							if( typeof skrollrInstance !== "undefined" ) {
								skrollrInstance.refresh();
							}
						},
						after: function( slider ){
							if( slider.parents( '.grid-container.has-init-isotope' ).length > 0 && !slider.hasClass('flexslider-grid-relayout') ) {
								slider.parents( '.grid-container.has-init-isotope' ).isotope('layout');
								slider.addClass('flexslider-grid-relayout');
							}

							jQuery('.menu-item:visible').find('.flexslider .slide').resize();
						}
					});

					// jQuery(window).on( 'lazyLoadLoaded', function(){
					// 	if( elLazy.length == element.find('.lazy.lazy-loaded').length ) {
					// 		lazyLoadInstance.update();
					// 		setTimeout( function() {
					// 			element.find('.flexslider .slide').resize();
					// 		}, 500 );
					// 	}
					// });
				});
			});
		}
	};
}();
