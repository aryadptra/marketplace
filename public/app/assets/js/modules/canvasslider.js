CNVS.CanvasSlider = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.swiper.js', id: 'canvas-swiper-js', jsFolder: true });

			__core.isFuncTrue( function() {
				return typeof Swiper !== "undefined";
			}).then( function(cond) {
				if( !cond ) {
					return false;
				}

				__core.initFunction({ class: 'has-plugin-swiper', event: 'pluginSwiperReady' });

				selector = __core.getSelector( selector, false );
				if( selector.length < 1 ){
					return true;
				}

				selector.forEach( function(element) {
					if( !element.classList.contains('swiper_wrapper') ) {
						 return true;
					}

					if( element.querySelectorAll('.swiper-slide').length < 1 ) {
						return true;
					}

					var elDirection = element.getAttribute('data-direction') || 'horizontal',
						elSpeed = element.getAttribute('data-speed') || 300,
						elAutoPlay = element.getAttribute('data-autoplay'),
						elAutoPlayDisableOnInteraction = element.getAttribute('data-autoplay-disable-on-interaction') || true,
						elPauseOnHover = element.getAttribute('data-hover'),
						elLoop = element.getAttribute('data-loop'),
						elStart = element.getAttribute('data-start') || 1,
						elEffect = element.getAttribute('data-effect') || 'slide',
						elGrabCursor = element.getAttribute('data-grab'),
						elParallax = element.getAttribute('data-parallax'),
						elAutoHeight = element.getAttribute('data-autoheight'),
						slideNumberTotal = element.querySelector('.slide-number-total'),
						slideNumberCurrent = element.querySelector('.slide-number-current'),
						elVideoAutoPlay = element.getAttribute('data-video-autoplay'),
						elSettings = element.getAttribute('data-settings'),
						elPagination, elPaginationClickable;

					elAutoPlay = elAutoPlay ? Number( elAutoPlay ) : 999999999;
					elPauseOnHover = elPauseOnHover == 'true' ? true : false;
					elAutoPlayDisableOnInteraction = elAutoPlayDisableOnInteraction == 'false' ? false : true;
					elLoop = elLoop == 'true' ? true : false;
					elParallax = elParallax == 'true' ? true : false;
					elGrabCursor = elGrabCursor == 'false' ? false : true;
					elAutoHeight = elAutoHeight == 'true' ? true : false;
					elVideoAutoPlay = elVideoAutoPlay == 'false' ? false : true;
					elStart = elStart == 'random' ? Math.floor( Math.random() * element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length ) : Number( elStart ) - 1;

					if( element.querySelector('.swiper-pagination') ) {
						elPagination = element.querySelector('.swiper-pagination');
						elPaginationClickable = true;
					} else {
						elPagination = '';
						elPaginationClickable = false;
					}

					var elementNavNext = element.querySelector('.slider-arrow-right'),
						elementNavPrev = element.querySelector('.slider-arrow-left'),
						elementScollBar = element.querySelector('.swiper-scrollbar');

					var cnvsSwiper = new Swiper( element.querySelector('.swiper-parent'), {
						direction: elDirection,
						speed: Number( elSpeed ),
						autoplay: {
							delay: elAutoPlay,
							pauseOnMouseEnter: elPauseOnHover,
							disableOnInteraction: elAutoPlayDisableOnInteraction
						},
						loop: elLoop,
						initialSlide: elStart,
						effect: elEffect,
						parallax: elParallax,
						slidesPerView: 1,
						grabCursor: elGrabCursor,
						autoHeight: elAutoHeight,
						pagination: {
							el: elPagination,
							clickable: elPaginationClickable
						},
						navigation: {
							prevEl: elementNavPrev,
							nextEl: elementNavNext
						},
						scrollbar: {
							el: elementScollBar
						},
						on: {
							afterInit: function(swiper) {
								__base.sliderDimensions();

								if( element.querySelectorAll('.yt-bg-player').length > 0 ) {
									element.querySelectorAll('.yt-bg-player').forEach( function(el) {
										el.setAttribute('data-autoplay', 'false');
										el.classList.remove('customjs');
									});

									__modules.youtubeBgVideo();

									var activeYTVideo = jQuery('.swiper-slide-active').find('.yt-bg-player:not(.customjs)');
									activeYTVideo.on('YTPReady', function() {
										setTimeout( function() {
											activeYTVideo.filter('.mb_YTPlayer').YTPPlay();
										}, 1200);
									});
								}

								document.querySelectorAll('.swiper-slide-active [data-animate]').forEach( function(el) {
									var toAnimateDelay = el.getAttribute('data-delay'),
										toAnimateDelayTime = 0;

									if( toAnimateDelay ) {
										toAnimateDelayTime = Number( toAnimateDelay ) + 750;
									} else {
										toAnimateDelayTime = 750;
									}

									if( !el.classList.contains('animated') ) {
										el.classList.add('not-animated');

										var elementAnimation = el.getAttribute('data-animate');

										setTimeout( function() {
											el.classList.remove('not-animated');

											( elementAnimation + ' animated').split(" ").forEach( function(_class) {
												el.classList.add(_class);
											});
										}, toAnimateDelayTime);
									}
								});

								element.querySelectorAll('[data-animate]').forEach( function(el) {
									var elementAnimation = el.getAttribute('data-animate');

									if( el.closest('.swiper-slide').classList.contains('swiper-slide-active') ) {
										return true;
									}

									( elementAnimation + ' animated').split(" ").forEach( function(_class) {
										el.classList.remove(_class);
									});

									el.classList.add('not-animated');
								});

								if( elAutoHeight ) {
									setTimeout( function() {
										swiper.updateAutoHeight(300);
									}, 1000);
								}
							},
							transitionStart: function(swiper) {
								element.querySelectorAll('[data-animate]').forEach( function(el) {
									var elementAnimation = el.getAttribute('data-animate');

									if( el.closest('.swiper-slide').classList.contains('swiper-slide-active') ) {
										return true;
									}

									( elementAnimation + ' animated').split(" ").forEach( function(_class) {
										el.classList.remove(_class);
									});

									el.classList.add('not-animated');
								});

								SEMICOLON.Base.sliderMenuClass();
							},
							transitionEnd: function(swiper) {
								if( slideNumberCurrent ){
									if( elLoop == true ) {
										slideNumberCurrent.innerHTML = Number( element.querySelector('.swiper-slide.swiper-slide-active').getAttribute('data-swiper-slide-index') ) + 1;
									} else {
										slideNumberCurrent.innerHTML = swiper.activeIndex + 1;
									}
								}

								element.querySelectorAll('.swiper-slide').forEach( function(slide) {
									if( slide.querySelector('video') && elVideoAutoPlay == true ) {
										slide.querySelector('video').pause();
									}

									if( slide.querySelector('.yt-bg-player.mb_YTPlayer:not(.customjs)') ) {
										jQuery(slide).find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPPause();
									}
								});

								element.querySelectorAll('.swiper-slide:not(.swiper-slide-active)').forEach( function(slide) {
									if( slide.querySelector('video') ) {
										if( slide.querySelector('video').currentTime != 0 ) {
											slide.querySelector('video').currentTime = 0;
										}
									}

									var activeYTPlayer = slide.querySelector('.yt-bg-player.mb_YTPlayer:not(.customjs)');

									if( activeYTPlayer ) {
										jQuery(activeYTPlayer).YTPSeekTo( activeYTPlayer.getAttribute('data-start') );
									}
								});

								if( element.querySelector('.swiper-slide.swiper-slide-active').querySelector('video') && elVideoAutoPlay == true ) {
									element.querySelector('.swiper-slide.swiper-slide-active').querySelector('video').play();
								}

								if( element.querySelector('.swiper-slide.swiper-slide-active').querySelector('.yt-bg-player.mb_YTPlayer:not(.customjs)') && elVideoAutoPlay == true ) {
									jQuery(element).find('.swiper-slide.swiper-slide-active').find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPPlay();
								}

								element.querySelectorAll('.swiper-slide.swiper-slide-active [data-animate]').forEach( function(el) {
									var toAnimateDelay = el.getAttribute('data-delay'),
										toAnimateDelayTime = 0;

									if( toAnimateDelay ) {
										toAnimateDelayTime = Number( toAnimateDelay ) + 300;
									} else {
										toAnimateDelayTime = 300;
									}

									if( !el.classList.contains('animated') ) {
										el.classList.add('not-animated');

										var elementAnimation = el.getAttribute('data-animate');

										setTimeout( function() {
											el.classList.remove('not-animated');

											( elementAnimation + ' animated').split(" ").forEach( function(_class) {
												el.classList.add(_class);
											});
										}, toAnimateDelayTime);
									}
								});
							}
						}
					});

					if( slideNumberCurrent ) {
						if( elLoop == true ) {
							slideNumberCurrent.innerHTML = cnvsSwiper.realIndex + 1;
						} else {
							slideNumberCurrent.innerHTML = cnvsSwiper.activeIndex + 1;
						}
					}

					if( slideNumberTotal ) {
						slideNumberTotal.innerHTML = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;
					}
				});
			});
		}
	};
}();
