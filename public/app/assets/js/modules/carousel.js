CNVS.Carousel = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.carousel.js', id: 'canvas-carousel-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof jQuery !== 'undefined' && jQuery().owlCarousel;
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-carousel', event: 'pluginCarouselReady' });

				selector = __core.getSelector( selector );
				if( selector.length < 1 ){
					return true;
				}

				selector.each( function(){
					var element = jQuery(this),
						elItems = element.attr('data-items') || 4,
						elItemsXs = element.attr('data-items-xs') || Number( elItems ),
						elItemsSm = element.attr('data-items-sm') || Number( elItemsXs ),
						elItemsMd = element.attr('data-items-md') || Number( elItemsSm ),
						elItemsLg = element.attr('data-items-lg') || Number( elItemsMd ),
						elItemsXl = element.attr('data-items-xl') || Number( elItemsLg ),
						elLoop = element.attr('data-loop'),
						elAutoPlay = element.attr('data-autoplay'),
						elSpeed = element.attr('data-speed') || 250,
						elAnimateIn = element.attr('data-animate-in'),
						elAnimateOut = element.attr('data-animate-out'),
						elAutoWidth = element.attr('data-auto-width'),
						elNav = element.attr('data-nav'),
						elNavPrev = element.attr('data-nav-prev') || '<i class="uil uil-angle-left-b"></i>',
						elNavNext = element.attr('data-nav-next') || '<i class="uil uil-angle-right-b"></i>',
						elPagi = element.attr('data-pagi'),
						elMargin = element.attr('data-margin') || 20,
						elStage = element.attr('data-stage-padding') || 0,
						elMerge = element.attr('data-merge'),
						elStart = element.attr('data-start') || 0,
						elRewind = element.attr('data-rewind'),
						elSlideBy = element.attr('data-slideby') || 1,
						elCenter = element.attr('data-center'),
						elLazy = element.attr('data-lazyload'),
						elVideo = element.attr('data-video'),
						elRTL = element.attr('data-rtl'),
						elAutoPlayTime = 5000,
						elAutoPlayHoverP = true;

					if( elSlideBy == 'page' ) {
						elSlideBy = 'page';
					} else {
						elSlideBy = Number(elSlideBy);
					}

					if( elLoop == 'true' ){ elLoop = true; } else { elLoop = false; }
					if( !elAutoPlay ){
						elAutoPlay = false;
						elAutoPlayHoverP = false;
					} else {
						elAutoPlayTime = Number(elAutoPlay);
						elAutoPlay = true;
					}
					if( !elAnimateIn ) { elAnimateIn = false; }
					if( !elAnimateOut ) { elAnimateOut = false; }
					if( elAutoWidth == 'true' ){ elAutoWidth = true; } else { elAutoWidth = false; }
					if( elNav == 'false' ){ elNav = false; } else { elNav = true; }
					if( elPagi == 'false' ){ elPagi = false; } else { elPagi = true; }
					if( elRewind == 'true' ){ elRewind = true; } else { elRewind = false; }
					if( elMerge == 'true' ){ elMerge = true; } else { elMerge = false; }
					if( elCenter == 'true' ){ elCenter = true; } else { elCenter = false; }
					if( elLazy == 'true' ){ elLazy = true; } else { elLazy = false; }
					if( elVideo == 'true' ){ elVideo = true; } else { elVideo = false; }
					if( elRTL == 'true' || jQuery('body').hasClass('rtl') ){ elRTL = true; } else { elRTL = false; }

					var carousel = element.owlCarousel({
						margin: Number(elMargin),
						loop: elLoop,
						stagePadding: Number(elStage),
						merge: elMerge,
						startPosition: Number(elStart),
						rewind: elRewind,
						slideBy: elSlideBy,
						center: elCenter,
						lazyLoad: elLazy,
						autoWidth: elAutoWidth,
						nav: elNav,
						navText: [elNavPrev,elNavNext],
						autoplay: elAutoPlay,
						autoplayTimeout: elAutoPlayTime,
						autoplayHoverPause: elAutoPlayHoverP,
						dots: elPagi,
						smartSpeed: Number(elSpeed),
						fluidSpeed: Number(elSpeed),
						video: elVideo,
						animateIn: elAnimateIn,
						animateOut: elAnimateOut,
						rtl: elRTL,
						responsive:{
							0:{ items: elItemsXs },
							576:{ items: elItemsSm },
							768:{ items: elItemsMd },
							992:{ items: elItemsLg },
							1200:{ items: elItemsXl }
						},
						onInitialized: function(){
							__base.sliderDimensions(element.parents('.slider-element')[0]);
							__core.runContainerModules(element[0]);

							if( element.find('.owl-dot').length > 0 ) {
								element.addClass('with-carousel-dots');
							}
						}
					});

					jQuery(window).on( 'lazyLoadLoaded', function(){
						if( element.find('.lazy').length == element.find('.lazy.lazy-loaded').length ) {
							lazyLoadInstance.update();
							setTimeout( function(){
								carousel.trigger( 'refresh.owl.carousel' );
							}, 500);
						}
					});
				});
			});
		}
	};
}();
