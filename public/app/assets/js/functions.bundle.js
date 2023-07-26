if( typeof jQuery !== 'undefined' ) {
	var $ = jQuery.noConflict();
}

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	( global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SEMICOLON = factory() );
} (this, (function() {

	// USE STRICT
	"use strict";

	var options = {
		pageTransition: false,
		cursor: false,
		headerSticky: true,
		headerMobileSticky: false,
		menuBreakpoint: 992,
		pageMenuBreakpoint: 992,
		gmapAPI: '',
		scrollOffset: 60,
		scrollExternalLinks: true,
		jsFolder: 'js/',
		cssFolder: 'css/',
		jsLoadType: false,
	};

	var vars = {
		baseEl: document,
		elRoot: document.documentElement,
		elHead: document.head,
		elBody: document.body,
		hash: window.location.hash,
		topScrollOffset: 0,
		elWrapper: document.getElementById('wrapper'),
		elHeader: document.getElementById('header'),
		headerClasses: '',
		elHeaderWrap: document.getElementById('header-wrap'),
		headerWrapClasses: '',
		headerHeight: 0,
		headerOffset: 0,
		headerWrapHeight: 0,
		headerWrapOffset: 0,
		elPrimaryMenus: document.querySelectorAll('.primary-menu'),
		elPrimaryMenuTriggers: document.querySelectorAll('.primary-menu-trigger'),
		elPageMenu: document.getElementById('page-menu'),
		pageMenuOffset: 0,
		elSlider: document.getElementById('slider'),
		elFooter: document.getElementById('footer'),
		portfolioAjax: {},
		sliderParallax: {
			el: document.querySelector('.slider-parallax'),
			caption: document.querySelector('.slider-parallax .slider-caption'),
			inner: document.querySelector('.slider-inner'),
			offset: 0,
		},
		get menuBreakpoint() {
			return this.elBody.getAttribute('data-menu-breakpoint') || options.menuBreakpoint;
		},
		get pageMenuBreakpoint() {
			return this.elBody.getAttribute('data-pagemenu-breakpoint') || options.pageMenuBreakpoint;
		},
		get customCursor() {
			var value = this.elBody.getAttribute('data-custom-cursor') || options.cursor;
			return value == 'true' || value === true ? true : false;
		},
		get pageTransition() {
			var value = this.elBody.classList.contains('page-transition') || options.pageTransition;
			return value == 'true' || value === true ? true : false;
		},
		get isRTL() {
			return this.elRoot.getAttribute('dir') == 'rtl' ? true : false;
		},
		scrollPos: {
			x: 0,
			y: 0,
		},
		$jq: typeof jQuery !== "undefined" ? jQuery.noConflict() : '',
		resizers: {},
		recalls: {},
		debounced: false,
		events: {},
		modules: {},
		fn: {},
		required: {
			jQuery: {
				plugin: 'jquery',
				fn: function(){
					return typeof jQuery !== 'undefined';
				},
				file: options.jsFolder+'jquery.js',
				id: 'canvas-jquery',
			}
		},
		fnInit: function() {
			DocumentOnReady.init();
			DocumentOnLoad.init();
			DocumentOnResize.init();
		}
	};

	var Core = function() {
		return {
			getOptions: options,
			getVars: vars,

			run: function(obj) {
				Object.values(obj).map( function(fn) {
					return typeof fn === 'function' && fn.call();
				});
			},

			runBase: function() {
				Core.run(Base);
			},

			runModules: function() {
				Core.run(Modules);
			},

			runContainerModules: function(parent) {
				if( typeof parent === 'undefined' ) {
					return false;
				}

				Core.getVars.baseEl = parent;
				Core.runModules();
				Core.getVars.baseEl = document;
			},

			breakpoints: function() {
				var viewWidth = Core.viewport().width;

				var breakpoint = {
					xxl: {
						enter: 1400,
						exit: 99999
					},
					xl: {
						enter: 1200,
						exit: 1399
					},
					lg: {
						enter: 992,
						exit: 1199.98
					},
					md: {
						enter: 768,
						exit: 991.98
					},
					sm: {
						enter: 576,
						exit: 767.98
					},
					xs: {
						enter: 0,
						exit: 575.98
					}
				};

				var previous = '';

				Object.keys( breakpoint ).forEach( function(key) {
					if ( (viewWidth > breakpoint[key].enter) && (viewWidth <= breakpoint[key].exit) ) {
						vars.elBody.classList.add( 'device-'+key );
					} else {
						vars.elBody.classList.remove( 'device-'+key );
						if( previous != '' ) {
							vars.elBody.classList.remove( 'device-down-'+previous );
						}
					}

					if ( viewWidth <= breakpoint[key].exit ) {
						if( previous != '' ) {
							vars.elBody.classList.add( 'device-down-'+previous );
						}
					}

					previous = key;

					if ( viewWidth > breakpoint[key].enter ) {
						vars.elBody.classList.add( 'device-up-'+key );
						return;
					} else {
						vars.elBody.classList.remove( 'device-up-'+key );
					}
				});
			},

			colorScheme: function() {
				if( vars.elBody.classList.contains('adaptive-color-scheme') ) {
					window.matchMedia('(prefers-color-scheme: dark)').matches ? vars.elBody.classList.add( 'dark' ) : vars.elBody.classList.remove('dark');
				}

				var bodyColorScheme = localStorage.getItem('cnvsBodyColorScheme');

				if( bodyColorScheme && bodyColorScheme != '' ) {
					bodyColorScheme.split(" ").includes('dark') ? vars.elBody.classList.add( 'dark' ) : vars.elBody.classList.remove( 'dark' );
				}
			},

			throttle: function(timer, func, delay) {
				if(timer) {
					return;
				}

				timer = setTimeout( function() {
					func();
					timer = undefined;
				}, delay);
			},

			debounce: function(callback, delay) {
				clearTimeout(vars.debounced);
				vars.debounced = setTimeout(callback, delay);
			},

			debouncedResize: function(func, delay) {
				var timeoutId;
				return function() {
					var context = this;
					var args = arguments;
					clearTimeout(timeoutId);
					timeoutId = setTimeout( function() {
						func.apply(context, args);
					}, delay);
				};
			},

			addEvent: function(el, event, args = {}) {
				if( typeof el === "undefined" || typeof event === "undefined" ) {
					return;
				}

				var createEvent = new CustomEvent( event, {
					detail: args
				});

				el.dispatchEvent( createEvent );
				vars.events[event] = true;
			},

			scrollEnd: function(callback, refresh = 199) {
				if (!callback || typeof callback !== 'function') return;

				window.addEventListener('scroll', function() {
					Core.debounce( callback, refresh );
				}, {passive: true});
			},

			viewport: function() {
				var viewport = {
					width: window.innerWidth || vars.elRoot.clientWidth,
					height: window.innerHeight || vars.elRoot.clientHeight
				};

				document.documentElement.style.setProperty('--cnvs-viewport-width', viewport.width);
				document.documentElement.style.setProperty('--cnvs-viewport-height', viewport.height);

				return viewport;
			},

			isElement: function(selector) {
				if (!selector || typeof selector !== 'object') {
					return false;
				}

				if (typeof selector.jquery !== 'undefined') {
					selector = selector[0];
				}

				return typeof selector.nodeType !== 'undefined';
			},

			getSelector: function(selector, jquery=true, customjs=true) {
				if(jquery) {
					if( Core.getVars.baseEl !== document ) {
						selector = jQuery(Core.getVars.baseEl).find(selector);
					} else {
						selector = jQuery(selector);
					}

					if( customjs ) {
						if( typeof customjs == 'string' ) {
							selector = selector.filter(':not('+ customjs +')');
						} else {
							selector = selector.filter(':not(.customjs)');
						}
					}
				} else {
					if( Core.isElement(selector) ) {
						selector = selector;
					} else {
						if( customjs ) {
							if( typeof customjs == 'string' ) {
								selector = Core.getVars.baseEl.querySelectorAll(selector+':not('+customjs+')');
							} else {
								selector = Core.getVars.baseEl.querySelectorAll(selector+':not(.customjs)');
							}
						} else {
							selector = Core.getVars.baseEl.querySelectorAll(selector);
						}
					}
				}

				return selector;
			},

			onResize: function(callback, refresh = 333) {
				if (!callback || typeof callback !== 'function') return;

				window.addEventListener('resize', function() {
					Core.debounce( callback, refresh );
				});
			},

			imagesLoaded: function(el) {
				var imgs = el.getElementsByTagName('img') || document.images,
					len = imgs.length,
					counter = 0;

				if(len < 1) {
					Core.addEvent(el, 'CanvasImagesLoaded');
				}

				var incrementCounter = async function() {
					counter++;
					if(counter === len) {
						Core.addEvent(el, 'CanvasImagesLoaded');
					}
				};

				[].forEach.call( imgs, function( img ) {
					if(img.complete) {
						incrementCounter();
					} else {
						img.addEventListener('load', incrementCounter, false);
					}
				});
			},

			contains: function(classes, selector) {
				var classArray = classes.split(" ");
				var hasClass = false;

				classArray.forEach( function(classTxt) {
					if( vars.elBody.classList.contains(classTxt) ) {
						hasClass = true;
					}
				});

				return hasClass;
			},

			has: function(nodeList, selector) {
				return [].slice.call(nodeList)?.filter( function(e) {
					return e.querySelector(selector);
				});
			},

			filtered: function(nodeList, selector) {
				return [].slice.call(nodeList)?.filter( function(e) {
					return e.matches(selector);
				});
			},

			parents: function(elem, selector) {
				if (!Element.prototype.matches) {
					Element.prototype.matches =
						Element.prototype.matchesSelector ||
						Element.prototype.mozMatchesSelector ||
						Element.prototype.msMatchesSelector ||
						Element.prototype.oMatchesSelector ||
						Element.prototype.webkitMatchesSelector ||
						function(s) {
							var matches = (this.document || this.ownerDocument).querySelectorAll(s),
								i = matches.length;
							while (--i >= 0 && matches.item(i) !== this) {}
							return i > -1;
						};
				}

				var parents = [];

				for ( ; elem && elem !== document; elem = elem.parentNode ) {
					if (selector) {
						if (elem.matches(selector)) {
							parents.push(elem);
						}
						continue;
					}
					parents.push(elem);
				}

				return parents;
			},

			siblings: function(elem, nodes = false) {
				if( nodes ) {
					return [].slice.call(nodes).filter( function(sibling) {
						return sibling !== elem;
					});
				} else {
					return [].slice.call(elem.parentNode.children).filter( function(sibling) {
						return sibling !== elem;
					});
				}
			},

			getNext: function(elem, selector) {
				var nextElem = elem.nextElementSibling;

				if( !selector ) {
					return nextElem;
				}

				if( nextElem && nextElem.matches(selector) ) {
					return nextElem;
				}

				return null;
			},

			offset: function(el) {
				var rect = el.getBoundingClientRect(),
					scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
					scrollTop = window.pageYOffset || document.documentElement.scrollTop;

				return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
			},

			isHidden: function(el) {
				return (el.offsetParent === null);
			},

			classesFn: function(func, classes, selector) {
				var classArray = classes.split(" ");
				classArray.forEach( function(classTxt) {
					if( func == 'add' ) {
						selector.classList.add(classTxt);
					} else if( func == 'toggle' ) {
						selector.classList.toggle(classTxt);
					} else {
						selector.classList.remove(classTxt);
					}
				});
			},

			loadCSS: function(params) {
				var file = params.file;
				var htmlID = params.id || false;
				var cssFolder = params.cssFolder || false;

				if( !file ) {
					return false;
				}

				if( htmlID && document.getElementById(htmlID) ) {
					return false;
				}

				var htmlStyle = document.createElement('link');

				htmlStyle.id = htmlID;
				htmlStyle.href = cssFolder ? options.cssFolder+file : file;
				htmlStyle.rel = 'stylesheet';
				htmlStyle.type = 'text/css';

				vars.elHead.appendChild(htmlStyle);
				return true;
			},

			loadJS: function(params) {
				var file = params.file;
				var htmlID = params.id || false;
				var type = params.type || false;
				var callback = params.callback;
				var async = params.async || true;
				var defer = params.defer || true;
				var jsFolder = params.jsFolder || false;

				if( !file ) {
					return false;
				}

				if( htmlID && document.getElementById(htmlID) ) {
					return false;
				}

				var htmlScript = document.createElement('script');

				if ( typeof callback !== 'undefined' ) {
					if( typeof callback != 'function' ) {
						throw new Error('Not a valid callback!');
					} else {
						htmlScript.onload = callback;
					}
				}

				htmlScript.id = htmlID;
				htmlScript.src = jsFolder ? options.jsFolder+file : file;
				if( type ) {
					htmlScript.type = type;
				}
				htmlScript.async = async ? true : false;
				htmlScript.defer = defer ? true : false;

				vars.elBody.appendChild(htmlScript);
				return true;
			},

			isFuncTrue: async function(fn) {
				if( 'function' !== typeof fn ) {
					return false;
				}

				var counter = 0;

				return new Promise( function(resolve, reject) {
					if( fn() ) {
						resolve(true);
					} else {
						var int = setInterval( function() {
							if( fn() ) {
								clearInterval( int );
								resolve(true);
							} else {
								if( counter > 30 ) {
									clearInterval( int );
									reject(true);
								}
							}
							counter++;
						}, 333);
					}
				}).catch( function(error) {
					console.log('Function does not exist: ' + fn);
				});
			},

			initFunction: function(params) {
				vars.elBody.classList.add( params.class );
				Core.addEvent( window, params.event );
				vars.events[params.event] = true;
			},

			topScrollOffset: function() {
				var topOffsetScroll = 0;
				var pageMenuOffset = vars.elPageMenu?.querySelector('#page-menu-wrap')?.offsetHeight || 0;

				if( vars.elBody.classList.contains('is-expanded-menu') ) {
					if( vars.elHeader?.classList.contains('sticky-header') ) {
						topOffsetScroll = vars.elHeaderWrap.offsetHeight;
					}

					if( vars.elPageMenu?.classList.contains('dots-menu') ) {
						pageMenuOffset = 0;
					}
				}

				topOffsetScroll = topOffsetScroll + pageMenuOffset;

				Core.getVars.topScrollOffset = topOffsetScroll + options.scrollOffset;
			},
		};
	}();

	var Base = function() {
		return {
			init: function() {
				Mobile.any() && vars.elBody.classList.add('device-touch');
			},

			menuBreakpoint: function() {
				if( Core.getVars.menuBreakpoint <= Core.viewport().width ) {
					vars.elBody.classList.add( 'is-expanded-menu' );
				} else {
					vars.elBody.classList.remove( 'is-expanded-menu' );
				}

				if( vars.elPageMenu ) {
					if( typeof Core.getVars.pageMenuBreakpoint === 'undefined' ) {
						Core.getVars.pageMenuBreakpoint = Core.getVars.menuBreakpoint;
					}

					if( Core.getVars.pageMenuBreakpoint <= Core.viewport().width ) {
						vars.elBody.classList.add( 'is-expanded-pagemenu' );
					} else {
						vars.elBody.classList.remove( 'is-expanded-pagemenu' );
					}
				}
			},

			scrollPos: function() {
				// document.documentElement.style.setProperty('--cnvs-scroll-ratio', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
			},

			goToTop: function() {
				CNVS.GoToTop.init('#gotoTop');
			},

			stickFooterOnSmall: function() {
				CNVS.StickFooterOnSmall && CNVS.StickFooterOnSmall.init('#footer');
			},

			logo: function() {
				CNVS.Logo.init('#logo');
			},

			headers: function() {
				Core.getVars.headerClasses = vars.elHeader?.className || '';
				Core.getVars.headerWrapClasses = vars.elHeaderWrap?.className || '';
				CNVS.Headers.init('#header');
			},

			menus: function() {
				CNVS.Menus.init('#header');
			},

			pageMenu: function() {
				CNVS.PageMenu && CNVS.PageMenu.init('#page-menu');
			},

			sliderDimensions: function() {
				CNVS.SliderDimensions && CNVS.SliderDimensions.init('.slider-element');
			},

			sliderMenuClass: function() {
				CNVS.SliderMenuClass && CNVS.SliderMenuClass.init('.transparent-header + .swiper_wrapper,.swiper_wrapper + .transparent-header,.transparent-header + .revslider-wrap,.revslider-wrap + .transparent-header');
			},

			topSearch: function() {
				CNVS.TopSearch.init('#top-search-trigger');
			},

			topCart: function() {
				CNVS.TopCart.init('#top-cart');
			},

			sidePanel: function() {
				CNVS.SidePanel && CNVS.SidePanel.init('#side-panel');
			},

			adaptiveColorScheme: function() {
				CNVS.AdaptiveColorScheme && CNVS.AdaptiveColorScheme.init('.adaptive-color-scheme');
			},

			portfolioAjax: function() {
				CNVS.PortfolioAjax && CNVS.PortfolioAjax.init('.portfolio-ajax');
			},

			cursor: function() {
				if( vars.customCursor ) {
					CNVS.Cursor && CNVS.Cursor.init('body');
				}
			},

			setBSTheme: function() {
				if( vars.elBody.classList.contains('dark') ) {
					document.querySelector('html').setAttribute('data-bs-theme', 'dark');
				} else {
					document.querySelector('html').removeAttribute('data-bs-theme');
					document.querySelectorAll('.dark')?.forEach( function(el) {
						el.setAttribute('data-bs-theme', 'dark');
					});
				}

				vars.elBody.querySelectorAll('.not-dark')?.forEach( function(el) {
					el.setAttribute('data-bs-theme', 'light');
				});
			}
		}
	}();

	var Modules = function() {
		return {
			bootstrap: function() {
				var notExec = true;
				document.querySelectorAll('*').forEach( function(el) {
					if( notExec ) {
						el.getAttributeNames().some( function(text) {
							if( text.includes('data-bs') ) {
								notExec = false;
								CNVS.Bootstrap && CNVS.Bootstrap.init('body');
								return true;
							}
						});
					}
				});
			},

			resizeVideos: function(element) {
				CNVS.ResizeVideos && CNVS.ResizeVideos.init(element ? element : 'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]');
			},

			pageTransition: function() {
				if( vars.pageTransition ) {
					CNVS.PageTransition && CNVS.PageTransition.init('body');
				}
			},

			lazyLoad: function(element) {
				CNVS.LazyLoad && CNVS.LazyLoad.init(element ? element : '.lazy:not(.lazy-loaded)');
			},

			dataClasses: function() {
				CNVS.DataClasses && CNVS.DataClasses.init('[data-class]');
			},

			dataHeights: function() {
				CNVS.DataHeights && CNVS.DataHeights.init('[data-height-xxl],[data-height-xl],[data-height-lg],[data-height-md],[data-height-sm],[data-height-xs]');
			},

			lightbox: function(element) {
				CNVS.Lightbox && CNVS.Lightbox.init(element ? element : '[data-lightbox]');
			},

			modal: function(element) {
				CNVS.Modal && CNVS.Modal.init(element ? element : '.modal-on-load');
			},

			parallax: function(element) {
				CNVS.Parallax && CNVS.Parallax.init(element ? element : '.parallax .parallax-bg,.parallax .parallax-element');
			},

			animations: function(element) {
				CNVS.Animations && CNVS.Animations.init(element ? element : '[data-animate]');
			},

			hoverAnimations: function(element) {
				CNVS.HoverAnimations && CNVS.HoverAnimations.init(element ? element : '[data-hover-animate]');
			},

			gridInit: function(element) {
				CNVS.Grid && CNVS.Grid.init(element ? element : '.grid-container');
			},

			filterInit: function(element) {
				CNVS.Filter && CNVS.Filter.init(element ? element : '.grid-filter,.custom-filter');
			},

			canvasSlider: function(element) {
				CNVS.CanvasSlider && CNVS.CanvasSlider.init(element ? element : '.swiper_wrapper');
			},

			sliderParallax: function() {
				CNVS.SliderParallax && CNVS.SliderParallax.init('.slider-parallax');
			},

			flexSlider: function(element) {
				CNVS.FlexSlider && CNVS.FlexSlider.init(element ? element : '.fslider');
			},

			html5Video: function(element) {
				CNVS.FullVideo && CNVS.FullVideo.init(element ? element : '.video-wrap');
			},

			youtubeBgVideo: function(element) {
				CNVS.YoutubeBG && CNVS.YoutubeBG.init(element ? element : '.yt-bg-player');
			},

			toggle: function(element) {
				CNVS.Toggle && CNVS.Toggle.init(element ? element : '.toggle');
			},

			accordion: function(element) {
				CNVS.Accordion && CNVS.Accordion.init(element ? element : '.accordion');
			},

			counter: function(element) {
				CNVS.Counter && CNVS.Counter.init(element ? element : '.counter');
			},

			countdown: function(element) {
				CNVS.Countdown && CNVS.Countdown.init(element ? element : '.countdown');
			},

			gmap: function(element) {
				CNVS.GoogleMaps && CNVS.GoogleMaps.init(element ? element : '.gmap');
			},

			roundedSkills: function(element) {
				CNVS.RoundedSkills && CNVS.RoundedSkills.init(element ? element : '.rounded-skill');
			},

			progress: function(element) {
				CNVS.Progress && CNVS.Progress.init(element ? element : '.skill-progress');
			},

			twitterFeed: function(element) {
				CNVS.Twitter && CNVS.Twitter.init(element ? element : '.twitter-feed');
			},

			flickrFeed: function(element) {
				CNVS.Flickr && CNVS.Flickr.init(element ? element : '.flickr-feed');
			},

			instagram: function(element) {
				CNVS.Instagram && CNVS.Instagram.init(element ? element : '.instagram-photos');
			},

			// Dribbble Pending

			navTree: function(element) {
				CNVS.NavTree && CNVS.NavTree.init(element ? element : '.nav-tree');
			},

			carousel: function(element) {
				CNVS.Carousel && CNVS.Carousel.init(element ? element : '.carousel-widget');
			},

			masonryThumbs: function(element) {
				CNVS.MasonryThumbs && CNVS.MasonryThumbs.init(element ? element : '.masonry-thumbs');
			},

			notifications: function(element) {
				CNVS.Notifications && CNVS.Notifications.init(element ? element : false);
			},

			textRotator: function(element) {
				CNVS.TextRotator && CNVS.TextRotator.init(element ? element : '.text-rotater');
			},

			onePage: function(element) {
				CNVS.OnePage && CNVS.OnePage.init(element ? element : '[data-scrollto],.one-page-menu');
			},

			ajaxForm: function(element) {
				CNVS.AjaxForm && CNVS.AjaxForm.init(element ? element : '.form-widget');
			},

			subscribe: function(element) {
				CNVS.Subscribe && CNVS.Subscribe.init(element ? element : '.subscribe-widget');
			},

			conditional: function(element) {
				CNVS.Conditional && CNVS.Conditional.init(element ? element : '.form-group[data-condition],.form-group[data-conditions]');
			},

			shapeDivider: function(element) {
				CNVS.ShapeDivider && CNVS.ShapeDivider.init(element ? element : '.shape-divider');
			},

			stickySidebar: function(element) {
				CNVS.StickySidebar && CNVS.StickySidebar.init(element ? element : '.sticky-sidebar-wrap');
			},

			cookies: function(element) {
				CNVS.Cookies && CNVS.Cookies.init(element ? element : '.gdpr-settings,[data-cookies]');
			},

			quantity: function(element) {
				CNVS.Quantity && CNVS.Quantity.init(element ? element : '.quantity');
			},

			readmore: function(element) {
				CNVS.ReadMore && CNVS.ReadMore.init(element ? element : '[data-readmore]');
			},

			pricingSwitcher: function(element) {
				CNVS.PricingSwitcher && CNVS.PricingSwitcher.init(element ? element : '.pts-switcher');
			},

			ajaxButton: function(element) {
				CNVS.AjaxButton && CNVS.AjaxButton.init(element ? element : '[data-ajax-loader]');
			},

			videoFacade: function(element) {
				CNVS.VideoFacade && CNVS.VideoFacade.init(element ? element : '.video-facade');
			},

			schemeToggle: function(element) {
				CNVS.SchemeToggle && CNVS.SchemeToggle.init(element ? element : '.body-scheme-toggle');
			},

			clipboardCopy: function(element) {
				CNVS.Clipboard && CNVS.Clipboard.init(element ? element : '.clipboard-copy');
			},

			codeHighlight: function(element) {
				CNVS.CodeHighlight && CNVS.CodeHighlight.init(element ? element : '.code-highlight');
			},

			viewportDetect: function(element) {
				CNVS.ViewportDetect && CNVS.ViewportDetect.init(element ? element : '.viewport-detect');
			},

			bsComponents: function(element) {
				CNVS.BSComponents && CNVS.BSComponents.init(element ? element : '[data-bs-toggle="tooltip"],[data-bs-toggle="popover"],[data-bs-toggle="tab"],[data-bs-toggle="pill"],.style-msg');
			}
		};
	}();

	var Mobile = function() {
		return {
			Android: function()  {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function()  {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function()  {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function()  {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function()  {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function()  {
				return (Mobile.Android() || Mobile.BlackBerry() || Mobile.iOS() || Mobile.Opera() || Mobile.Windows());
			}
		}
	}();

	// Add your Custom JS Codes here
	var Custom = function() {
		return {
			onReady: function() {
				// Add JS Codes here to Run on Document Ready
			},

			onLoad: function() {
				// Add JS Codes here to Run on Window Load
			},

			onResize: function() {
				// Add JS Codes here to Run on Window Resize
			}
		}
	}();

	var DocumentOnResize = function() {
		return {
			init: function() {
				Core.viewport();
				Core.breakpoints();
				Base.menuBreakpoint();

				Core.run(vars.resizers);

				Custom.onResize();

				Core.addEvent( window, 'cnvsResize' );
			}
		};
	}();

	var DocumentOnReady = function() {
		return {
			init: function() {
				Core.breakpoints();
				Core.colorScheme();
				Core.runBase();
				Core.runModules();
				Core.topScrollOffset();

				DocumentOnReady.windowscroll();

				Custom.onReady();
			},

			windowscroll: function() {
				Core.scrollEnd( function() {
					Base.pageMenu();
				});

				// window.addEventListener('scroll', function(){
				// 	Base.scrollPos();
				// }, {passive: true});
			}
		};
	}();

	var DocumentOnLoad = function() {
		return {
			init: function() {
				Custom.onLoad();
			}
		};
	}();

	document.addEventListener( 'DOMContentLoaded', function() {
		DocumentOnReady.init();
	});

	window.onload = function() {
		DocumentOnLoad.init();
	};

	var resizeFunctions = Core.debouncedResize( function() {
		DocumentOnResize.init();
	}, 250);

	window.addEventListener('resize', function() {
		resizeFunctions();
	});

	var canvas_umd = {
		Core,
		Base,
		Modules,
		Mobile,
		Custom,
	};

	return canvas_umd;
})));

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	( global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CNVS = factory() );
} (this, (function() {
	// USE STRICT
	"use strict";

	/**
	 * --------------------------------------------------------------------------
	 * DO NOT DELETE!! Start (Required)
	 * --------------------------------------------------------------------------
	 */
	if( SEMICOLON === 'undefined' || SEMICOLON.Core === 'undefined' || SEMICOLON.Base === 'undefined' || SEMICOLON.Modules === 'undefined' || SEMICOLON.Mobile === 'undefined' ) {
		return false;
	}

	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;
	var __modules = SEMICOLON.Modules;
	var __mobile = SEMICOLON.Mobile;
	// DO NOT DELETE!! End

	return {
		/**
		 * --------------------------------------------------------------------------
		 * Logo Functions Start (Required)
		 * --------------------------------------------------------------------------
		 */
		Logo: function() {
			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var head = __core.getVars.elHead,
						style,
						css;

					if( selector[0].querySelector('.logo-dark') ) {
						style = document.createElement('style');
						head.appendChild(style);
						css = '.dark #header-wrap:not(.not-dark) #logo [class^="logo-"], .dark .header-row:not(.not-dark) #logo [class^="logo-"] { display: none; } .dark #header-wrap:not(.not-dark) #logo .logo-dark, .dark .header-row:not(.not-dark) #logo .logo-dark { display: flex; }';
						style.appendChild(document.createTextNode(css));
					}

					if( selector[0].querySelector('.logo-sticky') ) {
						style = document.createElement('style');
						head.appendChild(style);
						css = '.sticky-header #logo [class^="logo-"] { display: none; } .sticky-header #logo .logo-sticky { display: flex; }';
						style.appendChild(document.createTextNode(css));
					}

					if( selector[0].querySelector('.logo-sticky-shrink') ) {
						style = document.createElement('style');
						head.appendChild(style);
						css = '.sticky-header-shrink #logo [class^="logo-"] { display: none; } .sticky-header-shrink #logo .logo-sticky-shrink { display: flex; }';
						style.appendChild(document.createTextNode(css));
					}

					if( selector[0].querySelector('.logo-mobile') ) {
						style = document.createElement('style');
						head.appendChild(style);
						css = 'body:not(.is-expanded-menu) #logo [class^="logo-"] { display: none; } body:not(.is-expanded-menu) #logo .logo-mobile { display: flex; }';
						style.appendChild(document.createTextNode(css));
					}
				}
			};
		}(),
		// Logo Functions End

		/**
		 * --------------------------------------------------------------------------
		 * GoToTop Functions Start (Required)
		 * --------------------------------------------------------------------------
		 */
		GoToTop: function() {
			var _init = function(element) {
				var elSpeed = element.getAttribute('data-speed') || 700,
					elEasing = element.getAttribute('data-easing');

				element.onclick = function(e) {
					if( elEasing ) {
						jQuery('body,html').stop(true).animate({
							'scrollTop': 0
						}, Number( elSpeed ), elEasing );
					} else {
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});
					}

					e.preventDefault();
				};
			};

			var _scroll = function(element) {
				var body = __core.getVars.elBody.classList;

				var elMobile = element.getAttribute('data-mobile') || 'false',
					elOffset = element.getAttribute('data-offset') || 450;

				if( elMobile == 'false' && ( body.contains('device-xs') || body.contains('device-sm') || body.contains('device-md') ) ) {
					return true;
				}

				if( window.scrollY > Number(elOffset) ) {
					body.add('gototop-active');
				} else {
					body.remove('gototop-active');
				}
			};

			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					_init(selector[0]);
					_scroll(selector[0]);

					window.addEventListener('scroll', function(){
						_scroll( selector[0] );
					});
				}
			};
		}(),
		// GoToTop Functions End

		/**
		 * --------------------------------------------------------------------------
		 * StickFooterOnSmall Functions Start
		 * --------------------------------------------------------------------------
		 */
		StickFooterOnSmall: function() {
			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					__core.getVars.elFooter.style.marginTop = '';

					var windowH = __core.viewport().height,
						wrapperH = __core.getVars.elWrapper.offsetHeight;

					if( !__core.getVars.elBody.classList.contains('sticky-footer') && __core.getVars.elFooter !== 'undefined' && __core.getVars.elWrapper.contains( __core.getVars.elFooter ) ) {
						if( windowH > wrapperH ) {
							__core.getVars.elFooter.style.marginTop = (windowH - wrapperH)+'px';
						}
					}

					if( __core.getVars.elAppMenu ) {
						if((__core.viewport().height - (__core.getVars.elAppMenu.getBoundingClientRect().top + __core.getVars.elAppMenu.getBoundingClientRect().height)) === 0) {
							__core.getVars.elFooter.style.marginBottom = __core.getVars.elAppMenu.offsetHeight+'px';
						}
					}

					__core.getVars.resizers.stickfooter = function() {
						__base.stickFooterOnSmall();
					};
				}
			};
		}(),
		// StickFooterOnSmall Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Header Functions Start (Required)
		 * --------------------------------------------------------------------------
		 */
		Headers: function() {
			var _offset = function() {
				var elHeader = __core.getVars.elHeader;
				var elHeaderInc = document.querySelector('.include-header');

				__core.getVars.headerOffset = elHeader.offsetTop;
				if( __core.getVars.elHeader?.classList.contains('floating-header') || elHeaderInc?.classList.contains('include-topbar') ) {
					__core.getVars.headerOffset = __core.offset(elHeader).top;
				}
				__core.getVars.elHeaderWrap?.classList.add('position-absolute');
				__core.getVars.headerWrapOffset = __core.getVars.headerOffset + __core.getVars.elHeaderWrap?.offsetTop;
				__core.getVars.elHeaderWrap?.classList.remove('position-absolute');

				if( elHeader.hasAttribute('data-sticky-offset') ) {
					var headerDefinedOffset = elHeader.getAttribute('data-sticky-offset');
					if( headerDefinedOffset == 'full' ) {
						__core.getVars.headerWrapOffset = __core.viewport().height;
						var headerOffsetNegative = elHeader.getAttribute('data-sticky-offset-negative');
						if( typeof headerOffsetNegative !== 'undefined' ) {
							if( headerOffsetNegative == 'auto' ) {
								__core.getVars.headerWrapOffset = __core.getVars.headerWrapOffset - elHeader.offsetHeight - 1;
							} else {
								__core.getVars.headerWrapOffset = __core.getVars.headerWrapOffset - Number(headerOffsetNegative) - 1;
							}
						}
					} else {
						__core.getVars.headerWrapOffset = Number(headerDefinedOffset);
					}
				}
			};

			var _sticky = function(stickyOffset) {
				if( !__core.getVars.elBody.classList.contains('is-expanded-menu') && __core.getVars.mobileSticky != 'true' ) {
					return true;
				}

				if( window.pageYOffset > stickyOffset ) {
					if( !__core.getVars.elBody.classList.contains('side-header') ) {
						__core.getVars.elHeader.classList.add('sticky-header');
						_changeMenuClass('sticky');

						if( __core.getVars.elBody.classList.contains('is-expanded-menu') && __core.getVars.stickyShrink == 'true' && !__core.getVars.elHeader.classList.contains('no-sticky') ) {
							if( ( window.pageYOffset - stickyOffset ) > Number( __core.getVars.stickyShrinkOffset ) ) {
								__core.getVars.elHeader.classList.add('sticky-header-shrink');
							} else {
								__core.getVars.elHeader.classList.remove('sticky-header-shrink');
							}
						}
					}
				} else {
					_removeSticky();
					if( __core.getVars.mobileSticky == 'true' ) {
						_changeMenuClass('responsive');
					}
				}
			};

			var _removeSticky = function() {
				__core.getVars.elHeader.className = __core.getVars.headerClasses;
				__core.getVars.elHeader.classList.remove('sticky-header', 'sticky-header-shrink');

				if( __core.getVars.elHeaderWrap ) {
					__core.getVars.elHeaderWrap.className = __core.getVars.headerWrapClasses;
				}
				if( !__core.getVars.elHeaderWrap?.classList.contains('force-not-dark') ) {
					__core.getVars.elHeaderWrap?.classList.remove('not-dark');
				}

				__base.sliderMenuClass();
			};

			var _changeMenuClass = function(type) {
				var newClassesArray = '';

				if( 'responsive' == type ) {
					if( __core.getVars.elBody.classList.contains('is-expanded-menu') ){
						return true;
					}

					if( __core.getVars.mobileHeaderClasses ) {
						newClassesArray = __core.getVars.mobileHeaderClasses.split(/ +/);
					}
				} else {
					if( !__core.getVars.elHeader.classList.contains('sticky-header') ){
						return true;
					}

					if( __core.getVars.stickyHeaderClasses ) {
						newClassesArray = __core.getVars.stickyHeaderClasses.split(/ +/);
					}
				}

				var noOfNewClasses = newClassesArray.length;

				if( noOfNewClasses > 0 ) {
					var i = 0;
					for( i=0; i<noOfNewClasses; i++ ) {
						if( newClassesArray[i] == 'not-dark' ) {
							__core.getVars.elHeader.classList.remove('dark');
							if( !__core.getVars.elHeaderWrap?.classList.contains('.not-dark') ) {
								__core.getVars.elHeaderWrap?.classList.add('not-dark');
							}
						} else if( newClassesArray[i] == 'dark' ) {
							__core.getVars.elHeaderWrap?.classList.remove('not-dark force-not-dark');
							if( !__core.getVars.elHeader.classList.contains( newClassesArray[i] ) ) {
								__core.getVars.elHeader.classList.add( newClassesArray[i] );
							}
						} else if( !__core.getVars.elHeader.classList.contains( newClassesArray[i] ) ) {
							__core.getVars.elHeader.classList.add( newClassesArray[i] );
						}
					}
				}

				__base.setBSTheme();
			};

			var _includeHeader = function() {
				var elHeaderInc = document.querySelector('.include-header');

				if( !elHeaderInc ) {
					return true;
				}

				elHeaderInc.style.marginTop = '';

				if( !__core.getVars.elBody.classList.contains('is-expanded-menu') ) {
					return true;
				}

				if( __core.getVars.elHeader.classList.contains('floating-header') || elHeaderInc.classList.contains('include-topbar') ) {
					__core.getVars.headerHeight = __core.getVars.elHeader.offsetHeight + __core.offset(__core.getVars.elHeader).top;
				}

				elHeaderInc.style.marginTop = (__core.getVars.headerHeight * -1) + 'px';
				__modules.sliderParallax();
			}

			var _sideHeader = function() {
				var headerTrigger = document.getElementById("header-trigger");
				if( headerTrigger ) {
					headerTrigger.onclick = function(e) {
						e.preventDefault();
						__core.getVars.elBody.classList.contains('open-header') && __core.getVars.elBody.classList.toggle("side-header-open");
					};
				}
			};

			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var elHeader = __core.getVars.elHeader;
					var isSticky = elHeader.classList.contains('no-sticky') ? false : true;
					var headerWrapClone = elHeader.querySelector('.header-wrap-clone');

					__core.getVars.stickyHeaderClasses = elHeader.getAttribute('data-sticky-class');
					__core.getVars.mobileHeaderClasses = elHeader.getAttribute('data-responsive-class');
					__core.getVars.stickyShrink = elHeader.getAttribute('data-sticky-shrink') || 'true';
					__core.getVars.stickyShrinkOffset = elHeader.getAttribute('data-sticky-shrink-offset') || 300;
					__core.getVars.mobileSticky = elHeader.getAttribute('data-mobile-sticky') || 'false';
					__core.getVars.headerHeight = elHeader.offsetHeight;

					if( !headerWrapClone ) {
						headerWrapClone = document.createElement('div');
						headerWrapClone.classList = 'header-wrap-clone';

						__core.getVars.elHeaderWrap?.parentNode.insertBefore( headerWrapClone, __core.getVars.elHeaderWrap?.nextSibling);
						headerWrapClone = elHeader.querySelector('.header-wrap-clone');
					}

					if( isSticky ) {
						setTimeout( function() {
							_offset();
							_sticky( __core.getVars.headerWrapOffset );
							_changeMenuClass('sticky');
						}, 500);

						window.addEventListener('scroll', function(){
							_sticky( __core.getVars.headerWrapOffset );
						});
					}

					_changeMenuClass('responsive');
					_includeHeader();
					_sideHeader();

					__core.getVars.resizers.headers = function() {
						setTimeout( function() {
							_removeSticky();
							if( isSticky ) {
								_offset();
								_sticky( __core.getVars.headerWrapOffset );
								_changeMenuClass('sticky');
							}
							_changeMenuClass('responsive');
							_includeHeader();
						}, 250);
					};
				}
			};
		}(),
		// Header Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Menu Functions Start (Required)
		 * --------------------------------------------------------------------------
		 */
		Menus: function() {
			var _init = function() {
				__core.getVars.headerWrapHeight = __core.getVars.elHeaderWrap?.offsetHeight;

				document.addEventListener('click', function(e) {
					if( !e.target.closest('.primary-menu-trigger') && !e.target.closest('.primary-menu') ) {
						_reset();
						_functions();
					}

					if ( !e.target.closest('.top-links.on-click') ) {
						document.querySelectorAll('.top-links.on-click').forEach( function(item) {
							item.querySelectorAll('.top-links-sub-menu,.top-links-section').forEach( function(el) {
								el.classList.remove('d-block');
							});
						});

						document.querySelectorAll('.top-links.on-click').forEach( function(item) {
							item.querySelectorAll('.top-links-item').forEach( function(el) {
								el.classList.remove('current');
							});
						});
					}
				}, false);

				document.querySelectorAll( '.menu-item' ).forEach(function(el) {
					if( el.querySelectorAll('.sub-menu-container').length > 0 ) {
						el.classList.add('sub-menu');
					}

					if( !el.classList.contains('mega-menu-title') && el.querySelectorAll('.sub-menu-container').length > 0 && el.querySelectorAll('.sub-menu-trigger').length < 1 ) {
						var subMenuTrigger = document.createElement('button');
						subMenuTrigger.classList = 'sub-menu-trigger fa-solid fa-chevron-right';
						subMenuTrigger.innerHTML = '<span class="visually-hidden">Open Sub-Menu</span>';
						el.append( subMenuTrigger );
					}
				});
			};

			var _reset = function() {
				var body = __core.getVars.elBody,
					subMenusSel = '.mega-menu-content, .sub-menu-container',
					menuItemSel = '.menu-item';

				document.querySelectorAll('.primary-menu-trigger').forEach( function(el) {
					el.classList.remove('primary-menu-trigger-active');
				});

				__core.getVars.elPrimaryMenus.forEach( function(el) {
					if( !body.classList.contains('is-expanded-menu') ) {
						el.querySelector('.menu-container').classList.remove('d-block');
					} else {
						el.querySelector('.menu-container').classList.remove('d-block', 'd-none');

						el.querySelectorAll(subMenusSel)?.forEach( function(item) {
							item.classList.remove('d-none');
						});

						document.querySelectorAll('.menu-container:not(.mobile-primary-menu)').forEach( function(el) {
							el.style.display = '';
						});

						__core.getVars.elPrimaryMenus.forEach( function(el) {
							el.querySelectorAll('.mobile-primary-menu')?.forEach( function(elem) {
								elem.classList.remove('d-block');
							});
						});
					}

					el.querySelectorAll(subMenusSel)?.forEach( function(item) {
						item.classList.remove('d-block');
					});

					el.classList.remove('primary-menu-active');

					var classes = body.className.split(" ").filter( function(classText) {
						return !classText.startsWith('primary-menu-open');
					});

					body.className = classes.join(" ").trim();
				});
			};

			var _arrows = function() {
				var addArrow = function(menuItemDiv) {
					if( !menuItemDiv.querySelector('.sub-menu-indicator') ) {
						var arrow = document.createElement("i");
						arrow.classList.add('sub-menu-indicator');

						var customArrow = menuItemDiv.closest('.primary-menu')?.getAttribute('data-arrow-class') || 'fa-solid fa-caret-down';
						customArrow && customArrow.split(" ").forEach( function(className) {
							arrow.classList.add(className);
						});

						menuItemDiv.append(arrow);
					}
				};

				// Arrows for Top Links Items
				document.querySelectorAll( '.top-links-item' ).forEach( function(menuItem) {
					var menuItemDiv = menuItem.querySelector(':scope > a');
					menuItem.querySelector(':scope > .top-links-sub-menu, :scope > .top-links-section') && addArrow( menuItemDiv );
				});

				// Arrows for Primary Menu Items
				document.querySelectorAll( '.menu-item' ).forEach( function(menuItem) {
					var menuItemDiv = menuItem.querySelector(':scope > .menu-link > div');
					( !menuItem.classList.contains('mega-menu-title') && menuItem.querySelector(':scope > .sub-menu-container, :scope > .mega-menu-content') ) && addArrow( menuItemDiv );
				});

				// Arrows for Page Menu Items
				document.querySelectorAll( '.page-menu-item' ).forEach( function(menuItem) {
					var menuItemDiv = menuItem.querySelector(':scope > a > div');
					menuItem.querySelector(':scope > .page-menu-sub-menu') && addArrow( menuItemDiv );
				});
			};

			var _invert = function(subMenuEl) {
				var subMenus = subMenuEl || document.querySelectorAll( '.mega-menu-content, .sub-menu-container, .top-links-section' );

				if( !__core.getVars.elBody.classList.contains('is-expanded-menu') ) {
					return false;
				}

				subMenus.forEach( function(el) {
					el.classList.remove('menu-pos-invert');
					var elChildren = el.querySelectorAll(':scope > *');

					elChildren.forEach( function(elChild) {
						elChild.style.display = 'block';
					});
					el.style.display = 'block';

					var viewportOffset = el.getBoundingClientRect();

					if( el.closest('.mega-menu-small') ) {
						var outside = __core.viewport().width - (viewportOffset.left + viewportOffset.width);
						if( outside < 0 ) {
							el.style.left = outside + 'px';
						}
					}

					if( __core.getVars.elBody.classList.contains('rtl') ) {
						if( viewportOffset.left < 0 ) {
							el.classList.add('menu-pos-invert');
						}
					}

					if( __core.viewport().width - (viewportOffset.left + viewportOffset.width) < 0 ) {
						el.classList.add('menu-pos-invert');
					}
				});

				subMenus.forEach( function(el) {
					var elChildren = el.querySelectorAll(':scope > *');
					elChildren.forEach( function(elChild) {
						elChild.style.display = '';
					});
					el.style.display = '';
				});
			};

			var _functions = function() {
				var subMenusSel = '.mega-menu-content, .sub-menu-container',
					menuItemSel = '.menu-item',
					subMenuSel = '.sub-menu',
					subMenuTriggerSel = '.sub-menu-trigger',
					body = __core.getVars.elBody.classList;

				var triggersBtn = document.querySelectorAll( subMenuTriggerSel );
				var triggerLinks = new Array;

				triggersBtn.forEach( function(el) {
					var triggerLink = el.closest('.menu-item').querySelector('.menu-link[href^="#"]');
					if( triggerLink ) {
						triggerLinks.push(triggerLink);
					}
				});

				var triggers = [].slice.call(triggersBtn).concat([].slice.call(triggerLinks));

				document.querySelectorAll(subMenuTriggerSel).forEach( function(el) {
					el.classList.remove('icon-rotate-90')
				});

				/**
				 * Mobile Menu Functionality
				 */
				if( !body.contains('is-expanded-menu') ) {
					// Reset Menus to their Closed State
					__core.getVars.elPrimaryMenus.forEach( function(el) {
						el.querySelectorAll(subMenusSel).forEach( function(elem) {
							elem.classList.add('d-none');
							body.remove("primary-menu-open");
						})
					});

					triggers.forEach( function(trigger) {
						trigger.onclick = function(e) {
							e.preventDefault();

							var triggerEl = trigger;

							if( !trigger.classList.contains('sub-menu-trigger') ) {
								triggerEl = trigger.closest(menuItemSel).querySelector(':scope > ' + subMenuTriggerSel);
							}

							__core.siblings(triggerEl.closest(menuItemSel)).forEach( function(item) {
								item.querySelectorAll(subMenusSel).forEach( function(item) {
									item.classList.add('d-none');
								});
							});

							if( triggerEl.closest('.mega-menu-content') ) {
								var parentSubMenuContainers = [];

								__core.parents(triggerEl, menuItemSel).forEach( function(item) {
									parentSubMenuContainers.push(item.querySelector(':scope > ' + subMenusSel));
								});

								[].slice.call(triggerEl.closest('.mega-menu-content').querySelectorAll(subMenusSel)).filter( function(item) {
									return !parentSubMenuContainers.includes(item);
								}).forEach( function(item) {
									item.classList.add('d-none');
								});
							}

							_triggerState(triggerEl, menuItemSel, subMenusSel, subMenuTriggerSel, 'd-none');
						};
					});
				}

				/**
				 * On-Click Menu Functionality
				 */
				if( body.contains('is-expanded-menu') ) {
					if( body.contains('side-header') || body.contains('overlay-menu') ) {
						__core.getVars.elPrimaryMenus.forEach( function(pMenu) {
							pMenu.classList.add('on-click');
							pMenu.querySelectorAll(subMenuTriggerSel).forEach( function(item) {
								item.style.zIndex = '-1';
							});
						});
					}

					[].slice.call(__core.getVars.elPrimaryMenus).filter( function(elem) {
						return elem.matches('.on-click');
					}).forEach( function(pMenu) {
						var menuItemSubs = __core.has( pMenu.querySelectorAll(menuItemSel), subMenuTriggerSel );

						menuItemSubs.forEach( function(el) {
							var triggerEl = el.querySelector(':scope > .menu-link');

							triggerEl.onclick = function(e) {
								e.preventDefault();

								__core.siblings(triggerEl.closest(menuItemSel)).forEach( function(item) {
									item.querySelectorAll(subMenusSel).forEach( function(item) {
										item.classList.remove('d-block');
									});
								});

								if( triggerEl.closest('.mega-menu-content') ) {
									var parentSubMenuContainers = [];

									__core.parents(triggerEl, menuItemSel).forEach( function(item) {
										parentSubMenuContainers.push(item.querySelector(':scope > ' + subMenusSel));
									});

									[].slice.call(triggerEl.closest('.mega-menu-content').querySelectorAll(subMenusSel)).filter( function(item) {
										return !parentSubMenuContainers.includes(item);
									}).forEach( function(item) {
										item.classList.remove('d-block');
									});
								}

								_triggerState(triggerEl, menuItemSel, subMenusSel, subMenuTriggerSel, 'd-block');
							};
						});
					});
				}

				/**
				 * Top-Links On-Click Functionality
				 */
				document.querySelectorAll('.top-links').forEach( function(item) {
					if( item.classList.contains('on-click') || !body.contains('device-up-lg') ) {
						item.querySelectorAll('.top-links-item').forEach( function(menuItem) {
							if( menuItem.querySelectorAll('.top-links-sub-menu,.top-links-section').length > 0 ) {
								var triggerEl = menuItem.querySelector(':scope > a');

								triggerEl.onclick = function(e) {
									e.preventDefault();

									__core.siblings(menuItem).forEach( function(item) {
										item.querySelectorAll('.top-links-sub-menu, .top-links-section').forEach( function(item) {
											item.classList.remove('d-block');
										});
									});
									menuItem.querySelector(':scope > .top-links-sub-menu, :scope > .top-links-section').classList.toggle('d-block');
									__core.siblings(menuItem).forEach( function(item) {
										item.classList.remove('current');
									});
									menuItem.classList.toggle('current');
								};
							}
						})
					}
				});

				_invert( document.querySelectorAll('.top-links-section') );

			};

			var _triggerState = function(triggerEl, menuItemSel, subMenusSel, subMenuTriggerSel, classCheck) {
				triggerEl.closest('.menu-container').querySelectorAll(subMenuTriggerSel).forEach( function(el) {
					el.classList.remove('icon-rotate-90');
				});

				var triggerredSubMenus = triggerEl.closest(menuItemSel).querySelector( ':scope > ' + subMenusSel );
				var childSubMenus = triggerEl.closest(menuItemSel).querySelectorAll( subMenusSel );

				if( classCheck == 'd-none' ) {
					if( triggerredSubMenus.classList.contains('d-none') ) {
						triggerredSubMenus.classList.remove('d-none');
					} else {
						childSubMenus.forEach( function(item) {
							item.classList.add('d-none');
						});
					}
				} else {
					if( triggerredSubMenus.classList.contains('d-block') ) {
						childSubMenus.forEach( function(item) {
							item.classList.remove('d-block');
						});
					} else {
						triggerredSubMenus.classList.add('d-block');
					}
				}

				_current(triggerEl, menuItemSel, subMenusSel, subMenuTriggerSel);
			}

			var _current = function(triggerEl, menuItemSel, subMenusSel, subMenuTriggerSel) {
				[].slice.call(triggerEl.closest('.menu-container').querySelectorAll(menuItemSel)).forEach( function(item) {
					item.classList.remove('current');
				});

				var setCurrent = function(item, menuItemSel, subMenusSel) {
					if( !__core.isHidden(item.closest(menuItemSel).querySelector(':scope > ' + subMenusSel)) ) {
						item.closest(menuItemSel).classList.add('current');
						item.closest(menuItemSel).querySelector(':scope > ' + subMenuTriggerSel)?.classList.add('icon-rotate-90');
					} else {
						item.closest(menuItemSel).classList.remove('current');
						item.closest(menuItemSel).querySelector(':scope > ' + subMenuTriggerSel)?.classList.remove('icon-rotate-90');
					}
				};

				setCurrent(triggerEl, menuItemSel, subMenusSel, subMenuTriggerSel);
				__core.parents(triggerEl, menuItemSel).forEach( function(item) {
					setCurrent(item, menuItemSel, subMenusSel, subMenuTriggerSel);
				});
			};

			var _trigger = function() {
				var body = __core.getVars.elBody.classList;

				document.querySelectorAll('.primary-menu-trigger').forEach( function(menuTrigger) {
					menuTrigger.onclick = function(e) {
						e.preventDefault();

						var elTarget = menuTrigger.getAttribute( 'data-target' ) || '*';

						if( __core.filtered( __core.getVars.elPrimaryMenus, elTarget ).length < 1 ) {
							return;
						}

						if( !body.contains('is-expanded-menu') ) {
							__core.getVars.elPrimaryMenus.forEach( function(el) {
								if( el.querySelectorAll('.mobile-primary-menu').length > 0 ) {
									el.matches(elTarget) && el.querySelectorAll('.mobile-primary-menu').forEach( function(elem) {
										elem.classList.toggle('d-block');
									});
								} else {
									el.matches(elTarget) && el.querySelectorAll('.menu-container').forEach( function(elem) {
										elem.classList.toggle('d-block');
									});
								}
							});
						}

						menuTrigger.classList.toggle('primary-menu-trigger-active');
						__core.getVars.elPrimaryMenus.forEach( function(elem) {
							elem.matches(elTarget) && elem.classList.toggle('primary-menu-active');
						});

						body.toggle('primary-menu-open');

						if( elTarget != '*' ) {
							body.toggle('primary-menu-open-' + elTarget.replace(/[^a-zA-Z0-9-]/g, ""));
						} else {
							body.toggle('primary-menu-open-all');
						}
					};
				});
			};

			var _fullWidth = function() {
				var body = __core.getVars.elBody.classList;

				if( !body.contains('is-expanded-menu') ) {
					document.querySelectorAll('.mega-menu-content, .top-search-form').forEach( function(el) {
						el.style.width = '';
					});
					return true;
				}

				var headerWidth = document.querySelector('.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content')?.closest('.header-row').offsetWidth;

				if( __core.getVars.elHeader.querySelectorAll('.container-fullwidth').length > 0 ) {
					document.querySelectorAll('.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content').forEach( function(el) {
						el.style.width = headerWidth + 'px';
					});
				}

				document.querySelectorAll('.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content, .top-search-form').forEach( function(el) {
					el.style.width = headerWidth + 'px';
				});

				if( __core.getVars.elHeader.classList.contains('full-header') ) {
					document.querySelectorAll('.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content').forEach( function(el) {
						el.style.width = headerWidth + 'px';
					});
				}

				if( __core.getVars.elHeader.classList.contains('floating-header') ) {
					var floatingHeaderPadding = getComputedStyle(document.querySelector('#header')).getPropertyValue('--cnvs-header-floating-padding');
					document.querySelectorAll('.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content').forEach( function(el) {
						el.style.width = (headerWidth + (Number(floatingHeaderPadding.split('px')[0]) *2)) + 'px';
					});
				}
			};

			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					_init();
					_reset();
					_arrows();
					_invert();
					_functions();
					_trigger();
					_fullWidth();

					var windowWidth = __core.viewport().width;
					__core.getVars.resizers.menus = function() {
						if( windowWidth != __core.viewport().width ) {
							__base.menus();
						}
					};

					__core.getVars.recalls.menureset = function() {
						_reset();
						_functions();
					};
				}
			};
		}(),
		// Menu Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Page-Menu Functions Start
		 * --------------------------------------------------------------------------
		 */
		PageMenu: function() {
			var _sticky = function(stickyOffset) {
				var pageMenu = __core.getVars.elPageMenu;

				if( window.pageYOffset > stickyOffset ) {
					if( __core.getVars.elBody.classList.contains('device-up-lg') ) {
						pageMenu.classList.add('sticky-page-menu');
					} else {
						if( pageMenu.getAttribute('data-mobile-sticky') == 'true' ) {
							pageMenu.classList.add('sticky-page-menu');
						}
					}
				} else {
					pageMenu.classList.remove('sticky-page-menu');
				}
			};

			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var pageMenu = __core.getVars.elPageMenu,
						pageMenuWrap = pageMenu.querySelector('#page-menu-wrap'),
						pageMenuClone = pageMenu.querySelector('.page-menu-wrap-clone');

					if( !pageMenuClone ) {
						pageMenuClone = document.createElement('div');
						pageMenuClone.classList = 'page-menu-wrap-clone';

						pageMenuWrap.parentNode.insertBefore( pageMenuClone, pageMenuWrap.nextSibling);
						pageMenuClone = pageMenu.querySelector('.page-menu-wrap-clone');
					}

					pageMenuClone.style.height = pageMenu.querySelector('#page-menu-wrap').offsetHeight + 'px';

					pageMenu.querySelector('#page-menu-trigger').onclick = function(e) {
						e.preventDefault();

						__core.getVars.elBody.classList.remove('top-search-open');
						pageMenu.classList.toggle('page-menu-open');
					};

					pageMenu.querySelector('nav').onclick = function(e) {
						__core.getVars.elBody.classList.remove('top-search-open');
						document.getElementById('top-cart').classList.remove('top-cart-open');
					};

					document.addEventListener('click', function(e) {
						if( !e.target.closest('#page-menu') ) {
							pageMenu.classList.remove('page-menu-open');
						}
					}, false);

					if( pageMenu.classList.contains('no-sticky') || pageMenu.classList.contains('dots-menu') ) {
						return true;
					}

					var headerHeight;

					if( __core.getVars.elHeader.classList.contains('no-sticky') || __core.getVars.elHeader.getAttribute('data-sticky-shrink') == 'false' ) {
						headerHeight = getComputedStyle(__core.getVars.elHeader).getPropertyValue('--cnvs-header-height').split('px')[0];
					} else {
						headerHeight = getComputedStyle(__core.getVars.elHeader).getPropertyValue('--cnvs-header-height-shrink').split('px')[0];
					}

					if( __core.getVars.elHeader.getAttribute('data-sticky-shrink') == 'false' ) {
						pageMenu.style.setProperty("--cnvs-page-submenu-sticky-offset", headerHeight+'px');
					}

					setTimeout(function() {
						__core.getVars.pageMenuOffset = __core.offset(pageMenu).top - headerHeight;
						_sticky( __core.getVars.pageMenuOffset );
					}, 500);

					window.addEventListener('scroll', function(){
						_sticky( __core.getVars.pageMenuOffset );
					});

					__core.getVars.resizers.pagemenu = function() {
						setTimeout( function() {
							__core.getVars.pageMenuOffset = __core.offset(pageMenu).top - headerHeight;
							_sticky( __core.getVars.pageMenuOffset );
						}, 250);
					};
				}
			};
		}(),
		// Page-Menu Functions End

		/**
		 * --------------------------------------------------------------------------
		 * SliderDimension Functions Start (Required if using Sliders)
		 * --------------------------------------------------------------------------
		 */
		SliderDimensions: function() {
			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var slider = document.querySelector('.slider-element'),
						sliderParallaxEl = document.querySelector('.slider-parallax'),
						body = __core.getVars.elBody,
						parallaxElHeight = sliderParallaxEl?.offsetHeight,
						parallaxElWidth = sliderParallaxEl?.offsetWidth,
						slInner = sliderParallaxEl?.querySelector('.slider-inner'),
						slSwiperW = slider.querySelector('.swiper-wrapper'),
						slSwiperS = slider.querySelector('.swiper-slide'),
						slFlexHeight = slider.classList.contains('h-auto') || slider.classList.contains('min-vh-0');

					if( body.classList.contains('device-up-lg') ) {
						setTimeout(function() {
							if( slInner ) {
								slInner.style.height = parallaxElHeight + 'px';
							}
							if( slFlexHeight ) {
								parallaxElHeight = slider.querySelector('.slider-inner')?.querySelector('*').offsetHeight;
								slider.style.height = parallaxElHeight + 'px';
								if( slInner ) {
									slInner.style.height = parallaxElHeight + 'px';
								}
							}
						}, 500);

						if( slFlexHeight && slSwiperS ) {
							var slSwiperFC = slSwiperS.querySelector('*');
							if( slSwiperFC.classList.contains('container') || slSwiperFC.classList.contains('container-fluid') ) {
								slSwiperFC = slSwiperFC.querySelector('*');
							}
							if( slSwiperFC.offsetHeight > slSwiperW.offsetHeight ) {
								slSwiperW.style.height = 'auto';
							}
						}

						if( body.classList.contains('side-header') && slInner ) {
							slInner.style.width = parallaxElWidth + 'px';
						}

						if( !body.classList.contains('stretched') ) {
							parallaxElWidth = __core.getVars.elWrapper.offsetWidth;
							if( slInner ) {
								slInner.style.width = parallaxElWidth + 'px';
							}
						}
					} else {
						if( slSwiperW ) {
							slSwiperW.style.height = '';
						}

						if( sliderParallaxEl ) {
							sliderParallaxEl.style.height = '';
						}

						if( slInner ) {
							slInner.style.width = '';
							slInner.style.height = '';
						}
					}

					__core.getVars.resizers.sliderdimensions = function() {
						__base.sliderDimensions();
					};
				}
			};
		}(),
		// SliderDimension Functions End

		/**
		 * --------------------------------------------------------------------------
		 * SliderMenuClass Functions Start (Required if using Sliders with Transparent Headers)
		 * --------------------------------------------------------------------------
		 */
		SliderMenuClass: function() {
			var _swiper = function() {
				if( __core.getVars.elBody.classList.contains('is-expanded-menu') || ( __core.getVars.elHeader.classList.contains('transparent-header-responsive') && !__core.getVars.elBody.classList.contains('primary-menu-open') ) ) {
					var activeSlide = __core.getVars.elSlider.querySelector('.swiper-slide-active');
					_schemeChanger(activeSlide);
				}
			};

			var _revolution = function() {
				if( __core.getVars.elBody.classList.contains('is-expanded-menu') || ( __core.getVars.elHeader.classList.contains('transparent-header-responsive') && !__core.getVars.elBody.classList.contains('primary-menu-open') ) ) {
					var activeSlide = __core.getVars.elSlider.querySelector('.active-revslide');
					_schemeChanger(activeSlide);
				}
			};

			var _schemeChanger = function(activeSlide) {
				if( !activeSlide ) {
					return;
				}

				var darkExists = false,
					oldClassesArray,
					noOfOldClasses;

				if( activeSlide.classList.contains('dark') ){
					if( __core.getVars.headerClasses ) {
						oldClassesArray = __core.getVars.headerClasses;
					} else {
						oldClassesArray = '';
					}

					noOfOldClasses = oldClassesArray.length;

					if( noOfOldClasses > 0 ) {
						for( var i=0; i<noOfOldClasses; i++ ) {
							if( oldClassesArray[i] == 'dark' ) {
								darkExists = true;
								break;
							}
						}
					}

					var headerToChange = document.querySelector('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)');
					if( headerToChange ) {
						headerToChange.classList.add('dark');
					}

					if( !darkExists ) {
						var headerToChange = document.querySelector('#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header');
						if( headerToChange ) {
							headerToChange.classList.remove('dark');
						}
					}
					__core.getVars.elHeaderWrap.classList.remove('not-dark');
				} else {
					if( __core.getVars.elBody.classList.contains('dark') ) {
						activeSlide.classList.add('not-dark');
						document.querySelector('#header.transparent-header:not(.semi-transparent,.floating-header)').classList.remove('dark');
						document.querySelector('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').querySelector('#header-wrap').classList.add('not-dark');
					} else {
						document.querySelector('#header.transparent-header:not(.semi-transparent,.floating-header)').classList.remove('dark');
						__core.getVars.elHeaderWrap.classList.remove('not-dark');
					}
				}

				if( __core.getVars.elHeader.classList.contains('sticky-header') ) {
					__base.headers();
				}
			};

			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					_swiper();
					_revolution();
					__base.setBSTheme();

					__core.getVars.resizers.slidermenuclass = function() {
						__base.sliderMenuClass();
					};
				}
			};
		}(),
		// SliderMenuClass Functions End

		/**
		 * --------------------------------------------------------------------------
		 * TopSearch Functions Start (Required)
		 * --------------------------------------------------------------------------
		 */
		TopSearch: function() {
			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var searchForm = document.querySelector('.top-search-form');

					if( !searchForm ) {
						return true;
					}

					searchForm.closest('.header-row').classList.add( 'top-search-parent' );

					var topSearchParent = document.querySelector('.top-search-parent'),
						timeout;

					selector[0].onclick = function(e) {
						e.stopPropagation();
						e.preventDefault();

						clearTimeout( timeout );

						__core.getVars.elBody.classList.toggle('top-search-open');
						document.getElementById('top-cart')?.classList.remove('top-cart-open');

						__core.getVars.recalls.menureset();

						if( __core.getVars.elBody.classList.contains('top-search-open') ) {
							topSearchParent.classList.add('position-relative');
						} else {
							timeout = setTimeout( function() {
								topSearchParent.classList.remove('position-relative');
							}, 500);
						}

						__core.getVars.elBody.classList.remove("primary-menu-open");
						__core.getVars.elPageMenu && __core.getVars.elPageMenu.classList.remove('page-menu-open');

						if (__core.getVars.elBody.classList.contains('top-search-open')){
							searchForm.querySelector('input').focus();
						}
					};

					document.addEventListener( 'click', function(e) {
						if (!e.target.closest('.top-search-form')) {
							__core.getVars.elBody.classList.remove('top-search-open');
							timeout = setTimeout( function() {
								topSearchParent.classList.remove('position-relative');
							}, 500);
						}
					}, false);
				}
			};
		}(),
		// TopSearch Functions End

		/**
		 * --------------------------------------------------------------------------
		 * TopCart Functions Start (Required)
		 * --------------------------------------------------------------------------
		 */
		TopCart: function() {
			return {
				init: function(selector) {
					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					if( !document.getElementById('top-cart-trigger') ) {
						return false;
					}

					document.getElementById('top-cart-trigger').onclick = function(e) {
						e.stopPropagation();
						e.preventDefault();

						selector[0].classList.toggle('top-cart-open');
					};

					document.addEventListener('click', function(e) {
						if( !e.target.closest('#top-cart') ) {
							selector[0].classList.remove('top-cart-open');
						}
					}, false);
				}
			};
		}(),
		// TopCart Functions End

		/**
		 * --------------------------------------------------------------------------
		 * SidePanel Functions Start
		 * --------------------------------------------------------------------------
		 */
		SidePanel: function() {
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
		}(),
		// SidePanel Functions End

		/**
		 * --------------------------------------------------------------------------
		 * AdaptiveColorScheme Functions Start
		 * --------------------------------------------------------------------------
		 */
		AdaptiveColorScheme: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-adaptivecolorscheme', event: 'pluginAdaptiveColorSchemeReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var adaptiveEl = document.querySelector('[data-adaptive-light-class],[data-adaptive-dark-class]');
					var adaptLightClass;
					var adaptDarkClass;

					if( __core.getVars.elBody.contains(adaptiveEl) ) {
						adaptLightClass = adaptiveEl.getAttribute( 'data-adaptive-light-class' );
						adaptDarkClass = adaptiveEl.getAttribute( 'data-adaptive-dark-class' );
					}

					var adaptClasses = function(dark) {
						if( dark ) {
							__core.getVars.elBody.classList.add( 'dark' );
						} else {
							__core.getVars.elBody.classList.remove('dark');
						}

						if( __core.getVars.elBody.contains(adaptiveEl) ) {
							if( dark ) {
								adaptiveEl.classList.remove( adaptLightClass );
								adaptiveEl.classList.add( adaptDarkClass );
							} else {
								adaptiveEl.classList.remove( adaptDarkClass );
								adaptiveEl.classList.add( adaptLightClass );
							}
						}

						__base.setBSTheme();
					};

					if( window.matchMedia ) {
						adaptClasses( window.matchMedia('(prefers-color-scheme: dark)').matches );

						window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
							adaptClasses( e.matches );
						});
					}
				}
			};
		}(),
		// AdaptiveColorScheme Functions End

		/**
		 * --------------------------------------------------------------------------
		 * PortfolioAjax Functions Start
		 * --------------------------------------------------------------------------
		 */
		PortfolioAjax: function() {
			var _newNextPrev = function(portPostId) {
				var portNext = _getNext(portPostId);
				var portPrev = _getPrev(portPostId);
				var portNav = document.getElementById('portfolio-navigation');

				if( !document.getElementById('prev-portfolio') && portPrev ) {
					var prevPortItem = document.createElement('a');
					prevPortItem.setAttribute('href', '#');
					prevPortItem.setAttribute('id', 'prev-portfolio');
					prevPortItem.setAttribute('data-id', portPrev);
					prevPortItem.innerHTML = '<i class="bi-arrow-left"></i>';
					prevPortItem && portNav?.insertBefore(prevPortItem, document.getElementById('close-portfolio'));
				}

				if( !document.getElementById('next-portfolio') && portNext ) {
					var nextPortItem = document.createElement('a');
					nextPortItem.setAttribute('href', '#');
					nextPortItem.setAttribute('id', 'next-portfolio');
					nextPortItem.setAttribute('data-id', portNext);
					nextPortItem.innerHTML = '<i class="bi-arrow-right"></i>';
					nextPortItem && portNav?.insertBefore(nextPortItem, document.getElementById('close-portfolio'));
				}
			};

			var _load = function(portPostId, prevPostPortId, getIt) {
				if( !getIt ) {
					getIt = false;
				}

				var portNext = _getNext(portPostId);
				var portPrev = _getPrev(portPostId);

				if( getIt == false ) {
					_close();
					__core.getVars.elBody.classList.add('portfolio-ajax-loading');
					// __core.getVars.portfolioAjax.loader.classList.add('loader-overlay-display');
					var portfolioDataLoader = document.getElementById(portPostId).getAttribute('data-loader');

					fetch(portfolioDataLoader).then( function(response) {
						return response.text();
					}).then( function(html) {
						__core.getVars.portfolioAjax.container.innerHTML = html;

						var nextPortfolio = document.getElementById('next-portfolio'),
							prevPortfolio = document.getElementById('prev-portfolio');

						nextPortfolio?.classList.add('d-none');
						prevPortfolio?.classList.add('d-none');

						if( portNext ) {
							nextPortfolio?.setAttribute('data-id', portNext);
							nextPortfolio?.classList.remove('d-none');
						}

						if( portPrev ) {
							prevPortfolio?.setAttribute('data-id', portPrev);
							prevPortfolio?.classList.remove('d-none');
						}

						_initAjax(portPostId);
						_open();

						__core.getVars.portfolioAjax.items.forEach( function(item) {
							item.classList.remove('portfolio-active');
						});

						document.getElementById(portPostId).classList.add('portfolio-active');
					}).catch( function(error) {
						console.warn('Something went wrong.', error);
					});
				}
			};

			var _close = function() {
				if( __core.getVars.portfolioAjax.wrapper && __core.getVars.portfolioAjax.wrapper.offsetHeight > 32 ) {
					__core.getVars.elBody.classList.remove('portfolio-ajax-loading');
					// __core.getVars.portfolioAjax.loader.classList.add('loader-overlay-display');
					__core.getVars.portfolioAjax.wrapper.classList.remove('portfolio-ajax-opened');

					__core.getVars.portfolioAjax.wrapper.querySelector('#portfolio-ajax-single').addEventListener('transitionend', function() {
						__core.getVars.portfolioAjax.wrapper.querySelector('#portfolio-ajax-single').remove();
					});

					__core.getVars.portfolioAjax.items.forEach( function(item) {
						item.classList.remove('portfolio-active');
					});
				}
			};

			var _open = function() {
				var countImages = __core.getVars.portfolioAjax.container.querySelectorAll('img').length;

				if( countImages < 1 ) {
					_display();
				} else {
					__core.imagesLoaded(__core.getVars.portfolioAjax.container);
					__core.getVars.portfolioAjax.container.addEventListener( 'CanvasImagesLoaded', function() {
						_display();
					});
				}
			};

			var _display = function() {
				__core.getVars.portfolioAjax.container.style.display = 'block';
				__core.getVars.portfolioAjax.wrapper.classList.add('portfolio-ajax-opened');
				__core.getVars.elBody.classList.remove('portfolio-ajax-loading');
				// __core.getVars.portfolioAjax.loader.classList.remove('loader-overlay-display');
				setTimeout( function() {
					__core.runContainerModules( __core.getVars.portfolioAjax.wrapper );
					window.scrollTo({
						top: __core.getVars.portfolioAjax.wrapperOffset - __core.getVars.topScrollOffset - 60,
						behavior: 'smooth'
					});
				}, 500);
			}

			var _getNext = function(portPostId) {
				var portNext = false;
				var hasNext = document.getElementById(portPostId).nextElementSibling;

				if( hasNext ) {
					portNext = hasNext.getAttribute('id');
				}

				return portNext;
			};

			var _getPrev = function(portPostId) {
				var portPrev = false;
				var hasPrev = document.getElementById(portPostId).previousElementSibling;

				if( hasPrev ) {
					portPrev = hasPrev.getAttribute('id');
				}

				return portPrev;
			};

			var _initAjax = function(portPostId) {
				__core.getVars.portfolioAjax.prevItem = document.getElementById(portPostId);

				_newNextPrev(portPostId);

				document.querySelectorAll('#next-portfolio, #prev-portfolio').forEach( function(el) {
					el.onclick = function(e) {
						e.preventDefault();
						_close();

						var portPostId = el.getAttribute('data-id');
						document.getElementById(portPostId).classList.add('portfolio-active');
						_load(portPostId, __core.getVars.portfolioAjax.prevItem);
					};
				})

				document.getElementById('close-portfolio').onclick = function(e) {
					e.preventDefault();
					_close();
				};
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-ajaxportfolio', event: 'pluginAjaxPortfolioReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					__core.getVars.portfolioAjax.items = selector[0].querySelectorAll('.portfolio-item');
					__core.getVars.portfolioAjax.wrapper = document.getElementById('portfolio-ajax-wrap');
					__core.getVars.portfolioAjax.wrapperOffset = __core.offset(__core.getVars.portfolioAjax.wrapper).top;
					__core.getVars.portfolioAjax.container = document.getElementById('portfolio-ajax-container');
					__core.getVars.portfolioAjax.loader = document.getElementById('portfolio-ajax-loader');
					__core.getVars.portfolioAjax.prevItem = '';

					selector[0].querySelectorAll('.portfolio-ajax-trigger').forEach( function(el) {
						if( !el.querySelector('i:nth-child(2)') ) {
							el.innerHTML += '<i class="bi-arrow-repeat icon-spin"></i>';
						}

						el.onclick = function(e) {
							e.preventDefault();

							var portPostId = e.target.closest('.portfolio-item').getAttribute('id');

							if( !e.target.closest('.portfolio-item').classList.contains('portfolio-active') ) {
								_load(portPostId, __core.getVars.portfolioAjax.prevItem);
							}
						};
					});
				}
			};
		}(),
		// PortfolioAjax Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Cursor Functions Start
		 * --------------------------------------------------------------------------
		 */
		Cursor: function() {
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
		}(),
		// Cursor Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Bootstrap Functions Start
		 * --------------------------------------------------------------------------
		 */
		Bootstrap: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof bootstrap !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-bootstrap', event: 'pluginBootstrapReady' });
					});
				}
			};
		}(),
		// Bootstrap Functions End

		/**
		 * --------------------------------------------------------------------------
		 * ResizeVideos Functions Start
		 * --------------------------------------------------------------------------
		 */
		ResizeVideos: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().fitVids;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-fitvids', event: 'pluginFitVidsReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.parent().fitVids({
							customSelector: 'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]',
							ignore: '.no-fv'
						});
					});
				}
			};
		}(),
		// ResizeVideos Functions End

		/**
		 * --------------------------------------------------------------------------
		 * PageTransition Functions Start
		 * --------------------------------------------------------------------------
		 */
		PageTransition: function() {
			return {
				init: function(selector) {
					var body = __core.getVars.elBody;

					__core.initFunction({ class: 'has-plugin-pagetransition', event: 'pluginPageTransitionReady' });

					if( body.classList.contains('no-transition') ) {
						return true;
					}

					if( !body.classList.contains('page-transition') ) {
						body.classList.add('page-transition');
					}

					window.onpageshow = function(event) {
						if(event.persisted) {
							window.location.reload();
						}
					};

					var pageTransition = document.querySelector('.page-transition-wrap');

					var elAnimIn = body.getAttribute('data-animation-in') || 'fadeIn',
						elSpeedIn = body.getAttribute('data-speed-in') || 1000,
						elTimeoutActive = false,
						elTimeout = body.getAttribute('data-loader-timeout'),
						elLoader = body.getAttribute('data-loader'),
						elLoaderColor = body.getAttribute('data-loader-color'),
						elLoaderHtml = body.getAttribute('data-loader-html'),
						elLoaderAppend = '',
						elLoaderCSSVar = '';

					if( !elTimeout ) {
						elTimeoutActive = false;
						elTimeout = false;
					} else {
						elTimeoutActive = true;
						elTimeout = Number(elTimeout);
					}

					if( elLoaderColor ) {
						if( elLoaderColor == 'theme' ) {
							elLoaderCSSVar = ' style="--cnvs-loader-color:var(--cnvs-themecolor);"';
						} else {
							elLoaderCSSVar = ' style="--cnvs-loader-color:'+elLoaderColor+';"';
						}
					}

					var elLoaderBefore = '<div class="css3-spinner"'+elLoaderCSSVar+'>',
						elLoaderAfter = '</div>';

					if( elLoader == '2' ) {
						elLoaderAppend = '<div class="css3-spinner-flipper"></div>';
					} else if( elLoader == '3' ) {
						elLoaderAppend = '<div class="css3-spinner-double-bounce1"></div><div class="css3-spinner-double-bounce2"></div>';
					} else if( elLoader == '4' ) {
						elLoaderAppend = '<div class="css3-spinner-rect1"></div><div class="css3-spinner-rect2"></div><div class="css3-spinner-rect3"></div><div class="css3-spinner-rect4"></div><div class="css3-spinner-rect5"></div>';
					} else if( elLoader == '5' ) {
						elLoaderAppend = '<div class="css3-spinner-cube1"></div><div class="css3-spinner-cube2"></div>';
					} else if( elLoader == '6' ) {
						elLoaderAppend = '<div class="css3-spinner-scaler"></div>';
					} else if( elLoader == '7' ) {
						elLoaderAppend = '<div class="css3-spinner-grid-pulse"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
					} else if( elLoader == '8' ) {
						elLoaderAppend = '<div class="css3-spinner-clip-rotate"><div></div></div>';
					} else if( elLoader == '9' ) {
						elLoaderAppend = '<div class="css3-spinner-ball-rotate"><div></div><div></div><div></div></div>';
					} else if( elLoader == '10' ) {
						elLoaderAppend = '<div class="css3-spinner-zig-zag"><div></div><div></div></div>';
					} else if( elLoader == '11' ) {
						elLoaderAppend = '<div class="css3-spinner-triangle-path"><div></div><div></div><div></div></div>';
					} else if( elLoader == '12' ) {
						elLoaderAppend = '<div class="css3-spinner-ball-scale-multiple"><div></div><div></div><div></div></div>';
					} else if( elLoader == '13' ) {
						elLoaderAppend = '<div class="css3-spinner-ball-pulse-sync"><div></div><div></div><div></div></div>';
					} else if( elLoader == '14' ) {
						elLoaderAppend = '<div class="css3-spinner-scale-ripple"><div></div><div></div><div></div></div>';
					} else {
						elLoaderAppend = '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>';
					}

					if( !elLoaderHtml ) {
						elLoaderHtml = elLoaderAppend;
					}

					elLoaderHtml = elLoaderBefore + elLoaderHtml + elLoaderAfter;

					if( elAnimIn == 'fadeIn' ) {
						__core.getVars.elWrapper.classList.add('op-1');
					} else {
						__core.getVars.elWrapper.classList.add('not-animated');
					}

					if( !pageTransition ) {
						var divPT = document.createElement('div');
						divPT.classList.add('page-transition-wrap');
						divPT.innerHTML = elLoaderHtml;
						body.prepend( divPT );
						pageTransition = document.querySelector('.page-transition-wrap');
					}

					if( elSpeedIn ) {
						__core.getVars.elWrapper.style.setProperty('--cnvs-animate-duration', Number(elSpeedIn)+'ms');
						if( elAnimIn == 'fadeIn' ) {
							pageTransition.style.setProperty('--cnvs-animate-duration', Number(elSpeedIn)+'ms');
						}
					}

					var endPageTransition = function() {
						elAnimIn.split(" ").forEach( function(_class) {
							pageTransition.classList.remove(_class);
						});

						pageTransition.classList.add('fadeOut', 'animated');

						var removePageTransition = function() {
							pageTransition.remove();
							if( elAnimIn != 'fadeIn' ) {
								__core.getVars.elWrapper.classList.remove('not-animated');
								(elAnimIn + ' animated').split(" ").forEach(function(_class) {
									__core.getVars.elWrapper.classList.add(_class);
								});
							}
						};

						var displayContent = function() {
							body.classList.remove('page-transition');

							setTimeout(function() {
								(elAnimIn + ' animated').split(" ").forEach( function(_class) {
									__core.getVars.elWrapper.classList.remove(_class);
								});
							}, 333);

							setTimeout(function() {
								__core.getVars.elWrapper.style.removeProperty('--cnvs-animate-duration');
							}, 666);
						};

						pageTransition.addEventListener('transitionend', removePageTransition);
						pageTransition.addEventListener('animationend', removePageTransition);
						__core.getVars.elWrapper.addEventListener('transitionend', displayContent);
						__core.getVars.elWrapper.addEventListener('animationend', displayContent);

						return true;
					};

					if( document.readyState === 'complete' ) {
						endPageTransition();
					}

					if( elTimeoutActive ) {
						setTimeout( endPageTransition, elTimeout );
					}

					window.addEventListener('load', function(){
						endPageTransition();
					});
				}
			};
		}(),
		// PageTransition Functions End

		/**
		 * --------------------------------------------------------------------------
		 * LazyLoad Functions Start
		 * --------------------------------------------------------------------------
		 */
		LazyLoad: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof LazyLoad !== "undefined"
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-lazyload', event: 'pluginlazyLoadReady' });

						window.lazyLoadInstance = new LazyLoad({
							threshold: 150,
							elements_selector: '.lazy:not(.lazy-loaded)',
							class_loading: 'lazy-loading',
							class_loaded: 'lazy-loaded',
							class_error: 'lazy-error',
							callback_loaded: function(el) {
								__core.addEvent( window, 'lazyLoadLoaded' );
								if( el.parentNode.getAttribute('data-lazy-container') == 'true' ) {
									__core.runContainerModules( el.parentNode );
								}
								__modules.parallax();
							}
						});
					});
				}
			};
		}(),
		// LazyLoad Functions End

		/**
		 * --------------------------------------------------------------------------
		 * DataClasses Functions Start
		 * --------------------------------------------------------------------------
		 */
		DataClasses: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-dataclasses', event: 'pluginDataClassesReady' });

					selector = __core.getSelector( selector, false, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(el) {
						var classes = el.getAttribute('data-class');

						classes = classes.split(/ +/);
						if( classes.length > 0 ) {
							classes.forEach( function(_class) {
								var deviceClass = _class.split(":");
								if( __core.getVars.elBody.classList.contains(deviceClass[0] == 'dark' ? deviceClass[0] : 'device-' + deviceClass[0]) ) {
									el.classList.add(deviceClass[1]);
								} else {
									el.classList.remove(deviceClass[1]);
								}
							});
						}
					});

					__core.getVars.resizers.dataClasses = function() {
						setTimeout( function() {
							__modules.dataClasses();
						}, 333);
					};
				}
			};
		}(),
		// DataClasses Functions End

		/**
		 * --------------------------------------------------------------------------
		 * DataHeights Functions Start
		 * --------------------------------------------------------------------------
		 */
		DataHeights: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-dataheights', event: 'pluginDataHeightsReady' });

					selector = __core.getSelector( selector, false, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(el) {
						var heightXs = el.getAttribute('data-height-xs') || 'auto',
							heightSm = el.getAttribute('data-height-sm') || heightXs,
							heightMd = el.getAttribute('data-height-md') || heightSm,
							heightLg = el.getAttribute('data-height-lg') || heightMd,
							heightXl = el.getAttribute('data-height-xl') || heightLg,
							heightXxl = el.getAttribute('data-height-xxl') || heightXl,
							body = __core.getVars.elBody.classList,
							elHeight;

						if( body.contains('device-xs') ) {
							elHeight = heightXs;
						} else if( body.contains('device-sm') ) {
							elHeight = heightSm;
						} else if( body.contains('device-md') ) {
							elHeight = heightMd;
						} else if( body.contains('device-lg') ) {
							elHeight = heightLg;
						} else if( body.contains('device-xl') ) {
							elHeight = heightXl;
						} else if( body.contains('device-xxl') ) {
							elHeight = heightXxl;
						}

						if( elHeight ) {
							el.style.height = !isNaN( elHeight ) ? elHeight + 'px' : elHeight;
						}
					});

					__core.getVars.resizers.dataHeights = function() {
						__modules.dataHeights();
					};
				}
			};
		}(),
		// DataHeights Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Lightbox Functions Start
		 * --------------------------------------------------------------------------
		 */
		Lightbox: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().magnificPopup;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-lightbox', event: 'pluginLightboxReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						var closeButtonIcon = '<i class="bi-x-lg"></i>';

						selector.each( function(){
							var element = jQuery(this),
								elType = element.attr('data-lightbox'),
								elCloseButton = element.attr('data-close-button') || 'outside',
								elDisableUnder = element.attr('data-disable-under') || 600,
								elFixedContent = element.attr('data-content-position') || 'auto',
								elZoom = element.attr('data-zoom'),
								$body = jQuery('body');

							elCloseButton = elCloseButton == 'inside' ? true : false;
							elFixedContent = elFixedContent == 'fixed' ? true : false;

							if( elType == 'image' ) {
								var settings = {
									type: 'image',
									tLoading: '',
									closeOnContentClick: true,
									closeBtnInside: elCloseButton,
									fixedContentPos: true,
									mainClass: 'mfp-no-margins mfp-fade',
									image: {
										verticalFit: true
									},
									closeIcon: closeButtonIcon,
								};

								if( elZoom == 'true' ) {
									settings.zoom = {
										enabled: true,
										duration: 300,
										easing: 'ease-in-out',
										opener: function(openerElement) {
											return openerElement.is('img') ? openerElement : openerElement.find('img');
										}
									};
								}

								element.magnificPopup(settings);
							}

							if( elType == 'gallery' ) {
								if( element.find('a[data-lightbox="gallery-item"]').parent('.clone').hasClass('clone') ) {
									element.find('a[data-lightbox="gallery-item"]').parent('.clone').find('a[data-lightbox="gallery-item"]').attr('data-lightbox','');
								}

								if( element.find('a[data-lightbox="gallery-item"]').parents('.cloned').hasClass('cloned') ) {
									element.find('a[data-lightbox="gallery-item"]').parents('.cloned').find('a[data-lightbox="gallery-item"]').attr('data-lightbox','');
								}

								element.magnificPopup({
									delegate: element.hasClass('grid-container-filterable') ? 'a.grid-lightbox-filtered[data-lightbox="gallery-item"]' : 'a[data-lightbox="gallery-item"]',
									type: 'image',
									tLoading: '',
									closeOnContentClick: true,
									closeBtnInside: elCloseButton,
									fixedContentPos: true,
									mainClass: 'mfp-no-margins mfp-fade', // class to remove default margin from left and right side
									image: {
										verticalFit: true
									},
									gallery: {
										enabled: true,
										navigateByImgClick: true,
										preload: [0,1] // Will preload 0 - before current, and 1 after the current image
									},
									closeIcon: closeButtonIcon,
								});
							}

							if( elType == 'iframe' ) {
								element.magnificPopup({
									disableOn: Number( elDisableUnder ),
									type: 'iframe',
									tLoading: '',
									removalDelay: 160,
									preloader: false,
									closeBtnInside: elCloseButton,
									fixedContentPos: elFixedContent,
									closeIcon: closeButtonIcon,
								});
							}

							if( elType == 'inline' ) {
								element.magnificPopup({
									type: 'inline',
									tLoading: '',
									mainClass: 'mfp-no-margins mfp-fade',
									closeBtnInside: elCloseButton,
									fixedContentPos: true,
									overflowY: 'scroll',
									closeIcon: closeButtonIcon,
								});
							}

							if( elType == 'ajax' ) {
								element.magnificPopup({
									type: 'ajax',
									tLoading: '',
									closeBtnInside: elCloseButton,
									autoFocusLast: false,
									closeIcon: closeButtonIcon,
									callbacks: {
										ajaxContentAdded: function(mfpResponse) {
											__core.runContainerModules( document.querySelector('.mfp-content') );
										},
										open: function() {
											$body.addClass('ohidden');
										},
										close: function() {
											$body.removeClass('ohidden');
										}
									}
								});
							}

							if( elType == 'ajax-gallery' ) {
								element.magnificPopup({
									delegate: 'a[data-lightbox="ajax-gallery-item"]',
									type: 'ajax',
									tLoading: '',
									closeBtnInside: elCloseButton,
									closeIcon: closeButtonIcon,
									autoFocusLast: false,
									gallery: {
										enabled: true,
										preload: 0,
										navigateByImgClick: false
									},
									callbacks: {
										ajaxContentAdded: function(mfpResponse) {
											__core.runContainerModules( document.querySelector('.mfp-content') );
										},
										open: function() {
											$body.addClass('ohidden');
										},
										close: function() {
											$body.removeClass('ohidden');
										}
									}
								});
							}

							element.on( 'mfpOpen', function(){
								var lightboxItem = jQuery.magnificPopup.instance.currItem.el,
									lightboxClass = jQuery( lightboxItem ).attr('data-lightbox-class'),
									lightboxBgClass = jQuery( lightboxItem ).attr('data-lightbox-bg-class');

								if( lightboxClass != '' ) {
									jQuery(jQuery.magnificPopup.instance.container).addClass( lightboxClass );
								}

								if( lightboxBgClass != '' ) {
									jQuery(jQuery.magnificPopup.instance.bgOverlay).addClass( lightboxBgClass );
								}
							});
						});
					});
				}
			};
		}(),
		// Lightbox Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Modal Functions Start
		 * --------------------------------------------------------------------------
		 */
		Modal: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					var hasCookies = false;
					__core.getSelector( selector, false ).forEach( function(el) {
						if( el.hasAttribute('data-cookies') ) {
							hasCookies = true;
							return true;
						}
					});

					var checkCookies = function() {
						if( hasCookies ) {
							if( typeof Cookies !== "undefined" ) {
								return true;
							}

							return false;
						} else {
							return true;
						}
					};

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().magnificPopup && checkCookies;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-modal', event: 'pluginModalReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						var closeButtonIcon = '<i class="bi-x-lg"></i>';

						selector.each( function(){
							var element = jQuery(this),
								elTarget = element.attr('data-target'),
								elTargetValue = elTarget.split('#')[1],
								elDelay = element.attr('data-delay') || 500,
								elTimeout = element.attr('data-timeout'),
								elAnimateIn = element.attr('data-animate-in'),
								elAnimateOut = element.attr('data-animate-out'),
								elBgClick = element.attr('data-bg-click'),
								elCloseBtn = element.attr('data-close-btn'),
								elCookies = element.attr('data-cookies'),
								elCookiePath = element.attr('data-cookie-path'),
								elCookieExp = element.attr('data-cookie-expire');

							if( elCookies == "false" ) {
								Cookies.remove( elTargetValue );
							}

							if( elCookies == 'true' ) {
								var elementCookie = Cookies.get( elTargetValue );

								if( typeof elementCookie !== 'undefined' && elementCookie == '0' ) {
									return true;
								}
							}

							if( elBgClick == 'false' ) {
								elBgClick = false;
							} else {
								elBgClick = true;
							}

							if( elCloseBtn == 'false' ) {
								elCloseBtn = false;
							} else {
								elCloseBtn = true;
							}

							elDelay = Number(elDelay) + 500;

							setTimeout(function() {
								jQuery.magnificPopup.open({
									items: { src: elTarget },
									type: 'inline',
									mainClass: 'mfp-no-margins mfp-fade',
									closeBtnInside: false,
									fixedContentPos: true,
									closeOnBgClick: elBgClick,
									showCloseBtn: elCloseBtn,
									removalDelay: 500,
									closeIcon: closeButtonIcon,
									callbacks: {
										open: function(){
											if( elAnimateIn != '' ) {
												jQuery(elTarget).addClass( elAnimateIn + ' animated' );
											}
										},
										beforeClose: function(){
											if( elAnimateOut != '' ) {
												jQuery(elTarget).removeClass( elAnimateIn ).addClass( elAnimateOut );
											}
										},
										afterClose: function() {
											if( elAnimateIn != '' || elAnimateOut != '' ) {
												jQuery(elTarget).removeClass( elAnimateIn + ' ' + elAnimateOut + ' animated' );
											}
											if( elCookies == 'true' ) {
												var cookieOps = {};

												if( elCookieExp ) {
													cookieOps.expires = Number( elCookieExp );
												}

												if( elCookiePath ) {
													cookieOps.path = elCookiePath;
												}

												Cookies.set( elTargetValue, '0', cookieOps );
											}
										}
									}
								}, 0);
							}, elDelay );

							if( elTimeout != '' ) {
								setTimeout(function() {
									jQuery.magnificPopup.close();
								}, elDelay + Number(elTimeout) );
							}
						});
					});
				}
			};
		}(),
		// Modal Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Parallax Functions Start
		 * --------------------------------------------------------------------------
		 */
		Parallax: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof simpleParallax !== "undefined";
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-parallax', event: 'pluginParallaxReady' });

						selector = __core.getSelector( selector, false );
						if( selector.length < 1 ){
							return true;
						}

						var instances = [],
							i = 0;

						selector.forEach( function(el) {
							var speed = el.getAttribute('data-parallax-speed') || 0.4,
								scale = el.getAttribute('data-parallax-scale') || 1.25,
								overflow = el.getAttribute('data-parallax-overflow') || false,
								maxTrans = el.getAttribute('data-parallax-max-transition') || 0,
								mobile = el.getAttribute('data-mobile') || 'false',
								direction = el.getAttribute('data-direction') || 'up';

							if( overflow == "true" ) {
								overflow = true;
							}

							if( __mobile.any() && mobile == 'false' ) {
								el.classList.add('mobile-parallax');
							} else {
								instances[i] = new simpleParallax(el, {
									orientation: direction,
									scale: Number(scale),
									overflow: overflow,
									delay: Number(speed),
									maxTransition: Number(maxTrans)
								});
							}

							i++;
						});

						__core.getVars.resizers.parallax = function() {
							__modules.parallax();
						};
					});
				}
			};
		}(),
		// Parallax Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Animations Functions Start
		 * --------------------------------------------------------------------------
		 */
		Animations: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-animations', event: 'pluginAnimationsReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var SELECTOR = '[data-animate]',
						ANIMATE_CLASS_NAME = 'animated';

					var isAnimated = function(element) {
						element.classList.contains(ANIMATE_CLASS_NAME);
					};

					var intersectionObserver = new IntersectionObserver(
						function(entries, observer) {
							entries.forEach( function(entry) {
								var element = entry.target,
									elAnimation = element.getAttribute('data-animate'),
									elAnimOut = element.getAttribute('data-animate-out'),
									elAnimDelay = element.getAttribute('data-delay'),
									elAnimDelayOut = element.getAttribute('data-delay-out'),
									elAnimDelayTime = 0,
									elAnimDelayOutTime = 3000,
									elAnimations = elAnimation.split(' ');

								if( element.closest('.fslider.no-thumbs-animate') ) {
									return true;
								}

								if( element.closest('.swiper-slide') ) {
									return true;
								}

								if( elAnimDelay ) {
									elAnimDelayTime = Number( elAnimDelay ) + 500;
								} else {
									elAnimDelayTime = 500;
								}

								if( elAnimOut && elAnimDelayOut ) {
									elAnimDelayOutTime = Number( elAnimDelayOut ) + elAnimDelayTime;
								}

								if( !element.classList.contains('animated') ) {
									element.classList.add('not-animated');
									if( entry.intersectionRatio > 0 ) {
										setTimeout( function() {
											element.classList.remove('not-animated');
											elAnimations.forEach( function(item) {
												element.classList.add(item);
											});
											element.classList.add('animated');
										}, elAnimDelayTime);

										if( elAnimOut ) {
											setTimeout( function() {
												elAnimations.forEach( function(item) {
													element.classList.remove(item);
												});

												elAnimOut.split(' ').forEach( function(item) {
													element.classList.add(item);
												});
											}, elAnimDelayOutTime);
										}
									}
								}

								if( !element.classList.contains('not-animated') ) {
									observer.unobserve(element);
								}
							});
						}
					);

					var elements = [].filter.call(document.querySelectorAll(SELECTOR), function(element) {
						return !isAnimated(element, ANIMATE_CLASS_NAME);
					});

					elements.forEach( function(element) {
						return intersectionObserver.observe(element);
					});
				}
			};
		}(),
		// Animations Functions End

		/**
		 * --------------------------------------------------------------------------
		 * HoverAnimations Functions Start
		 * --------------------------------------------------------------------------
		 */
		HoverAnimations: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-hoveranimation', event: 'pluginHoverAnimationReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elAnimate = element.getAttribute( 'data-hover-animate' ),
							elAnimateOut = element.getAttribute( 'data-hover-animate-out' ) || 'fadeOut',
							elSpeed = element.getAttribute( 'data-hover-speed' ) || 600,
							elDelay = element.getAttribute( 'data-hover-delay' ),
							elParent = element.getAttribute( 'data-hover-parent' ),
							elReset = element.getAttribute( 'data-hover-reset' ) || 'false',
							elMobile = element.getAttribute( 'data-hover-mobile' ) || 'true';

						if( elMobile != 'true' ) {
							if( elMobile == 'false' ) {
								if( !__core.getVars.elBody.classList.contains('device-up-lg') ) {
									return true;
								}
							} else {
								if( !__core.getVars.elBody.classList.contains('device-up-' + elMobile) ) {
									return true;
								}
							}
						}

						element.classList.add( 'not-animated' );

						if( !elParent ) {
							if( element.closest( '.bg-overlay' ) ) {
								elParent = element.closest( '.bg-overlay' );
							} else {
								elParent = element;
							}
						} else {
							if( elParent == 'self' ) {
								elParent = element;
							} else {
								elParent = element.closest( elParent );
							}
						}

						var elDelayT = 0;

						if( elDelay ) {
							elDelayT = Number( elDelay );
						}

						if( elSpeed ) {
							element.style.animationDuration = Number( elSpeed ) + 'ms';
						}

						var t, x;

						elParent.addEventListener( 'mouseover', function() {
							clearTimeout(x);

							t = setTimeout( function() {
								element.classList.add( 'not-animated' );

								(elAnimateOut + ' not-animated').split(" ").forEach( function(_class) {
									element.classList.remove(_class);
								});

								(elAnimate + ' animated').split(" ").forEach( function(_class) {
									element.classList.add(_class);
								});
							}, elDelayT );
						}, false);

						elParent.addEventListener( 'mouseleave', function() {
							element.classList.add( 'not-animated' );

							(elAnimate + ' not-animated').split(" ").forEach( function(_class) {
								element.classList.remove(_class);
							});

							(elAnimateOut + ' animated').split(" ").forEach( function(_class) {
								element.classList.add(_class);
							});

							if( elReset == 'true' ) {
								x = setTimeout( function() {
									(elAnimateOut + ' animated').split(" ").forEach( function(_class) {
										element.classList.remove(_class);
									});

									element.classList.add( 'not-animated' );
								}, Number( elSpeed ) );
							}

							clearTimeout(t);
						}, false);
					});
				}
			};
		}(),
		// HoverAnimations Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Grid Functions Start
		 * --------------------------------------------------------------------------
		 */
		Grid: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && typeof Isotope !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-isotope', event: 'pluginIsotopeReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function() {
							var element = jQuery(this),
								elTransition = element.attr('data-transition') || '0.65s',
								elLayoutMode = element.attr('data-layout') || 'masonry',
								elStagger = element.attr('data-stagger') || 0,
								elBase = element.attr('data-basewidth') || '.portfolio-item:not(.wide):eq(0)',
								elOriginLeft = true,
								elGrid;

							if( __core.getVars.isRTL ) {
								elOriginLeft = false;
							}

							if( element.hasClass('portfolio') || element.hasClass('post-timeline') ){
								elGrid = element.isotope({
									layoutMode: elLayoutMode,
									isOriginLeft: elOriginLeft,
									transitionDuration: elTransition,
									stagger: Number( elStagger ),
									percentPosition: true,
									masonry: {
										columnWidth: element.find( elBase )[0]
									}
								});
							} else {
								elGrid = element.isotope({
									layoutMode: elLayoutMode,
									isOriginLeft: elOriginLeft,
									transitionDuration: elTransition,
									stagger: Number( elStagger ),
									percentPosition: true,
								});
							}

							if( element.data('isotope') ) {
								element.addClass('has-init-isotope');
							}

							var elementInterval = setInterval( function() {
								if( element.find('.lazy.lazy-loaded').length == element.find('.lazy').length ) {
									setTimeout( function() {
										element.filter('.has-init-isotope').isotope('layout');
									}, 666);

									clearInterval( elementInterval );
								}
							}, 1000);

							jQuery(window).on( 'lazyLoadLoaded', function() {
								element.filter('.has-init-isotope').isotope('layout');
							});

							__core.getVars.resizers.isotope = function() {
								element.filter('.has-init-isotope').isotope('layout');
							};
						});
					});
				}
			};
		}(),
		// Grid Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Filter Functions Start
		 * --------------------------------------------------------------------------
		 */
		Filter: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && typeof Isotope !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-isotope-filter', event: 'pluginGridFilterReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function() {
							var element = jQuery(this),
								elCon = element.attr('data-container'),
								elActClass = element.attr('data-active-class'),
								elDefFilter = element.attr('data-default');

							if( !elActClass ) {
								elActClass = 'activeFilter';
							}

							if( !jQuery(elCon).hasClass('grid-container') ) {
								return false;
							}

							element.find('a').off( 'click' ).on( 'click', function(){
								element.find('li').removeClass( elActClass );
								jQuery(this).parent('li').addClass( elActClass );
								var selector = jQuery(this).attr('data-filter');
								jQuery(elCon).isotope({ filter: selector });
								return false;
							});

							if( elDefFilter ) {
								element.find('li').removeClass( elActClass );
								element.find('[data-filter="'+ elDefFilter +'"]').parent('li').addClass( elActClass );
								jQuery(elCon).isotope({ filter: elDefFilter });
							}

							jQuery(elCon).on( 'arrangeComplete layoutComplete', function(event, filteredItems) {
								jQuery(elCon).addClass('grid-container-filterable');
								if( jQuery(elCon).attr('data-lightbox') == 'gallery' ) {
									jQuery(elCon).find("[data-lightbox]").removeClass('grid-lightbox-filtered');
									filteredItems.forEach( function(item) {
										jQuery(item.element).find("[data-lightbox]").addClass('grid-lightbox-filtered');
									});
								}
								__modules.lightbox();
							});
						});

						jQuery('.grid-shuffle').off( 'click' ).on( 'click', function(){
							var element = jQuery(this),
								elCon = element.attr('data-container');

							if( !jQuery(elCon).hasClass('grid-container') ) {
								return false;
							}

							jQuery(elCon).isotope('shuffle');
						});
					});
				}
			};
		}(),
		// Filter Functions End

		/**
		 * --------------------------------------------------------------------------
		 * CanvasSlider Functions Start
		 * --------------------------------------------------------------------------
		 */
		CanvasSlider: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

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
		}(),
		// CanvasSlider Functions End

		/**
		 * --------------------------------------------------------------------------
		 * SliderParallax Functions Start
		 * --------------------------------------------------------------------------
		 */
		SliderParallax: function() {
			var _animationFrame = function() {
				var lastTime = 0;
				var vendors = ['ms', 'moz', 'webkit', 'o'];
				for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
					window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
												|| window[vendors[x]+'CancelRequestAnimationFrame'];
				}

				if (!window.requestAnimationFrame)
					window.requestAnimationFrame = function(callback, element) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function() { callback(currTime + timeToCall); },
						  timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};

				if (!window.cancelAnimationFrame)
					window.cancelAnimationFrame = function(id) {
						clearTimeout(id);
					};
			};

			var _parallax = function(settings) {
				if( !settings.sliderPx.el ) {
					return true;
				}

				var el = settings.sliderPx.el,
					elHeight = el.offsetHeight,
					elClasses = el.classList,
					transform, transform2;

				settings.scrollPos.y = window.pageYOffset;

				if( settings.body.classList.contains('device-up-lg') && !settings.isMobile ) {
					if( ( elHeight + settings.sliderPx.offset + 50 ) > settings.scrollPos.y ){
						elClasses.add('slider-parallax-visible');
						elClasses.remove('slider-parallax-invisible');
						if ( settings.scrollPos.y > settings.sliderPx.offset ) {
							if( typeof el.querySelector('.slider-inner') === 'object' ) {

								transform = ((settings.scrollPos.y-settings.sliderPx.offset) * -.4);
								transform2 = ((settings.scrollPos.y-settings.sliderPx.offset) * -.15);

								_setParallax(0, transform, settings.sliderPx.inner);
								_setParallax(0, transform2, settings.sliderPx.caption);
							} else {
								transform = ((settings.scrollPos.y-settings.sliderPx.offset) / 1.5);
								transform2 = ((settings.scrollPos.y-settings.sliderPx.offset) / 7);

								_setParallax(0, transform, el);
								_setParallax(0, transform2, settings.sliderPx.caption);
							}
						} else {
							if( el.querySelector('.slider-inner') ) {
								_setParallax(0, 0, settings.sliderPx.inner);
								_setParallax(0, 0, settings.sliderPx.caption);
							} else {
								_setParallax(0, 0, el);
								_setParallax(0, 0, settings.sliderPx.caption);
							}
						}
					} else {
						elClasses.add('slider-parallax-invisible');
						elClasses.remove('slider-parallax-visible');
					}

					requestAnimationFrame( function(){
						_parallax(settings);
					});
				} else {
					if( el.querySelector('.slider-inner') ) {
						_setParallax(0, 0, settings.sliderPx.inner);
						_setParallax(0, 0, settings.sliderPx.caption);
					} else {
						_setParallax(0, 0, el);
						_setParallax(0, 0, settings.sliderPx.caption);
					}

					elClasses.add('slider-parallax-visible');
					elClasses.remove('slider-parallax-invisible');
				}
			};

			var _offset = function() {
				var sliderPx = __core.getVars.sliderParallax;

				var sliderParallaxOffsetTop = 0,
					headerHeight = __core.getVars.elHeader?.offsetHeight || 0;

				if( __core.getVars.elBody.classList.contains('side-header') || (__core.getVars.elHeader && __core.getNext(__core.getVars.elHeader, '.include-header').length > 0) ) {
					headerHeight = 0;
				}

				// if( $pageTitle.length > 0 ) {
				// 	sliderParallaxOffsetTop = $pageTitle.outerHeight() + headerHeight - 20;
				// } else {
				// 	sliderParallaxOffsetTop = headerHeight - 20;
				// }

				if( __core.getNext(__core.getVars.elSlider, '#header').length > 0 ) {
					sliderParallaxOffsetTop = 0;
				}

				sliderPx.offset = sliderParallaxOffsetTop;
			};

			var _setParallax = function(xPos, yPos, el) {
				if( el ) {
					el.style.transform = "translate3d(" + xPos + ", " + yPos + "px, 0)";
				}
			};

			var _elementFade = function(settings) {
				if( settings.sliderPx.el.length < 1 ) {
					return true;
				}

				if( settings.body.classList.contains('device-up-lg') && !settings.isMobile ) {
					var elHeight = settings.sliderPx.el.offsetHeight,
						tHeaderOffset;

					if( (settings.header && settings.header.classList.contains('transparent-header')) || settings.body.classList.contains('side-header') ) {
						tHeaderOffset = 100;
					} else {
						tHeaderOffset = 0;
					}

					if( settings.sliderPx.el.classList.contains('slider-parallax-visible') ) {
						settings.sliderPx.el.querySelectorAll('.slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade').forEach( function(el) {
							el.style.opacity = 1 - ( ( ( settings.scrollPos.y - tHeaderOffset ) * 1.85 ) / elHeight );
						});
					}
				} else {
					settings.sliderPx.el.querySelectorAll('.slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade').forEach( function(el) {
						el.style.opacity = 1;
					});
				}
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					_animationFrame();
					var pxSettings = {
						sliderPx: __core.getVars.sliderParallax,
						body: __core.getVars.elBody,
						header: __core.getVars.elHeader,
						scrollPos: __core.getVars.scrollPos,
						isMobile: __mobile.any(),
					};

					if( pxSettings.sliderPx.el.querySelector('.slider-inner') ) {
						_setParallax(0, 0, pxSettings.sliderPx.inner);
						_setParallax(0, 0, pxSettings.sliderPx.caption);
					} else {
						_setParallax(0, 0, pxSettings.sliderPx.el);
						_setParallax(0, 0, pxSettings.sliderPx.caption);
					}

					window.addEventListener('scroll', function(){
						_parallax(pxSettings);
						_elementFade(pxSettings);
					});

					__core.getVars.resizers.sliderparallax = function() {
						__modules.sliderParallax();
					};
				}
			};
		}(),
		// SliderParallax Functions End

		/**
		 * --------------------------------------------------------------------------
		 * FlexSlider Functions Start
		 * --------------------------------------------------------------------------
		 */
		FlexSlider: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

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
		}(),
		// FlexSlider Functions End

		/**
		 * --------------------------------------------------------------------------
		 * FullVideo Functions Start
		 * --------------------------------------------------------------------------
		 */
		FullVideo: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-html5video', event: 'pluginHtml5VideoReady' });

					selector = __core.getSelector( selector, false, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elVideo = element.querySelector('video'),
							elRatio = element.getAttribute('data-ratio') || '16/9';

						if( !elVideo ) {
							return true;
						}

						elRatio = elRatio.split('/');

						elVideo.style.left = '';
						elVideo.style.top = '';

						var divWidth = element.offsetWidth,
							divHeight = element.offsetHeight,
							elWidth = ( Number(elRatio[0])*divHeight)/Number(elRatio[1]),
							elHeight = divHeight;

						if( elWidth < divWidth ) {
							elWidth = divWidth;
							elHeight = (Number(elRatio[1])*divWidth)/Number(elRatio[0]);
						}

						elVideo.style.width = elWidth + 'px';
						elVideo.style.height = elHeight + 'px';

						if( elHeight > divHeight ) {
							elVideo.style.left = '';
							elVideo.style.top = -( ( elHeight - divHeight )/2 ) + 'px';
						}

						if( elWidth > divWidth ) {
							elVideo.style.left = -( ( elWidth - divWidth )/2 ) + 'px';
							elVideo.style.top = '';
						}

						if( SEMICOLON.Mobile.any() && !element.classList.contains('no-placeholder') ) {
							var placeholderImg = elVideo.getAttribute('poster');

							if( placeholderImg != '' ) {
								element.innerHTML += '<div class="video-placeholder" style="background-image: url('+ placeholderImg +');"></div>';
							}

							elVideo.classList.add('d-none');
						}
					});

					__core.getVars.resizers.html5video = function() {
						__modules.html5Video();
					};
				}
			};
		}(),
		// FullVideo Functions End

		/**
		 * --------------------------------------------------------------------------
		 * YoutubeBG Functions Start
		 * --------------------------------------------------------------------------
		 */
		YoutubeBG: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().YTPlayer;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-youtubebg', event: 'pluginYoutubeBgVideoReady' });

						selector = __core.getSelector( selector, true, '.mb_YTPlayer,.customjs' );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elVideo = element.attr('data-video'),
								elMute = element.attr('data-mute') || true,
								elRatio = element.attr('data-ratio') || '16/9',
								elQuality = element.attr('data-quality') || 'hd720',
								elOpacity = element.attr('data-opacity') || 1,
								elContainer = element.attr('data-container') || 'parent',
								elOptimize = element.attr('data-optimize') || true,
								elLoop = element.attr('data-loop') || true,
								elControls = element.attr('data-controls') || false,
								elVolume = element.attr('data-volume') || 50,
								elStart = element.attr('data-start') || 0,
								elStop = element.attr('data-stop') || 0,
								elAutoPlay = element.attr('data-autoplay') || true,
								elFullScreen = element.attr('data-fullscreen') || false,
								elCoverImage = element.attr('data-coverimage') || '',
								elPauseOnBlur = element.attr('data-pauseonblur') || true,
								elPlayIfVisible = element.attr('data-playifvisible') || false;

							if( elMute == 'false' ) {
								elMute = false;
							}

							if( elContainer == 'parent' ) {
								var parent = element.parent();
								if( parent.attr('id') ) {
									elContainer = '#' + parent.attr('id');
								} else {
									var ytPid = 'yt-bg-player-parent-' + Math.floor( Math.random() * 10000 );
									parent.attr( 'id', ytPid );
									elContainer = '#' + ytPid;
								}
							}

							if( elOptimize == 'false' ) {
								elOptimize = false;
							}

							if( elLoop == 'false' ) {
								elLoop = false;
							}

							if( elControls == 'true' ) {
								elControls = true;
							}

							if( elAutoPlay == 'false' ) {
								elAutoPlay = false;
							}

							if( elFullScreen == 'true' ) {
								elFullScreen = true;
							}

							if( elPauseOnBlur == 'true' ) {
								elPauseOnBlur = true;
							}

							if( elPlayIfVisible == 'true' ) {
								elPlayIfVisible = true;
							}

							element.YTPlayer({
								videoURL: elVideo,
								mute: elMute,
								ratio: elRatio,
								quality: elQuality,
								opacity: Number(elOpacity),
								containment: elContainer,
								optimizeDisplay: elOptimize,
								loop: elLoop,
								vol: Number(elVolume),
								startAt: Number(elStart),
								stopAt: Number(elStop),
								autoPlay: elAutoPlay,
								realfullscreen: elFullScreen,
								showYTLogo: false,
								showControls: false,
								coverImage: elCoverImage,
								stopMovieOnBlur: elPauseOnBlur,
								playOnlyIfVisible: elPlayIfVisible,
							});
						});
					});
				}
			};
		}(),
		// YoutubeBG Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Toggle Functions Start
		 * --------------------------------------------------------------------------
		 */
		Toggle: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-toggles', event: 'pluginTogglesReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elSpeed = element.attr('data-speed') || 300,
								elState = element.attr('data-state');

							if( elState != 'open' ){
								element.children('.toggle-content').hide();
							} else {
								element.addClass('toggle-active').children('.toggle-content').slideDown( Number(elSpeed) );
							}

							element.children('.toggle-header').off( 'click' ).on( 'click', function(){
								element.toggleClass('toggle-active').children('.toggle-content').slideToggle( Number(elSpeed) );
								return true;
							});
						});
					});
				}
			};
		}(),
		// Toggle Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Accordion Functions Start
		 * --------------------------------------------------------------------------
		 */
		Accordion: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-accordions', event: 'pluginAccordionsReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elState = element.attr('data-state'),
								elActive = element.attr('data-active') || 1,
								elActiveClass = element.attr('data-active-class') || '',
								elCollapsible = element.attr('data-collapsible') || 'false',
								windowHash = location.hash,
								accActive;

							elActive = Number( elActive ) - 1;

							if( typeof windowHash !== 'undefined' && windowHash != '' ) {
								accActive = element.find('.accordion-header'+ windowHash);
								if( accActive.length > 0 ) {
									elActive = accActive.index() / 2;
								}
							}

							element.find('.accordion-content').hide();

							if( elState != 'closed' ) {
								element.find('.accordion-header:eq('+ Number(elActive) +')').addClass('accordion-active ' + elActiveClass).next().show();
							}

							element.find('.accordion-header').off( 'click' ).on( 'click', function(){
								var clickTarget = jQuery(this);

								if( clickTarget.next().is(':hidden') ) {
									element.find('.accordion-header').removeClass('accordion-active ' + elActiveClass).next().slideUp("normal");
									clickTarget.toggleClass('accordion-active ' + elActiveClass, true).next().stop(true,true).slideDown("normal", function(){
										if( ( jQuery('body').hasClass('device-sm') || jQuery('body').hasClass('device-xs') ) && element.hasClass('scroll-on-open') ) {
											jQuery('html,body').stop(true,true).animate({
												'scrollTop': clickTarget.offset().top - ( Core.getVars.topScrollOffset - 40 )
											}, 800, 'easeOutQuad' );
										}

										__core.runContainerModules( clickTarget.next()[0] );
									});
								} else {
									if( elCollapsible == 'true' ) {
										clickTarget.toggleClass('accordion-active ' + elActiveClass, false).next().stop(true,true).slideUp("normal");
									}
								}

								return false;
							});
						});
					});
				}
			};
		}(),
		// Accordion Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Counter Functions Start
		 * --------------------------------------------------------------------------
		 */
		Counter: function() {
			var _run = function(elCounter, elFormat) {
				if( elFormat.comma == 'true' ) {
					var reFormat = '\\B(?=(\\d{'+ elFormat.places +'})+(?!\\d))',
						regExp = new RegExp( reFormat, "g" );

					elCounter.find('span').countTo({
						formatter: function(value, options) {
							value = value.toFixed( options.decimals );
							value = value.replace( regExp, elFormat.sep );
							return value;
						}
					});
				} else {
					elCounter.find('span').countTo();
				}
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().countTo;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-counter', event: 'pluginCounterReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each(function(){
							var element = jQuery(this),
								elComma = element.find('span').attr('data-comma'),
								elSep = element.find('span').attr('data-sep') || ',',
								elPlaces = element.find('span').attr('data-places') || 3;

							var elCommaObj = {
								comma: elComma,
								sep: elSep,
								places: Number( elPlaces )
							}

							if( element.hasClass('counter-instant') ) {
								_run(element, elCommaObj);
								return;
							}

							var observer = new IntersectionObserver( function(entries, observer) {
								entries.forEach( function(entry) {
									if (entry.isIntersecting) {
										_run(element, elCommaObj);
										observer.unobserve(entry.target);
									}
								});
							}, {rootMargin: '0px 0px 50px'});

							observer.observe( element[0] );
						});
					});
				}
			};
		}(),
		// Counter Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Countdown Functions Start
		 * --------------------------------------------------------------------------
		 */
		Countdown: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && typeof moment !== "undefined" && jQuery().countdown;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-countdown', event: 'pluginCountdownReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elFormat = element.attr( 'data-format' ) || 'dHMS',
								elSince = element.attr( 'data-since' ),
								elYear = element.attr( 'data-year' ),
								elMonth = element.attr( 'data-month' ),
								elDay = element.attr( 'data-day' ),
								elHour = element.attr( 'data-hour' ),
								elMin = element.attr( 'data-minute' ),
								elSec = element.attr( 'data-second' ),
								elRedirect = element.attr( 'data-redirect' ),
								dateFormat, setDate;

							if( elYear ){
								dateFormat = elYear;
							}

							if( elMonth && elMonth < 13 ){
								dateFormat = dateFormat +"-"+ ( elMonth < 10 ? '0'+elMonth : elMonth);
							} else {
								if( elYear ) {
									dateFormat = dateFormat +"-01";
								}
							}

							if( elDay && elDay < 32 ){
								dateFormat = dateFormat +"-"+ ( elDay < 10 ? '0'+elDay : elDay);
							} else {
								if( elYear ) {
									dateFormat = dateFormat +"-01";
								}
							}

							setDate = dateFormat != '' ? new Date( moment( dateFormat ) ) : new Date();

							if( elHour && elHour < 25 ){
								setDate.setHours( setDate.getHours() + Number( elHour ) );
							}

							if( elMin && elMin < 60 ){
								setDate.setMinutes( setDate.getMinutes() + Number( elMin ) );
							}

							if( elSec && elSec < 60 ){
								setDate.setSeconds( setDate.getSeconds() + Number( elSec ) );
							}

							if( !elRedirect ) {
								elRedirect = false;
							}

							if( elSince == 'true' ) {
								element.countdown({
									since: setDate,
									format: elFormat,
									expiryUrl: elRedirect,
								});
							} else {
								element.countdown({
									until: setDate,
									format: elFormat,
									expiryUrl: elRedirect,
								});
							}
						});
					});
				}
			};
		}(),
		// Countdown Functions End

		/**
		 * --------------------------------------------------------------------------
		 * GoogleMaps Functions Start
		 * --------------------------------------------------------------------------
		 */
		GoogleMaps: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					if( !__core.getOptions.gmapAPI ) {
						console.warn( 'No API Key defined for Google Maps! Please set an API Key in js/functions.js File!' );
						return true;
					}

					__core.loadJS({file: 'https://maps.google.com/maps/api/js?key='+__core.getOptions.gmapAPI+"&callback=SEMICOLON.Modules.gmap", id: 'canvas-gmapapi-js'});
					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && typeof google !== "undefined" && jQuery().gMap;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-gmap', event: 'pluginGmapReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function() {
							var element = jQuery(this),
								elLat = element.attr( 'data-latitude' ),
								elLon = element.attr( 'data-longitude' ),
								elAdd = element.attr( 'data-address' ),
								elCon = element.attr( 'data-content' ),
								elScroll = element.attr( 'data-scrollwheel' ) || true,
								elType = element.attr( 'data-maptype' ) || 'ROADMAP',
								elZoom = element.attr( 'data-zoom' ) || 12,
								elStyles = element.attr( 'data-styles' ),
								elMarkers = element.attr( 'data-markers' ),
								elIcon = element.attr( 'data-icon' ),
								elConPan = element.attr( 'data-control-pan' ) || false,
								elConZoom = element.attr( 'data-control-zoom' )|| false,
								elConMapT = element.attr( 'data-control-maptype' )|| false,
								elConScale = element.attr( 'data-control-scale' )|| false,
								elConStreetV = element.attr( 'data-control-streetview' )|| false,
								elConOverview = element.attr( 'data-control-overview' )|| false;

							if( elAdd ) {
								elLat = elLon = false;
							} else {
								if( !elLat && !elLon ) {
									console.log( 'Google Map co-ordinates not entered.' );
									return true;
								}
							}

							if( elStyles ) { elStyles = JSON.parse( elStyles ); }
							if( elScroll == 'false' ) { elScroll = false; }
							if( elConPan == 'true' ) { elConPan = true; }
							if( elConZoom == 'true' ) { elConZoom = true; }
							if( elConMapT == 'true' ) { elConMapT = true; }
							if( elConScale == 'true' ) { elConScale = true; }
							if( elConStreetV == 'true' ) { elConStreetV = true; }
							if( elConOverview == 'true' ) { elConOverview = true; }

							if( elMarkers ) {
								elMarkers = Function( 'return ' + elMarkers )();
							} else {
								if( elAdd ) {
									elMarkers = [
										{
											address: elAdd,
											html: elCon ? elCon : elAdd
										}
									]
								} else {
									elMarkers = [
										{
											latitude: elLat,
											longitude: elLon,
											html: elCon ? elCon : false
										}
									]
								}
							}

							if( elIcon ) {
								elIcon = Function( 'return ' + elIcon )();
							} else {
								elIcon = {
									image: "https://www.google.com/mapfiles/marker.png",
									shadow: "https://www.google.com/mapfiles/shadow50.png",
									iconsize: [20, 34],
									shadowsize: [37, 34],
									iconanchor: [9, 34],
									shadowanchor: [19, 34]
								};
							}

							element.gMap({
								controls: {
									panControl: elConPan,
									zoomControl: elConZoom,
									mapTypeControl: elConMapT,
									scaleControl: elConScale,
									streetViewControl: elConStreetV,
									overviewMapControl: elConOverview
								},
								scrollwheel: elScroll,
								maptype: elType,
								markers: elMarkers,
								icon: elIcon,
								latitude: elLat,
								longitude: elLon,
								address: elAdd,
								zoom: Number( elZoom ),
								styles: elStyles
							});
						});
					});
				}
			};
		}(),
		// GoogleMaps Functions End

		/**
		 * --------------------------------------------------------------------------
		 * RoundedSkills Functions Start
		 * --------------------------------------------------------------------------
		 */
		RoundedSkills: function() {
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
		}(),
		// RoundedSkills Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Progress Functions Start
		 * --------------------------------------------------------------------------
		 */
		Progress: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-progress', event: 'pluginProgressReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elValue	= element.getAttribute('data-percent') || 90,
							elSpeed	= element.getAttribute('data-speed') || 1200,
							elBar = element.querySelector('.skill-progress-percent');

						elSpeed = Number(elSpeed) + 'ms';

						elBar.style.setProperty( '--cnvs-progress-speed', elSpeed );

						var observer = new IntersectionObserver( function(entries, observer){
							entries.forEach( function(entry) {
								if (entry.isIntersecting) {
									if (!elBar.classList.contains('skill-animated')) {
										__modules.counter(element.querySelector('.counter'));

										if ( element.classList.contains('skill-progress-vertical') ) {
											elBar.style.height = elValue + "%";
											elBar.classList.add('skill-animated');
										} else {
											elBar.style.width = elValue + "%";
											elBar.classList.add('skill-animated');
										}
									}

									observer.unobserve( entry.target );
								}
							});
						}, {rootMargin: '0px 0px 50px'});

						observer.observe( elBar );
					});
				}
			};
		}(),
		// Progress Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Twitter Functions Start
		 * --------------------------------------------------------------------------
		 */
		Twitter: function() {
			var _build = function(tweet, element, username) {
				var elFontClass = element.getAttribute('data-font-class') || 'font-body';

				var status = tweet.text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
					return '<a href="'+url+'" target="_blank">'+url+'</a>';
				}).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
					return reply.charAt(0)+'<a href="https://twitter.com/'+reply.substring(1)+'" target="_blank">'+reply.substring(1)+'</a>';
				});

				if( element.classList.contains('fslider') ) {
					var slide = document.createElement('div');
					slide.classList.add('slide');
					slide.innerHTML += '<p class="mb-3 '+elFontClass+'">'+status+'</p><small class="d-block"><a href="https://twitter.com/'+username+'/statuses/'+tweet.id+'" target="_blank">'+_time(tweet.created_at)+'</a></small>';
					element.querySelector('.slider-wrap').append(slide);
				} else {
					element.innerHTML += '<li><i class="fa-brands fa-twitter"></i><div><span>'+status+'</span><small><a href="https://twitter.com/'+username+'/statuses/'+tweet.id+'" target="_blank">'+_time(tweet.created_at)+'</a></small></div></li>';
				}
			}

			var _time = function(time_value) {
				var parsed_date = new Date(time_value);
				var relative_to = new Date();
				var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
				delta = delta + (relative_to.getTimezoneOffset() * 60);

				if (delta < 60) {
					return 'less than a minute ago';
				} else if(delta < 120) {
					return 'about a minute ago';
				} else if(delta < (60*60)) {
					return (parseInt(delta / 60)).toString() + ' minutes ago';
				} else if(delta < (120*60)) {
					return 'about an hour ago';
				} else if(delta < (24*60*60)) {
					return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
				} else if(delta < (48*60*60)) {
					return '1 day ago';
				} else {
					return (parseInt(delta / 86400)).toString() + ' days ago';
				}
			}

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-twitter', event: 'pluginTwitterFeedReady' });

					selector = __core.getSelector( selector, false, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elUser = element.getAttribute('data-username') || 'twitter',
							elCount = element.getAttribute('data-count') || 3,
							elLoader = element.getAttribute('data-loader') || 'include/twitter/tweets.php',
							elFetch = element.getAttribute('data-fetch-message') || 'Fetching Tweets from Twitter...';

						var alert = element.querySelector('.twitter-widget-alert');

						if( !alert ) {
							alert = document.createElement('div');
							alert.classList.add( 'alert', 'alert-warning', 'twitter-widget-alert', 'text-center' );
							element.prepend(alert);
							alert.innerHTML = '<div class="spinner-grow spinner-grow-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> ' + elFetch;
						}

						fetch( elLoader + '?username='+ elUser ).then( function(response) {
							return response.json();
						}).then( function(tweets) {
							alert.remove();
							var i = 0;
							tweets.data?.some( function(tw) {
								if( i == Number(elCount) ) {
									return;
								}

								_build(tw, element, elUser);
								i++;
							});

							if( element.classList.contains('fslider') ) {
								var timer = setInterval( function() {
									if( element.querySelectorAll('.slide').length > 1 ) {
										element.classList.remove('customjs');

										setTimeout( function() {
											__modules.flexSlider();
											jQuery(element).find( '.flexslider .slide' ).resize();
										}, 500);

										clearInterval(timer);
									}
								}, 1000);
							}
						}).catch( function(err) {
							console.log(err);
							alert.classList.remove( 'alert-warning' );
							alert.classList.add( 'alert-danger' );
							alert.innerHTML = 'Could not fetch Tweets from Twitter API. Please try again later.';
						});
					});
				}
			};
		}(),
		// Twitter Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Flickr Functions Start
		 * --------------------------------------------------------------------------
		 */
		Flickr: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().jflickrfeed;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-flickr', event: 'pluginFlickrFeedReady' });

						selector = __core.getSelector( selector, true, false );
						if( selector.length < 1 ){
							return true;
						}

						selector.each(function() {
							var element = jQuery(this),
								elID = element.attr('data-id'),
								elCount = element.attr('data-count') || 9,
								elType = element.attr('data-type'),
								elTypeGet = 'photos_public.gne';

							if( elType == 'group' ) { elTypeGet = 'groups_pool.gne'; }

							element.jflickrfeed({
								feedapi: elTypeGet,
								limit: Number(elCount),
								qstrings: {
									id: elID
								},
								itemTemplate: '<a class="grid-item" href="{{image_b}}" title="{{title}}" data-lightbox="gallery-item">' +
													'<img src="{{image_s}}" alt="{{title}}" />' +
											  '</a>'
							}, function(data) {
								element.removeClass('customjs');
								__core.imagesLoaded(element[0]);
								__modules.lightbox();

								element[0].addEventListener( 'CanvasImagesLoaded', function() {
									__modules.gridInit();
									__modules.masonryThumbs();
								});
							});
						});
					});
				}
			};
		}(),
		// Flickr Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Instagram Functions Start
		 * --------------------------------------------------------------------------
		 */
		Instagram: function() {
			var _get = function(element, loader, limit, fetchAlert) {
				var alert = element.closest('.instagram-widget-alert');

				if( !alert ) {
					alert = document.createElement('div');
					alert.classList.add( 'alert', 'alert-warning', 'instagram-widget-alert', 'text-center' );
					element.insertAdjacentElement( 'beforebegin', alert );
					alert.innerHTML = '<div class="spinner-grow spinner-grow-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> ' + fetchAlert;
				}

				fetch(loader).then( function(response) {
					return response.json();
				}).then( function(images) {
					if( images.length > 0 ) {
						alert.remove();
						for (var i = 0; i < limit; i++) {
							if ( i === limit )
								continue;

							var photo = images[i],
								thumb = photo.media_url;
							if( photo.media_type === 'VIDEO' ) {
								thumb = photo.thumbnail_url;
							}

							element.innerHTML += '<a class="grid-item" href="'+ photo.permalink +'" target="_blank"><img src="'+ thumb +'" alt="Image"></a>';
						}
					}

					element.classList.remove('customjs');
					__core.imagesLoaded(element);

					element.addEventListener( 'CanvasImagesLoaded', function() {
						__modules.masonryThumbs();
						__modules.lightbox();
					});
				}).catch( function(err) {
					console.log(err);
					alert.classList.remove( 'alert-warning' );
					alert.classList.add( 'alert-danger' );
					alert.innerHTML = 'Could not fetch Photos from Instagram API. Please try again later.';
				});
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-instagram', event: 'pluginInstagramReady' });

					selector = __core.getSelector( selector, false, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elLimit = element.getAttribute('data-count') || 12,
							elLoader = element.getAttribute('data-loader') || 'include/instagram/instagram.php',
							elFetch = element.getAttribute('data-fetch-message') || 'Fetching Photos from Instagram...';

						if( Number( elLimit ) > 12 ) {
							elLimit = 12;
						}

						_get(element, elLoader, elLimit, elFetch);
					});
				}
			};
		}(),
		// Instagram Functions End

		/**
		 * --------------------------------------------------------------------------
		 * NavTree Functions Start
		 * --------------------------------------------------------------------------
		 */
		NavTree: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-navtree', event: 'pluginNavTreeReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elSpeed = element.attr('data-speed') || 250,
								elEasing = element.attr('data-easing') || 'swing',
								elArrow = element.attr('data-arrow-class') || 'fa-solid fa-angle-right';

							element.find( 'ul li:has(ul)' ).addClass('sub-menu');
							element.find( 'ul li:has(ul) > a' ).filter(':not(:has(.sub-menu-indicator))').append( '<i class="sub-menu-indicator '+ elArrow +'"></i>' );

							if( element.hasClass('on-hover') ){
								element.find( 'ul li:has(ul):not(.active)' ).hover( function(e){
									jQuery(this).children('ul').stop(true, true).slideDown( Number(elSpeed), elEasing);
								}, function(){
									jQuery(this).children('ul').delay(250).slideUp( Number(elSpeed), elEasing);
								});
							} else {
								element.find( 'ul li:has(ul) > a' ).off( 'click' ).on( 'click', function(){
									var childElement = jQuery(this);

									element.find( 'ul li' ).not(childElement.parents()).removeClass('active');

									childElement.parent().children('ul').slideToggle( Number(elSpeed), elEasing, function(){
										jQuery(this).find('ul').hide();
										jQuery(this).find('li.active').removeClass('active');
									});

									element.find( 'ul li > ul' ).not(childElement.parent().children('ul')).not(childElement.parents('ul')).slideUp( Number(elSpeed), elEasing );
									childElement.parent('li:has(ul)').toggleClass('active');

									return true;
								});
							}
						});
					});
				}
			};
		}(),
		// NavTree Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Carousel Functions Start
		 * --------------------------------------------------------------------------
		 */
		Carousel: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

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
		}(),
		// Carousel Functions End

		/**
		 * --------------------------------------------------------------------------
		 * MasonryThumbs Functions Start
		 * --------------------------------------------------------------------------
		 */
		MasonryThumbs: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && typeof Isotope !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-masonrythumbs', event: 'pluginMasonryThumbsReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function() {
							var element = jQuery(this),
								elChildren = element.children(),
								elBig = element.attr('data-big');

							if( elChildren.length < 1 ) {
								return false;
							}

							elChildren.removeClass('grid-item-big').css({ 'width': '' });

							var compStyle = window.getComputedStyle( elChildren.eq(0)[0] );
							var firstElementWidth = Number(compStyle.getPropertyValue('width').split('px')[0]);

							if( element.filter('.has-init-isotope').length > 0 ) {
								element.isotope({
									masonry: {
										columnWidth: firstElementWidth
									}
								});
							}

							if( elBig ) {
								elBig = elBig.split(",");

								var elBigNum = '',
									bigi = '';

								for( bigi = 0; bigi < elBig.length; bigi++ ){
									elBigNum = Number(elBig[bigi]) - 1;
									elChildren.eq(elBigNum).addClass('grid-item-big');
								}
							}

							setTimeout( function() {
								element.find('.grid-item-big').css({ width: (firstElementWidth * 2) + 'px' });
							}, 500);

							setTimeout( function() {
								element.filter('.has-init-isotope').isotope( 'layout' );
							}, 1000);

							element[0].addEventListener( 'transitionend', function() {
								__modules.readmore();
							});
						});

						__core.getVars.resizers.masonryThumbs = function() {
							__modules.masonryThumbs();
						};
					});
				}
			};
		}(),
		// MasonryThumbs Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Notifications Functions Start
		 * --------------------------------------------------------------------------
		 */
		Notifications: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && typeof bootstrap !== "undefined";
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-notify', event: 'pluginNotifyReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						var element = selector,
							elPosition = element.attr('data-notify-position') || 'top-right',
							elType = element.attr('data-notify-type'),
							elMsg = element.attr('data-notify-msg') || 'Please set a message!',
							elTimeout = element.attr('data-notify-timeout') || 5000,
							elClose = element.attr('data-notify-close') || 'true',
							elAutoHide = element.attr('data-notify-autohide') || 'true',
							elId = 'toast-' + Math.floor( Math.random() * 10000 ),
							elTrigger = element.attr('data-notify-trigger') || 'self',
							elTarget = element.attr('data-notify-target'),
							elCloseHtml	= '',
							elPosClass, elTypeClass, elCloseClass;

						if( jQuery(elTarget).length > 0 && elTrigger == 'self' ) {
							var toast = bootstrap.Toast.getOrCreateInstance(jQuery(elTarget).get(0));
							toast.hide();

							jQuery(elTarget).get(0).addEventListener('hidden.bs.toast', function() {
								Notifications.init( selector );
							});
						}

						switch( elType ){

							case 'primary':
								elTypeClass = 'text-white bg-primary border-0';
								break;

							case 'warning':
								elTypeClass = 'text-dark bg-warning border-0';
								break;

							case 'error':
								elTypeClass = 'text-white bg-danger border-0';
								break;

							case 'success':
								elTypeClass = 'text-white bg-success border-0';
								break;

							case 'info':
								elTypeClass = 'bg-info text-dark border-0';
								break;

							case 'dark':
								elTypeClass = 'text-white bg-dark border-0';
								break;

							default:
								elTypeClass = '';
								break;
						}

						switch( elPosition ){

							case 'top-left':
								elPosClass = 'top-0 start-0';
								break;

							case 'top-center':
								elPosClass = 'top-0 start-50 translate-middle-x';
								break;

							case 'middle-left':
								elPosClass = 'top-50 start-0 translate-middle-y';
								break;

							case 'middle-center':
								elPosClass = 'top-50 start-50 translate-middle';
								break;

							case 'middle-right':
								elPosClass = 'top-50 end-0 translate-middle-y';
								break;

							case 'bottom-left':
								elPosClass = 'bottom-0 start-0';
								break;

							case 'bottom-center':
								elPosClass = 'bottom-0 start-50 translate-middle-x';
								break;

							case 'bottom-right':
								elPosClass = 'bottom-0 end-0';
								break;

							default:
								elPosClass = 'top-0 end-0';
								break;
						}

						if( elType == 'info' || elType == 'warning' || !elType ) {
							elCloseClass = '';
						} else {
							elCloseClass = 'btn-close-white';
						}

						if( elClose == 'true' ) {
							elCloseHtml = '<button type="button" class="btn-close '+ elCloseClass +' btn-sm me-2 mt-2 ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>';
						}

						if( elAutoHide != 'true' ) {
							elAutoHide = false;
						} else {
							elAutoHide = true;
						}

						let	elTemplate = '<div class="position-fixed '+ elPosClass +' p-3" style="z-index: 999999;">'+
						'<div id="'+ elId +'" class="toast p-2 hide '+ elTypeClass +'" role="alert" aria-live="assertive" aria-atomic="true">'+
							'<div class="d-flex">'+
								'<div class="toast-body">'+
									elMsg +
								'</div>'+
								elCloseHtml +
							'</div>'+
						'</div>';
					'</div>';

						if( elTrigger == 'self' ) {
							if( !elTarget ) {
								element.attr( 'data-notify-target', '#'+elId );
								jQuery('body').append( elTemplate );
							}
						}

						var toastElList = [].slice.call(document.querySelectorAll('.toast'));
						var toastList = toastElList.map( function(toastEl) {
							return new bootstrap.Toast(toastEl);
						});

						toastList.forEach( function(toast) {
							toast.hide();
						});

						var toastElement = element.attr('data-notify-target'),
							toastInstance = jQuery(toastElement),
							elMsgOld = toastInstance.find('.toast-body');

						if( jQuery(toastElement).length > 0 ) {
							var toast = new bootstrap.Toast( toastInstance.get(0) ,{
								delay: Number(elTimeout),
								autohide: elAutoHide,
							});

							toast.show();

							if( elTrigger == 'self' ) {
								toastInstance.get(0).addEventListener('hidden.bs.toast', function() {
									toastInstance.parent().remove();
									element.get(0).removeAttribute( 'data-notify-target' );
								});
							}
						}

						return false;

					});
				}
			};
		}(),
		// Notifications Functions End

		/**
		 * --------------------------------------------------------------------------
		 * TextRotator Functions Start
		 * --------------------------------------------------------------------------
		 */
		TextRotator: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().Morphext && typeof Typed !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-textrotator', event: 'pluginTextRotatorReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elTyped = element.attr('data-typed') || 'false',
								elRotator = element.find('.t-rotate'),
								elAnimation = element.attr('data-rotate') || 'fade',
								elSpeed = element.attr('data-speed') || 1200,
								elSep = element.attr('data-separator') || ',';

							if( elTyped == 'true' ) {
								var elTexts = elRotator.html().split( elSep ),
									elLoop = element.attr('data-loop') || 'true',
									elShuffle = element.attr('data-shuffle'),
									elCur = element.attr('data-cursor') || 'true',
									elSpeed = element.attr('data-speed') || 50,
									elBackSpeed = element.attr('data-backspeed') || 30,
									elBackDelay = element.attr('data-backdelay');

								if( elLoop == 'true' ) { elLoop = true; } else { elLoop = false; }
								if( elShuffle == 'true' ) { elShuffle = true; } else { elShuffle = false; }
								if( elCur == 'true' ) { elCur = true; } else { elCur = false; }

								elRotator.html( '' ).addClass('plugin-typed-init');

								var typed = new Typed( elRotator[0], {
									strings: elTexts,
									typeSpeed: Number( elSpeed ),
									loop: elLoop,
									shuffle: elShuffle,
									showCursor: elCur,
									backSpeed: Number( elBackSpeed ),
									backDelay: Number( elBackDelay )
								});
							} else {
								var pluginData = elRotator.Morphext({
									animation: elAnimation,
									separator: elSep,
									speed: Number(elSpeed)
								});
							}
						});
					});
				}
			};
		}(),
		// TextRotator Functions End

		/**
		 * --------------------------------------------------------------------------
		 * OnePage Functions Start
		 * --------------------------------------------------------------------------
		 */
		OnePage: function() {
			var _init = function(selector) {
				_hash();

				if( __core.getVars.elLinkScrolls ) {
					__core.getVars.elLinkScrolls.forEach( function(el) {
						_getSettings( el, 'scrollTo' );

						el.onclick = function(e) {
							e.preventDefault();

							_scroller( el, 'scrollTo' );
						};
					});
				}

				if( __core.getVars.elOnePageMenus ) {
					__core.getVars.elOnePageMenus.forEach( function(onePageMenu) {
						__core.getVars.elOnePageActiveClass = onePageMenu.getAttribute('data-active-class') || 'current';
						__core.getVars.elOnePageParentSelector = onePageMenu.getAttribute('data-parent') || 'li';
						__core.getVars.elOnePageActiveOnClick = onePageMenu.getAttribute('data-onclick-active') || 'false';

						onePageMenu.querySelectorAll('[data-href]').forEach( function(el) {
							_getSettings( el, 'onePage' );

							el.onclick = function(e) {
								e.preventDefault();

								_scroller( el, 'onePage' );
							};
						});
					});
				}
			};

			var _hash = function() {
				if( __core.getOptions.scrollExternalLinks != true ) {
					return false;
				}

				if( document.querySelector('a[data-href="'+ __core.getVars.hash +'"]') || document.querySelector('a[data-scrollto="'+ __core.getVars.hash +'"]') ) {
					window.onbeforeunload = function() {
						window.scrollTo({
							top: 0,
							behavior: 'auto'
						});
					};

					window.scrollTo({
						top: 0,
						behavior: 'auto'
					});

					var section = document.querySelector(__core.getVars.hash);

					if( section ) {
						var int = setInterval( function() {
							var settings = section.getAttribute('data-onepage-settings') && JSON.parse( section.getAttribute('data-onepage-settings') );

							if( settings ) {
								_scroll(section, settings, 0);
								clearInterval(int);
							}
						}, 250);
					}
				}
			};

			var _getSection = function(el, type) {
				var anchor;

				if( type == 'scrollTo' ) {
					anchor = el.getAttribute('data-scrollto');
				} else {
					anchor = el.getAttribute('data-href');
				}

				var section = document.querySelector( anchor );

				return section;
			};

			var _getSettings = function(el, type) {
				var section = _getSection(el, type);

				if( !section ) {
					return false;
				}

				section.removeAttribute('data-onepage-settings');

				var settings = _settings( section, el );

				setTimeout( function() {
					if( !section.hasAttribute('data-onepage-settings') ) {
						section.setAttribute( 'data-onepage-settings', JSON.stringify( settings ) );
					}
					__core.getVars.pageSectionEls = document.querySelectorAll('[data-onepage-settings]');
				}, 1000);
			};

			var _scroller = function(el, type) {
				var section = _getSection(el, type),
					sectionId = section.getAttribute('id');

				if( !section ) {
					return false;
				}

				var settings = JSON.parse( section.getAttribute('data-onepage-settings') );

				if( type != 'scrollTo' && __core.getVars.elOnePageActiveOnClick == 'true' ) {
					parent = el.closest('.one-page-menu');
					parent.querySelectorAll(__core.getVars.elOnePageParentSelector).forEach( function(el) {
						el.classList.remove( __core.getVars.elOnePageActiveClass );
					});
					parent.querySelector('a[data-href="#' + sectionId + '"]').closest(__core.getVars.elOnePageParentSelector).classList.add( __core.getVars.elOnePageActiveClass );
				}

				if( !__core.getVars.elBody.classList.contains('is-expanded-menu') || __core.getVars.elBody.classList.contains('overlay-menu') ) {
					__core.getVars.recalls.menureset();
				}

				_scroll(section, settings, 250);
			};

			var _scroll = function(section, settings, timeout) {
				setTimeout( function() {
					var sectionOffset = __core.offset(section).top;

					if( !settings ) {
						return false;
					}

					if( settings.easing ) {
						jQuery('html,body').stop(true, true).animate({
							'scrollTop': sectionOffset - Number( settings.offset )
						}, Number(settings.speed), settings.easing);
					} else {
						window.scrollTo({
							top: sectionOffset - Number( settings.offset ),
							behavior: 'smooth'
						});
					}
				}, Number(timeout));
			};

			var _position = function() {
				__core.getVars.elOnePageMenus && __core.getVars.elOnePageMenus.forEach( function(el) {
					el.querySelectorAll('[data-href]').forEach( function(item) {
						item.closest(__core.getVars.elOnePageParentSelector).classList.remove( __core.getVars.elOnePageActiveClass );
					});
				});

				__core.getVars.elOnePageMenus && __core.getVars.elOnePageMenus.forEach( function(el) {
					el.querySelector('[data-href="#' + _current() + '"]')?.closest(__core.getVars.elOnePageParentSelector).classList.add( __core.getVars.elOnePageActiveClass );
				});
			};

			var _current = function() {
				var currentOnePageSection;

				if( typeof __core.getVars.pageSectionEls === 'undefined' ) {
					return true;
				}

				__core.getVars.pageSectionEls.forEach( function(el) {
					var settings = el.getAttribute('data-onepage-settings') && JSON.parse( el.getAttribute('data-onepage-settings') );

					if( settings ) {
						var h = __core.offset(el).top - settings.offset - 5,
							y = window.pageYOffset;

						if( ( y >= h ) && ( y < h + el.offsetHeight ) && el.getAttribute('id') != currentOnePageSection && el.getAttribute('id') ) {
							currentOnePageSection = el.getAttribute('id');
						}
					}
				});

				return currentOnePageSection;
			};

			var _settings = function(section, element) {
				var body = __core.getVars.elBody.classList;

				if( typeof section === 'undefined' || element.length < 1 ) {
					return true;
				}

				if( section.hasAttribute('data-onepage-settings') ) {
					return true;
				}

				var options = {
					offset: __core.getVars.topScrollOffset,
					speed: 1250,
					easing: false
				};

				var settings = {},
					parentSettings = {},
					parent = element.closest( '.one-page-menu' );

				parentSettings.offset = parent?.getAttribute( 'data-offset' ) || options.offset;
				parentSettings.speed = parent?.getAttribute( 'data-speed' ) || options.speed;
				parentSettings.easing = parent?.getAttribute( 'data-easing' ) || options.easing;

				var elementSettings = {
					offset: element.getAttribute( 'data-offset' ) || parentSettings.offset,
					speed: element.getAttribute( 'data-speed' ) || parentSettings.speed,
					easing: element.getAttribute( 'data-easing' ) || parentSettings.easing,
				};

				var elOffsetXXL = element.getAttribute( 'data-offset-xxl' ),
					elOffsetXL = element.getAttribute( 'data-offset-xl' ),
					elOffsetLG = element.getAttribute( 'data-offset-lg' ),
					elOffsetMD = element.getAttribute( 'data-offset-md' ),
					elOffsetSM = element.getAttribute( 'data-offset-sm' ),
					elOffsetXS = element.getAttribute( 'data-offset-xs' );

				if( !elOffsetXS ) {
					elOffsetXS = Number(elementSettings.offset);
				}

				if( !elOffsetSM ) {
					elOffsetSM = Number(elOffsetXS);
				}

				if( !elOffsetMD ) {
					elOffsetMD = Number(elOffsetSM);
				}

				if( !elOffsetLG ) {
					elOffsetLG = Number(elOffsetMD);
				}

				if( !elOffsetXL ) {
					elOffsetXL = Number(elOffsetLG);
				}

				if( !elOffsetXXL ) {
					elOffsetXXL = Number(elOffsetXL);
				}

				if( body.contains('device-xs') ) {
					elementSettings.offset = elOffsetXS;
				} else if( body.contains('device-sm') ) {
					elementSettings.offset = elOffsetSM;
				} else if( body.contains('device-md') ) {
					elementSettings.offset = elOffsetMD;
				} else if( body.contains('device-lg') ) {
					elementSettings.offset = elOffsetLG;
				} else if( body.contains('device-xl') ) {
					elementSettings.offset = elOffsetXL;
				} else if( body.contains('device-xxl') ) {
					elementSettings.offset = elOffsetXXL;
				}

				settings.offset = elementSettings.offset;
				settings.speed = elementSettings.speed;
				settings.easing = elementSettings.easing;

				return settings;
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-onepage', event: 'pluginOnePageReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var scrollToLinks = __core.filtered( selector, '[data-scrollto]' ),
						onePageLinks = __core.filtered( selector, '.one-page-menu' );

					if( scrollToLinks.length > 0 ) {
						__core.getVars.elLinkScrolls = scrollToLinks;
					}

					if( onePageLinks.length > 0 ) {
						__core.getVars.elOnePageMenus = onePageLinks;
					}

					_init(selector);
					_position();

					window.addEventListener('scroll', function(){
						_position();
					});

					__core.getVars.resizers.onepage = function() {
						__modules.onePage();
					};
				}
			};
		}(),
		// OnePage Functions End

		/**
		 * --------------------------------------------------------------------------
		 * AjaxForm Functions Start
		 * --------------------------------------------------------------------------
		 */
		AjaxForm: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().validate && jQuery().ajaxSubmit;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-form', event: 'pluginFormReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								$body = jQuery('body'),
								elForm = element.find('form'),
								elFormId = elForm.attr('id'),
								elAlert = element.attr('data-alert-type'),
								elLoader = element.attr('data-loader'),
								elResult = element.find('.form-result'),
								elRedirect = element.attr('data-redirect'),
								defaultBtn, alertType;

							if( !elAlert ) {
								elAlert = 'notify';
							}

							if( elFormId ) {
								$body.addClass( elFormId + '-ready' );
							}

							element.find('form').validate({
								errorPlacement: function(error, elementItem) {
									if( elementItem.parents('.form-group').length > 0 ) {
										error.appendTo( elementItem.parents('.form-group') );
									} else {
										error.insertAfter( elementItem );
									}
								},
								focusCleanup: true,
								submitHandler: function(form) {
									if( element.hasClass( 'custom-submit' ) ) {
										jQuery(form).submit();
										return true;
									}

									elResult.hide();

									if( elLoader == 'button' ) {
										defaultBtn = jQuery(form).find('button');
										defaultBtnText = defaultBtn.html();

										defaultBtn.html('<i class="bi-arrow-repeat icon-spin m-0"></i>');
									} else {
										jQuery(form).find('.form-process').fadeIn();
									}

									if( elFormId ) {
										$body.removeClass( elFormId + '-ready ' + elFormId + '-complete ' + elFormId + '-success ' + elFormId + '-error' ).addClass( elFormId + '-processing' );
									}

									jQuery(form).ajaxSubmit({
										target: elResult,
										dataType: 'json',
										success: function(data) {
											if( elLoader == 'button' ) {
												defaultBtn.html( defaultBtnText );
											} else {
												jQuery(form).find('.form-process').fadeOut();
											}

											if( data.alert != 'error' && elRedirect ){
												window.location.replace( elRedirect );
												return true;
											}

											if( elAlert == 'inline' ) {
												if( data.alert == 'error' ) {
													alertType = 'alert-danger';
												} else {
													alertType = 'alert-success';
												}

												elResult.removeClass( 'alert-danger alert-success' ).addClass( 'alert ' + alertType ).html( data.message ).slideDown( 400 );
											} else if( elAlert == 'notify' ) {
												elResult.attr( 'data-notify-type', data.alert ).attr( 'data-notify-msg', data.message ).html('');
												__modules.notifications(elResult);
											}

											if( data.alert != 'error' ) {
												jQuery(form).resetForm();
												jQuery(form).find('.btn-group > .btn').removeClass('active');

												if( (typeof tinyMCE != 'undefined') && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden() ){
													tinymce.activeEditor.setContent('');
												}

												var rangeSlider = jQuery(form).find('.input-range-slider');
												if( rangeSlider.length > 0 ) {
													rangeSlider.each( function(){
														var range = jQuery(this).data('ionRangeSlider');
														range.reset();
													});
												}

												var ratings = jQuery(form).find('.input-rating');
												if( ratings.length > 0 ) {
													ratings.each( function(){
														jQuery(this).rating('reset');
													});
												}

												var selectPicker = jQuery(form).find('.selectpicker');
												if( selectPicker.length > 0 ) {
													selectPicker.each( function(){
														jQuery(this).selectpicker('val', '');
														jQuery(this).selectpicker('deselectAll');
													});
												}

												jQuery(form).find('.input-select2,select[data-selectsplitter-firstselect-selector]').change();

												jQuery(form).trigger( 'formSubmitSuccess', data );
												$body.removeClass( elFormId + '-error' ).addClass( elFormId + '-success' );
											} else {
												jQuery(form).trigger( 'formSubmitError', data );
												$body.removeClass( elFormId + '-success' ).addClass( elFormId + '-error' );
											}

											if( elFormId ) {
												$body.removeClass( elFormId + '-processing' ).addClass( elFormId + '-complete' );
											}

											if( jQuery(form).find('.g-recaptcha').children('div').length > 0 ) {
												grecaptcha.reset();
											}
										}
									});
								}
							});

						});
					});
				}
			};
		}(),
		// AjaxForm Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Subscribe Functions Start
		 * --------------------------------------------------------------------------
		 */
		Subscribe: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().validate && jQuery().ajaxSubmit;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-form', event: 'pluginFormReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return true;
						}

						selector.each( function(){
							var element = jQuery(this),
								elAlert = element.attr('data-alert-type'),
								elLoader = element.attr('data-loader'),
								elResult = element.find('.widget-subscribe-form-result'),
								elRedirect = element.attr('data-redirect'),
								defButton, defButtonText, alertType;

							element.find('form').validate({
								submitHandler: function(form) {

									elResult.hide();

									if( elLoader == 'button' ) {
										defButton = jQuery(form).find('button');
										defButtonText = defButton.html();

										defButton.html('<i class="bi-arrow-repeat icon-spin nomargin"></i>');
									} else {
										jQuery(form).find('.bi-envelope-plus').removeClass('bi-envelope-plus').addClass('bi-arrow-repeat icon-spin');
									}

									jQuery(form).ajaxSubmit({
										target: elResult,
										dataType: 'json',
										resetForm: true,
										success: function(data) {
											if( elLoader == 'button' ) {
												defButton.html( defButtonText );
											} else {
												jQuery(form).find('.bi-arrow-repeat').removeClass('bi-arrow-repeat icon-spin').addClass('bi-envelope-plus');
											}
											if( data.alert != 'error' && elRedirect ){
												window.location.replace( elRedirect );
												return true;
											}
											if( elAlert == 'inline' ) {
												if( data.alert == 'error' ) {
													alertType = 'alert-danger';
												} else {
													alertType = 'alert-success';
												}

												elResult.addClass( 'alert ' + alertType ).html( data.message ).slideDown( 400 );
											} else {
												elResult.attr( 'data-notify-type', data.alert ).attr( 'data-notify-msg', data.message ).html('');
												__modules.notifications(elResult);
											}
										}
									});
								}
							});

						});
					});
				}
			};
		}(),
		// Subscribe Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Conditional Functions Start
		 * --------------------------------------------------------------------------
		 */
		Conditional: function() {
			var _eval = function(field, value, conditions, check, target) {
				if( ! field || ! conditions ) {
					return false;
				}

				var fulfilled = false;

				if( check == 'validate' ) {
					if( value ) {
						if ( target.getAttribute('aria-invalid') == 'false' ) {
							fulfilled = true;
						} else {
							fulfilled = false;
						}
					}
				} else {
					switch( conditions.operator ) {
						case '==':
							if( value == conditions.value ) {
								fulfilled = true;
							}
							break;

						case '!=':
							if( value != conditions.value ) {
								fulfilled = true;
							}
							break;

						case '>':
							if( value > conditions.value ) {
								fulfilled = true;
							}
							break;

						case '<':
							if( value < conditions.value ) {
								fulfilled = true;
							}
							break;

						case '<=':
							if( value <= conditions.value ) {
								fulfilled = true;
							}
							break;

						case '>=':
							if( value >= conditions.value ) {
								fulfilled = true;
							}
							break;

						case 'in':
							if( conditions.value.includes( value ) ) {
								fulfilled = true;
							}
							break;

						default:
							fulfilled = false;
							break;
					}
				}

				if( fulfilled ) {
					field.classList.add('condition-fulfilled');
					field.querySelectorAll('input,select,textarea,button').forEach( function(el) {
						el.disabled = false;
					});
				} else {
					field.classList.remove('condition-fulfilled');
					field.querySelectorAll('input,select,textarea,button').forEach( function(el) {
						el.disabled = true;
					});
				}
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-conditional', event: 'pluginConditionalReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(el) {
						var field = el,
							condition = field.getAttribute( 'data-condition' ) || '==',
							conditionTarget = field.getAttribute( 'data-condition-target' ),
							conditionValue = field.getAttribute( 'data-condition-value' ),
							conditionCheck = field.getAttribute( 'data-condition-check' ) || 'value',
							target = document.querySelector('[id*="'+conditionTarget+'"]'),
							value = target.value,
							targetType = target.type,
							eventType;

						var conditions = {
							operator: condition,
							field: conditionTarget,
							value: conditionValue
						}

						var targetTag = target.tagName.toLowerCase();

						if( targetType == 'checkbox' || targetTag == 'select' || targetType == 'radio' ) {
							eventType = 'change';
						} else {
							eventType = 'input';
						}

						if( targetType == 'checkbox' ) {
							value = target.checked ? target.value : 0;
						}

						if( targetType == 'radio' ) {
							value = target.checked ? target.value : '';
						}

						_eval(field, value, conditions, conditionCheck, target);

						target.addEventListener( eventType, function() {
							if( targetType == 'checkbox' ) {
								value = target.checked ? target.value : 0;
							} else if( targetType == 'radio' ) {
								value = target.checked ? target.value : '';
							} else {
								value = target.value;
							}

							_eval(field, value, conditions, conditionCheck, target);
						});

						if( conditionCheck == 'validate' ) {
							var mutationObserver = new MutationObserver( function(mutations) {
								mutations.forEach( function(mutation) {
									_eval(field, value, conditions, conditionCheck, target);
								});
							});

							mutationObserver.observe( target, {
								attributes: true,
								characterData: true,
								childList: true,
								subtree: true,
								attributeOldValue: true,
								characterDataOldValue: true
							});
						}
					});
				}
			};
		}(),
		// Conditional Functions End

		/**
		 * --------------------------------------------------------------------------
		 * ShapeDivider Functions Start
		 * --------------------------------------------------------------------------
		 */
		ShapeDivider: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-shapedivider', event: 'pluginShapeDividerReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elShape = element.getAttribute('data-shape') || 'valley',
							elWidth = element.getAttribute('data-width') || 100,
							elHeight = element.getAttribute('data-height') || 100,
							elFill = element.getAttribute('data-fill'),
							elOut = element.getAttribute('data-outside') || 'false',
							elPos = element.getAttribute('data-position') || 'top',
							elId = 'shape-divider-' + Math.floor( Math.random() * 10000 ),
							shape = '',
							width, height, fill,
							outside = '';

						if( element.classList.contains('shape-divider-complete') ) {
							return true;
						}

						if( elWidth < 100 ) {
							elWidth = 100;
						}

						width = 'width: calc( '+ Number( elWidth ) +'% + 1.5px );';
						height = 'height: '+ Number( elHeight ) +'px;';
						fill = 'fill: '+elFill+';';

						if( elOut == 'true' ) {
							if( elPos == 'bottom' ) {
								outside = '#'+ elId +'.shape-divider { bottom: -'+( Number( elHeight ) - 1 ) +'px; } ';
							} else {
								outside = '#'+ elId +'.shape-divider { top: -'+( Number( elHeight ) - 1 ) +'px; } ';
							}
						}

						var css = outside + '#'+ elId +'.shape-divider svg { '+ width + height +' } #'+ elId +'.shape-divider .shape-divider-fill { '+ fill +' }',
							style = document.createElement('style');

						__core.getVars.elHead.appendChild(style);

						style.appendChild(document.createTextNode(css));

						element.setAttribute( 'id', elId );

						switch(elShape){
							case 'valley':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 355" preserveAspectRatio="none"><defs><style>.b{opacity:.5}.c{opacity:.3}</style></defs><path fill="none" d="M999.45 0H0v165.72l379.95 132.46L999.45 0z"></path><path class="b shape-divider-fill" d="M379.95 298.18l28.47 9.92L1000 118.75V0h-.55l-619.5 298.18zM492.04 337.25L1000 252.63V118.75L408.42 308.1l83.62 29.15z"></path><path class="b shape-divider-fill" d="M492.04 337.25L1000 252.63V118.75L408.42 308.1l83.62 29.15z"></path><path class="shape-divider-fill" d="M530.01 350.49l20.22 4.51H1000V252.63l-507.96 84.62 37.97 13.24z"></path><path class="b shape-divider-fill" d="M530.01 350.49l20.22 4.51H1000V252.63l-507.96 84.62 37.97 13.24z"></path><path class="b shape-divider-fill" d="M530.01 350.49l20.22 4.51H1000V252.63l-507.96 84.62 37.97 13.24z"></path><path class="shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="b shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="c shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="b shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="c shape-divider-fill" d="M379.95 298.18L0 165.72v66.59l353.18 78.75 26.77-12.88z"></path><path class="c shape-divider-fill" d="M353.18 311.06L0 232.31v71.86l288.42 38.06 64.76-31.17z"></path><path class="c shape-divider-fill" d="M353.18 311.06L0 232.31v71.86l288.42 38.06 64.76-31.17z"></path><path class="b shape-divider-fill" d="M380.28 317.11l28.14-9.01-28.47-9.92-26.77 12.88 27.1 6.05z"></path><path class="c shape-divider-fill" d="M380.28 317.11l28.14-9.01-28.47-9.92-26.77 12.88 27.1 6.05z"></path><path class="b shape-divider-fill" d="M479.79 339.29l12.25-2.04-83.62-29.15-28.14 9.01 99.51 22.18z"></path><path class="b shape-divider-fill" d="M479.79 339.29l12.25-2.04-83.62-29.15-28.14 9.01 99.51 22.18z"></path><path class="c shape-divider-fill" d="M479.79 339.29l12.25-2.04-83.62-29.15-28.14 9.01 99.51 22.18z"></path><path class="shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2z"></path><path class="b shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2z"></path><path class="b shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2z"></path><path class="c shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2zM288.42 342.23l9.46 1.25 82.4-26.37-27.1-6.05-64.76 31.17z"></path><path class="b shape-divider-fill" d="M288.42 342.23l9.46 1.25 82.4-26.37-27.1-6.05-64.76 31.17z"></path><path class="c shape-divider-fill" d="M288.42 342.23l9.46 1.25 82.4-26.37-27.1-6.05-64.76 31.17z"></path><path class="b shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="c shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="b shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="c shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="b shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="c shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="b shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="c shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="shape-divider-fill" d="M288.42 342.23L0 304.17V355h385.18l-87.3-11.52-9.46-1.25z"></path></svg>';
								break;

							case 'valley-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M194,99c186.7,0.7,305-78.3,306-97.2c1,18.9,119.3,97.9,306,97.2c114.3-0.3,194,0.3,194,0.3s0-91.7,0-100c0,0,0,0,0-0 L0,0v99.3C0,99.3,79.7,98.7,194,99z"></path></svg>';
								break;

							case 'valley-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1280 0L640 70 0 0v140l640-70 640 70V0z" opacity="0.5"></path><path class="shape-divider-fill" d="M1280 0H0l640 70 640-70z"></path></svg>';
								break;

							case 'mountain':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M500,98.9L0,6.1V0h1000v6.1L500,98.9z"></path></svg>';
								break;

							case 'mountain-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M640 140L1280 0H0z" opacity="0.5"/><path class="shape-divider-fill" d="M640 98l640-98H0z"/></svg>';
								break;

							case 'mountain-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 491.58" preserveAspectRatio="none"><g style="isolation:isolate"><path class="shape-divider-fill" d="M1000 479.4v-87.96L500 0 0 391.46v87.96l500-335.94 500 335.92z" opacity="0.12" mix-blend-mode="overlay"/><path class="shape-divider-fill" d="M1000 487.31v-7.91L500 143.48 0 479.42v7.91l500-297.96 500 297.94z" opacity="0.25" mix-blend-mode="overlay"/><path class="shape-divider-fill" d="M1000 487.31L500 189.37 0 487.33v4.25h1000v-4.27z"/></g></svg>';
								break;

							case 'mountain-4':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M738,99l262-93V0H0v5.6L738,99z"></path></svg>';
								break;

							case 'mountain-5':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M978.81 122.25L0 0h1280l-262.1 116.26a73.29 73.29 0 0 1-39.09 5.99z" opacity="0.5"></path><path class="shape-divider-fill" d="M983.19 95.23L0 0h1280l-266 91.52a72.58 72.58 0 0 1-30.81 3.71z"></path></svg>';
								break;

							case 'mountains':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"></path><path class="shape-divider-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"></path><path class="shape-divider-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"></path></svg>';
								break;

							case 'mountains-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 247" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 200.92v.26l.75-.77-.75.51z"></path><path class="shape-divider-fill" d="M279.29 208.39c0-4.49 74.71-29.88 74.71-29.88l61.71 61.26L550 153.1l134.14 88.17L874.28 50 1000 178.51v-.33L874.28 0 684.14 191.27 550 103.1l-134.29 86.67L354 128.51s-74.71 25.39-74.71 29.88S144.23 52.08 144.23 52.08L.75 200.41l143.48-98.33s135.06 110.8 135.06 106.31z" opacity="0.25" isolation="isolate"></path><path class="shape-divider-fill" d="M1000 178.51L874.28 50 684.14 241.27 550 153.1l-134.29 86.67L354 178.51s-74.71 25.39-74.71 29.88-135.06-106.31-135.06-106.31L.75 200.41l-.75.77V247h1000z"></path><path class="shape-divider-fill" d="M1000 178.51L874.28 50 684.14 241.27 550 153.1l-134.29 86.67L354 178.51s-74.71 25.39-74.71 29.88-135.06-106.31-135.06-106.31L.75 200.41l-.75.77V247h1000z" opacity="0.25" isolation="isolate"></path></svg>';
								break;

							case 'mountains-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M761.9,44.1L643.1,27.2L333.8,98L0,3.8V0l1000,0v3.9"></path></svg>';
								break;

							case 'mountains-4':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 90.72l140-28.28 315.52 24.14L796.48 65.8 1140 104.89l140-14.17V0H0v90.72z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0v47.44L170 0l626.48 94.89L1110 87.11l170-39.67V0H0z"></path></svg>';
								break;

							case 'plataeu':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1280 0l-131.81 111.68c-16.47 14-35.47 21-54.71 20.17L173 94a76.85 76.85 0 0 1-36.79-11.46L0 0z"></path></svg>';
								break;

							case 'plataeu-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1093.48 131.85L173 94a76.85 76.85 0 0 1-36.79-11.46L0 0h1280l-131.81 111.68c-16.47 13.96-35.47 20.96-54.71 20.17z" opacity="0.5"></path><path class="shape-divider-fill" d="M1094.44 119L172.7 68.72a74.54 74.54 0 0 1-25.19-5.95L0 0h1280l-133.85 102c-15.84 12.09-33.7 17.95-51.71 17z"></path></svg>';
								break;

							case 'hills':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M156.258 127.903l86.363-18.654 78.684 13.079L411.441 99.4l94.454 10.303L582.82 93.8l82.664 18.728 76.961-11.39L816.109 71.4l97.602 9.849L997.383 50.4l66.285 14.694 70.793-24.494h79.863L1280 0H0v122.138l60.613 9.965z"/></svg>';
								break;

							case 'hills-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1214.323 66.051h-79.863l-70.793 18.224-66.285-10.933-83.672 22.953-97.601-7.328-73.664 22.125-76.961 8.475-82.664-13.934-76.926 11.832-94.453-7.666-90.137 17.059-78.684-9.731-86.363 13.879-95.644 3.125L0 126.717V0h1280l-.001 35.844z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0h1280v.006l-70.676 36.578-74.863 4.641-70.793 23.334-66.285-11.678-83.672 29.618-97.602-7.07-63.664 21.421-76.961 12.649-91.664-20.798-77.926 17.66-94.453-7.574-90.137 21.595-78.683-9.884-86.363 16.074-95.645 6.211L0 127.905z"></path></svg>';
								break;

							case 'hills-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M156 35.51l95.46 34.84 120.04.24 71.5 33.35 90.09-3.91L640 137.65l102.39-37.17 85.55 10.65 88.11-7.19L992 65.28l73.21 5.31 66.79-22.1 77-.42L1280 0H0l64.8 38.69 91.2-3.18z"/></svg>';
								break;

							case 'hills-4':
								shape = '<svg viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M156 35.41l95.46 34.73 120.04.25 71.5 33.24 90.09-3.89L640 137.25l102.39-37.06 85.55 10.61 88.11-7.17L992 65.08l73.21 5.31L1132 48.35l77-.42L1280 0H0l64.8 38.57 91.2-3.16z" opacity="0.5"/><path class="shape-divider-fill" d="M156 28.32l95.46 27.79 120.04.2L443 82.9l90.09-3.11L640 109.8l102.39-29.65 85.55 8.49 88.11-5.74L992 52.07l73.21 4.24L1132 38.68l77-.34L1280 0H0l64.8 30.86 91.2-2.54z"/></svg>';
								break;

							case 'cloud':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice"><path class="shape-divider-fill" d="M0 0v6.7c1.9-.8 4.7-1.4 8.5-1 9.5 1.1 11.1 6 11.1 6s2.1-.7 4.3-.2c2.1.5 2.8 2.6 2.8 2.6s.2-.5 1.4-.7c1.2-.2 1.7.2 1.7.2s0-2.1 1.9-2.8c1.9-.7 3.6.7 3.6.7s.7-2.9 3.1-4.1 4.7 0 4.7 0 1.2-.5 2.4 0 1.7 1.4 1.7 1.4h1.4c.7 0 1.2.7 1.2.7s.8-1.8 4-2.2c3.5-.4 5.3 2.4 6.2 4.4.4-.4 1-.7 1.8-.9 2.8-.7 4 .7 4 .7s1.7-5 11.1-6c9.5-1.1 12.3 3.9 12.3 3.9s1.2-4.8 5.7-5.7c4.5-.9 6.8 1.8 6.8 1.8s.6-.6 1.5-.9c.9-.2 1.9-.2 1.9-.2s5.2-6.4 12.6-3.3c7.3 3.1 4.7 9 4.7 9s1.9-.9 4 0 2.8 2.4 2.8 2.4 1.9-1.2 4.5-1.2 4.3 1.2 4.3 1.2.2-1 1.4-1.7 2.1-.7 2.1-.7-.5-3.1 2.1-5.5 5.7-1.4 5.7-1.4 1.5-2.3 4.2-1.1c2.7 1.2 1.7 5.2 1.7 5.2s.3-.1 1.3.5c.5.4.8.8.9 1.1.5-1.4 2.4-5.8 8.4-4 7.1 2.1 3.5 8.9 3.5 8.9s.8-.4 2 0 1.1 1.1 1.1 1.1 1.1-1.1 2.3-1.1 2.1.5 2.1.5 1.9-3.6 6.2-1.2 1.9 6.4 1.9 6.4 2.6-2.4 7.4 0c3.4 1.7 3.9 4.9 3.9 4.9s3.3-6.9 10.4-7.9 11.5 2.6 11.5 2.6.8 0 1.2.2c.4.2.9.9.9.9s4.4-3.1 8.3.2c1.9 1.7 1.5 5 1.5 5s.3-1.1 1.6-1.4c1.3-.3 2.3.2 2.3.2s-.1-1.2.5-1.9 1.9-.9 1.9-.9-4.7-9.3 4.4-13.4c5.6-2.5 9.2.9 9.2.9s5-6.2 15.9-6.2 16.1 8.1 16.1 8.1.7-.2 1.6-.4V0H0z"></path></svg>';
								break;

							case 'cloud-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 86" preserveAspectRatio="xMidYMid slice"><path class="shape-divider-fill" d="M1280 0H0v65.2c6.8 0 13.5.9 20.1 2.6 14-21.8 43.1-28 64.8-14 5.6 3.6 10.3 8.3 14 13.9 7.3-1.2 14.8-.6 21.8 1.6 2.1-37.3 34.1-65.8 71.4-63.7 24.3 1.4 46 15.7 56.8 37.6 19-17.6 48.6-16.5 66.3 2.4C323 54 327.4 65 327.7 76.5c.4.2.8.4 1.2.7 3.3 1.9 6.3 4.2 8.9 6.9 15.9-23.8 46.1-33.4 72.8-23.3 11.6-31.9 46.9-48.3 78.8-36.6 9.1 3.3 17.2 8.7 23.8 15.7 6.7-6.6 16.7-8.4 25.4-4.8 29.3-37.4 83.3-44 120.7-14.8 14 11 24.3 26.1 29.4 43.1 4.7.6 9.3 1.8 13.6 3.8 7.8-24.7 34.2-38.3 58.9-30.5 14.4 4.6 25.6 15.7 30.3 30 14.2 1.2 27.7 6.9 38.5 16.2 11.1-35.7 49-55.7 84.7-44.7 14.1 4.4 26.4 13.3 35 25.3 12-5.7 26.1-5.5 37.9.6 3.9-11.6 15.5-18.9 27.7-17.5.2-.3.3-.6.5-.9 23.3-41.4 75.8-56 117.2-32.6 14.1 7.9 25.6 19.7 33.3 33.8 28.8-23.8 71.5-19.8 95.3 9 2.6 3.1 4.9 6.5 6.9 10 3.8-.5 7.6-.8 11.4-.8L1280 0z"/></svg>';
								break;

							case 'cloud-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 86" preserveAspectRatio="xMidYMid slice"><path class="shape-divider-fill" d="M833.9 27.5c-5.8 3.2-11 7.3-15.5 12.2-7.1-6.9-17.5-8.8-26.6-5-30.6-39.2-87.3-46.1-126.5-15.5-1.4 1.1-2.8 2.2-4.1 3.4C674.4 33.4 684 48 688.8 64.3c4.7.6 9.3 1.8 13.6 3.8 7.8-24.7 34.2-38.3 58.9-30.5 14.4 4.6 25.6 15.7 30.3 30 14.2 1.2 27.7 6.9 38.5 16.2C840.6 49.6 876 29.5 910.8 38c-20.4-20.3-51.8-24.6-76.9-10.5zM384 43.9c-9 5-16.7 11.9-22.7 20.3 15.4-7.8 33.3-8.7 49.4-2.6 3.7-10.1 9.9-19.1 18.1-26-15.4-2.3-31.2.6-44.8 8.3zm560.2 13.6c2 2.2 3.9 4.5 5.7 6.9 5.6-2.6 11.6-4 17.8-4.1-7.6-2.4-15.6-3.3-23.5-2.8zM178.7 7c29-4.2 57.3 10.8 70.3 37 8.9-8.3 20.7-12.8 32.9-12.5C256.4 1.8 214.7-8.1 178.7 7zm146.5 56.3c1.5 4.5 2.4 9.2 2.5 14 .4.2.8.4 1.2.7 3.3 1.9 6.3 4.2 8.9 6.9 5.8-8.7 13.7-15.7 22.9-20.5-11.1-5.2-23.9-5.6-35.5-1.1zM33.5 54.9c21.6-14.4 50.7-8.5 65 13 .1.2.2.3.3.5 7.3-1.2 14.8-.6 21.8 1.6.6-10.3 3.5-20.4 8.6-29.4.3-.6.7-1.2 1.1-1.8-32.1-17.2-71.9-10.6-96.8 16.1zm1228.9 2.7c2.3 2.9 4.4 5.9 6.2 9.1 3.8-.5 7.6-.8 11.4-.8V48.3c-6.4 1.8-12.4 5-17.6 9.3zM1127.3 11c1.9.9 3.7 1.8 5.6 2.8 14.2 7.9 25.8 19.7 33.5 34 13.9-11.4 31.7-16.9 49.6-15.3-20.5-27.7-57.8-36.8-88.7-21.5z" opacity="0.5"/><path class="shape-divider-fill" d="M0 0v66c6.8 0 13.5.9 20.1 2.6 3.5-5.4 8.1-10.1 13.4-13.6 24.9-26.8 64.7-33.4 96.8-16 10.5-17.4 28.2-29.1 48.3-32 36.1-15.1 77.7-5.2 103.2 24.5 19.7.4 37.1 13.1 43.4 31.8 11.5-4.5 24.4-4.2 35.6 1.1l.4-.2c15.4-21.4 41.5-32.4 67.6-28.6 25-21 62.1-18.8 84.4 5.1 6.7-6.6 16.7-8.4 25.4-4.8 29.2-37.4 83.3-44.1 120.7-14.8l1.8 1.5c37.3-32.9 94.3-29.3 127.2 8 1.2 1.3 2.3 2.7 3.4 4.1 9.1-3.8 19.5-1.9 26.6 5 24.3-26 65-27.3 91-3.1.5.5 1 .9 1.5 1.4 12.8 3.1 24.4 9.9 33.4 19.5 7.9-.5 15.9.4 23.5 2.8 7-.1 13.9 1.5 20.1 4.7 3.9-11.6 15.5-18.9 27.7-17.5.2-.3.3-.6.5-.9 22.1-39.2 70.7-54.7 111.4-35.6 30.8-15.3 68.2-6.2 88.6 21.5 18.3 1.7 35 10.8 46.5 25.1 5.2-4.3 11.1-7.4 17.6-9.3V0H0z"/></svg>';
								break;

							case 'wave':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"></path></svg>';
								break;

							case 'wave-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="none"><path class="shape-divider-fill" d="M283.5,9.7c0,0-7.3,4.3-14,4.6c-6.8,0.3-12.6,0-20.9-1.5c-11.3-2-33.1-10.1-44.7-5.7	s-12.1,4.6-18,7.4c-6.6,3.2-20,9.6-36.6,9.3C131.6,23.5,99.5,7.2,86.3,8c-1.4,0.1-6.6,0.8-10.5,2c-3.8,1.2-9.4,3.8-17,4.7 c-3.2,0.4-8.3,1.1-14.2,0.9c-1.5-0.1-6.3-0.4-12-1.6c-5.7-1.2-11-3.1-15.8-3.7C6.5,9.2,0,10.8,0,10.8V0h283.5V9.7z M260.8,11.3 c-0.7-1-2-0.4-4.3-0.4c-2.3,0-6.1-1.2-5.8-1.1c0.3,0.1,3.1,1.5,6,1.9C259.7,12.2,261.4,12.3,260.8,11.3z M242.4,8.6 c0,0-2.4-0.2-5.6-0.9c-3.2-0.8-10.3-2.8-15.1-3.5c-8.2-1.1-15.8,0-15.1,0.1c0.8,0.1,9.6-0.6,17.6,1.1c3.3,0.7,9.3,2.2,12.4,2.7	C239.9,8.7,242.4,8.6,242.4,8.6z M185.2,8.5c1.7-0.7-13.3,4.7-18.5,6.1c-2.1,0.6-6.2,1.6-10,2c-3.9,0.4-8.9,0.4-8.8,0.5	c0,0.2,5.8,0.8,11.2,0c5.4-0.8,5.2-1.1,7.6-1.6C170.5,14.7,183.5,9.2,185.2,8.5z M199.1,6.9c0.2,0-0.8-0.4-4.8,1.1 c-4,1.5-6.7,3.5-6.9,3.7c-0.2,0.1,3.5-1.8,6.6-3C197,7.5,199,6.9,199.1,6.9z M283,6c-0.1,0.1-1.9,1.1-4.8,2.5s-6.9,2.8-6.7,2.7	c0.2,0,3.5-0.6,7.4-2.5C282.8,6.8,283.1,5.9,283,6z M31.3,11.6c0.1-0.2-1.9-0.2-4.5-1.2s-5.4-1.6-7.8-2C15,7.6,7.3,8.5,7.7,8.6	C8,8.7,15.9,8.3,20.2,9.3c2.2,0.5,2.4,0.5,5.7,1.6S31.2,11.9,31.3,11.6z M73,9.2c0.4-0.1,3.5-1.6,8.4-2.6c4.9-1.1,8.9-0.5,8.9-0.8 c0-0.3-1-0.9-6.2-0.3S72.6,9.3,73,9.2z M71.6,6.7C71.8,6.8,75,5.4,77.3,5c2.3-0.3,1.9-0.5,1.9-0.6c0-0.1-1.1-0.2-2.7,0.2	C74.8,5.1,71.4,6.6,71.6,6.7z M93.6,4.4c0.1,0.2,3.5,0.8,5.6,1.8c2.1,1,1.8,0.6,1.9,0.5c0.1-0.1-0.8-0.8-2.4-1.3	C97.1,4.8,93.5,4.2,93.6,4.4z M65.4,11.1c-0.1,0.3,0.3,0.5,1.9-0.2s2.6-1.3,2.2-1.2s-0.9,0.4-2.5,0.8C65.3,10.9,65.5,10.8,65.4,11.1 z M34.5,12.4c-0.2,0,2.1,0.8,3.3,0.9c1.2,0.1,2,0.1,2-0.2c0-0.3-0.1-0.5-1.6-0.4C36.6,12.8,34.7,12.4,34.5,12.4z M152.2,21.1 c-0.1,0.1-2.4-0.3-7.5-0.3c-5,0-13.6-2.4-17.2-3.5c-3.6-1.1,10,3.9,16.5,4.1C150.5,21.6,152.3,21,152.2,21.1z"></path><path class="shape-divider-fill" d="M269.6,18c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3	C267.7,18.8,269.7,18,269.6,18z"></path><path class="shape-divider-fill" d="M227.4,9.8c-0.2-0.1-4.5-1-9.5-1.2c-5-0.2-12.7,0.6-12.3,0.5c0.3-0.1,5.9-1.8,13.3-1.2	S227.6,9.9,227.4,9.8z"></path><path class="shape-divider-fill" d="M204.5,13.4c-0.1-0.1,2-1,3.2-1.1c1.2-0.1,2,0,2,0.3c0,0.3-0.1,0.5-1.6,0.4	C206.4,12.9,204.6,13.5,204.5,13.4z"></path><path class="shape-divider-fill" d="M201,10.6c0-0.1-4.4,1.2-6.3,2.2c-1.9,0.9-6.2,3.1-6.1,3.1c0.1,0.1,4.2-1.6,6.3-2.6	S201,10.7,201,10.6z"></path><path class="shape-divider-fill" d="M154.5,26.7c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3	C152.6,27.5,154.6,26.8,154.5,26.7z"></path><path class="shape-divider-fill" d="M41.9,19.3c0,0,1.2-0.3,2.9-0.1c1.7,0.2,5.8,0.9,8.2,0.7c4.2-0.4,7.4-2.7,7-2.6	c-0.4,0-4.3,2.2-8.6,1.9c-1.8-0.1-5.1-0.5-6.7-0.4S41.9,19.3,41.9,19.3z"></path><path class="shape-divider-fill" d="M75.5,12.6c0.2,0.1,2-0.8,4.3-1.1c2.3-0.2,2.1-0.3,2.1-0.5c0-0.1-1.8-0.4-3.4,0	C76.9,11.5,75.3,12.5,75.5,12.6z"></path><path class="shape-divider-fill" d="M15.6,13.2c0-0.1,4.3,0,6.7,0.5c2.4,0.5,5,1.9,5,2c0,0.1-2.7-0.8-5.1-1.4	C19.9,13.7,15.7,13.3,15.6,13.2z"></path></svg>';
								break;

							case 'wave-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1047.1 3.7" preserveAspectRatio="xMidYMin slice"><path class="shape-divider-fill" d="M1047.1,0C557,0,8.9,0,0,0v1.6c0,0,0.6-1.5,2.7-0.3C3.9,2,6.1,4.1,8.3,3.5c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3C13.8,2,16,4.1,18.2,3.5c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3C23.6,2,25.9,4.1,28,3.5c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3C63,2,65.3,4.1,67.4,3.5	C68.3,3.3,69,1.6,69,1.6s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	C82.7,2,85,4.1,87.1,3.5c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3C92.6,2,94.8,4.1,97,3.5c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9	c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2	c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3	c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.6-0.4V0z M2.5,1.2C2.5,1.2,2.5,1.2,2.5,1.2C2.5,1.2,2.5,1.2,2.5,1.2z M2.7,1.4c0.1,0,0.1,0.1,0.1,0.1C2.8,1.4,2.8,1.4,2.7,1.4z"></path></svg>';
								break;

							case 'wave-4':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 51.76c36.21-2.25 77.57-3.58 126.42-3.58 320 0 320 57 640 57 271.15 0 312.58-40.91 513.58-53.4V0H0z" opacity="0.3"></path><path class="shape-divider-fill" d="M0 24.31c43.46-5.69 94.56-9.25 158.42-9.25 320 0 320 89.24 640 89.24 256.13 0 307.28-57.16 481.58-80V0H0z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0v3.4C28.2 1.6 59.4.59 94.42.59c320 0 320 84.3 640 84.3 285 0 316.17-66.85 545.58-81.49V0z"></path></svg>';
								break;

							case 'wave-5':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0v100c20 17.3 40 29.51 80 29.51 51.79 0 74.69-48.57 151.75-48.57 73.72 0 91 54.88 191.56 54.88C543.95 135.8 554 14 665.69 14c109.46 0 98.85 87 188.2 87 70.37 0 69.81-33.73 115.6-33.73 55.85 0 62 39.62 115.6 39.62 58.08 0 57.52-46.59 115-46.59 39.8 0 60 22.48 79.89 39.69V0z"></path></svg>';
								break;

							case 'wave-6':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M504.854,80.066c7.812,0,14.893,0.318,21.41,0.879 c-25.925,22.475-56.093,40.852-102.946,40.852c-20.779,0-37.996-2.349-52.898-6.07C413.517,107.295,434.056,80.066,504.854,80.066z M775.938,51.947c19.145,18.596,39.097,35.051,77.956,35.051c46.907,0,62.299-14.986,80.912-24.98 c-21.357-15.783-46.804-28.348-85.489-28.348C816.829,33.671,794.233,41.411,775.938,51.947z" opacity="0.3"></path><path class="shape-divider-fill" d="M1200.112,46.292c39.804,0,59.986,22.479,79.888,39.69v16.805 c-19.903-10.835-40.084-21.777-79.888-21.777c-72.014,0-78.715,43.559-147.964,43.559c-56.84,0-81.247-35.876-117.342-62.552 c9.309-4.998,19.423-8.749,34.69-8.749c55.846,0,61.99,39.617,115.602,39.617C1143.177,92.887,1142.618,46.292,1200.112,46.292z M80.011,115.488c-40.006,0-60.008-12.206-80.011-29.506v16.806c20.003,10.891,40.005,21.782,80.011,21.782 c80.004,0,78.597-30.407,137.669-30.407c55.971,0,62.526,24.026,126.337,24.026c9.858,0,18.509-0.916,26.404-2.461 c-57.186-14.278-80.177-48.808-138.66-48.808C154.698,66.919,131.801,115.488,80.011,115.488z M526.265,80.945 c56.848,4.902,70.056,28.726,137.193,28.726c54.001,0,73.43-35.237,112.48-57.724C751.06,27.782,727.548,0,665.691,0 C597.381,0,567.086,45.555,526.265,80.945z" opacity="0.5"></path><path class="shape-divider-fill" d="M0,0v85.982c20.003,17.3,40.005,29.506,80.011,29.506c51.791,0,74.688-48.569,151.751-48.569 c58.482,0,81.473,34.531,138.66,48.808c43.096-8.432,63.634-35.662,134.433-35.662c7.812,0,14.893,0.318,21.41,0.879 C567.086,45.555,597.381,0,665.691,0c61.856,0,85.369,27.782,110.246,51.947c18.295-10.536,40.891-18.276,73.378-18.276 c38.685,0,64.132,12.564,85.489,28.348c9.309-4.998,19.423-8.749,34.69-8.749c55.846,0,61.99,39.617,115.602,39.617 c58.08,0,57.521-46.595,115.015-46.595c39.804,0,59.986,22.479,79.888,39.69V0H0z"></path></svg>';
								break;

							case 'slant':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0,6V0h1000v100L0,6z"></path></svg>';
								break;

							case 'slant-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2600 131.1" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0L2600 0 2600 69.1 0 0z"></path><path class="shape-divider-fill" opacity="0.5" d="M0 0L2600 0 2600 69.1 0 69.1z"></path><path class="shape-divider-fill" opacity="0.25" d="M2600 0L0 0 0 130.1 2600 69.1z"></path></svg>';
								break;

							case 'slant-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1280 140V0H0l1280 140z" opacity="0.5"></path><path class="shape-divider-fill" d="M1280 98V0H0l1280 98z"></path></svg>';
								break;

							case 'rounded':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1000,4.3V0H0v4.3C0.9,23.1,126.7,99.2,500,100S1000,22.7,1000,4.3z"></path></svg>';
								break;

							case 'rounded-2':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0,0c0,0,0,6,0,6.7c0,18,240.2,93.6,615.2,92.6C989.8,98.5,1000,25,1000,6.7c0-0.7,0-6.7,0-6.7H0z"></path></svg>';
								break;

							case 'rounded-3':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0s573.08 140 1280 140V0z"></path></svg>';
								break;

							case 'rounded-4':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0v60s573.09 80 1280 80V0z" opacity="0.3"></path><path class="shape-divider-fill" d="M0 0v30s573.09 110 1280 110V0z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0s573.09 140 1280 140V0z"></path></svg>';
								break;

							case 'rounded-5':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0v.48C18.62 9.38 297.81 140 639.5 140 993.24 140 1280 0 1280 0z" opacity="0.3"></path><path class="shape-divider-fill" d="M0 .6c14 8.28 176.54 99.8 555.45 119.14C952.41 140 1280 0 1280 0H0z" opacity="0.5"></path><path class="shape-divider-fill" d="M726.29 101.2C1126.36 79.92 1281 0 1281 0H1c.05 0 325.25 122.48 725.29 101.2z"></path></svg>';
								break;

							case 'triangle':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none"><path class="shape-divider-fill" d="M350,10L340,0h20L350,10z"></path></svg>';
								break;

							case 'drops':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice"><path class="shape-divider-fill" d="M0 0v1.4c.6.7 1.1 1.4 1.4 2 2 3.8 2.2 6.6 1.8 10.8-.3 3.3-2.4 9.4 0 12.3 1.7 2 3.7 1.4 4.6-.9 1.4-3.8-.7-8.2-.6-12 .1-3.7 3.2-5.5 6.9-4.9 4 .6 4.8 4 4.9 7.4.1 1.8-1.1 7 0 8.5.6.8 1.6 1.2 2.4.5 1.4-1.1.1-5.4.1-6.9.1-3.7.3-8.6 4.1-10.5 5-2.5 6.2 1.6 5.4 5.6-.4 1.7-1 9.2 2.9 6.3 1.5-1.1.7-3.5.5-4.9-.4-2.4-.4-4.3 1-6.5.9-1.4 2.4-3.1 4.2-3 2.4.1 2.7 2.2 4 3.7 1.5 1.8 1.8 2.2 3 .1 1.1-1.9 1.2-2.8 3.6-3.3 1.3-.3 4.8-1.4 5.9-.5 1.5 1.1.6 2.8.4 4.3-.2 1.1-.6 4 1.8 3.4 1.7-.4-.3-4.1.6-5.6 1.3-2.2 5.8-1.4 7 .5 1.3 2.1.5 5.8.1 8.1s-1.2 5-.6 7.4c1.3 5.1 4.4.9 4.3-2.4-.1-4.4-2-8.8-.5-13 .9-2.4 4.6-6.6 7.7-4.5 2.7 1.8.5 7.8.2 10.3-.2 1.7-.8 4.6.2 6.2.9 1.4 2 1.5 2.6-.3.5-1.5-.9-4.5-1-6.1-.2-1.7-.4-3.7.2-5.4 1.8-5.6 3.5 2.4 6.3.6 1.4-.9 4.3-9.4 6.1-3.1.6 2.2-1.3 7.8.7 8.9 4.2 2.3 1.5-7.1 2.2-8 3.1-4 4.7 3.8 6.1 4.1 3.1.7 2.8-7.9 8.1-4.5 1.7 1.1 2.9 3.3 3.2 5.2.4 2.2-1 4.5-.6 6.6 1 4.3 4.4 1.5 4.4-1.7 0-2.7-3-8.3 1.4-9.1 4.4-.9 7.3 3.5 7.8 6.9.3 2-1.5 10.9 1.3 11.3 4.1.6-3.2-15.7 4.8-15.8 4.7-.1 2.8 4.1 3.9 6.6 1 2.4 2.1 1 2.3-.8.3-1.9-.9-3.2 1.3-4.3 5.9-2.9 5.9 5.4 5.5 8.5-.3 2-1.7 8.4 2 8.1 6.9-.5-2.8-16.9 4.8-18.7 4.7-1.2 6.1 3.6 6.3 7.1.1 1.7-1.2 8.1.6 9.1 3.5 2 1.9-7 2-8.4.2-4 1.2-9.6 6.4-9.8 4.7-.2 3.2 4.6 2.7 7.5-.4 2.2 1.3 8.6 3.8 4.4 1.1-1.9-.3-4.1-.3-6 0-1.7.4-3.2 1.3-4.6 1-1.6 2.9-3.5 5.1-2.9 2.5.6 2.3 4.1 4.1 4.9 1.9.8 1.6-.9 2.3-2.1 1.2-2.1 2.1-2.1 4.4-2.4 1.4-.2 3.6-1.5 4.9-.5 2.3 1.7-.7 4.4.1 6.5.6 1.5 2.1 1.7 2.8.3.7-1.4-1.1-3.4-.3-4.8 1.4-2.5 6.2-1.2 7.2 1 2.3 4.8-3.3 12-.2 16.3 3 4.1 3.9-2.8 3.8-4.8-.4-4.3-2.1-8.9 0-13.1 1.3-2.5 5.9-5.7 7.9-2.4 2 3.2-1.3 9.8-.8 13.4.5 4.4 3.5 3.3 2.7-.8-.4-1.9-2.4-10 .6-11.1 3.7-1.4 2.8 7.2 6.5.4 2.2-4.1 4.9-3.1 5.2 1.2.1 1.5-.6 3.1-.4 4.6.2 1.9 1.8 3.7 3.3 1.3 1-1.6-2.6-10.4 2.9-7.3 2.6 1.5 1.6 6.5 4.8 2.7 1.3-1.5 1.7-3.6 4-3.7 2.2-.1 4 2.3 4.8 4.1 1.3 2.9-1.5 8.4.9 10.3 4.2 3.3 3-5.5 2.7-6.9-.6-3.9 1-7.2 5.5-5 4.1 2.1 4.3 7.7 4.1 11.6 0 .8-.6 9.5 2.5 5.2 1.2-1.7-.1-7.7.1-9.6.3-2.9 1.2-5.5 4.3-6.2 4.5-1 7.7 1.5 7.4 5.8-.2 3.5-1.8 7.7-.5 11.1 1 2.7 3.6 2.8 5 .2 1.6-3.1 0-8.3-.4-11.6-.4-4.2-.2-7 1.8-10.8 0 0-.1.1-.1.2-.2.4-.3.7-.4.8v.1c-.1.2-.1.2 0 0v-.1l.4-.8c0-.1.1-.1.1-.2.2-.4.5-.8.8-1.2V0H0zM282.7 3.4z"></path></svg>';
								break;

							case 'cliff':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 279.24" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1000 0S331.54-4.18 0 279.24h1000z" opacity="0.25"></path><path class="shape-divider-fill" d="M1000 279.24s-339.56-44.3-522.95-109.6S132.86 23.76 0 25.15v254.09z"></path></svg>';
								break;

							case 'zigzag':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 5.8" preserveAspectRatio="none"><path class="shape-divider-fill" d="M5.4.4l5.4 5.3L16.5.4l5.4 5.3L27.5.4 33 5.7 38.6.4l5.5 5.4h.1L49.9.4l5.4 5.3L60.9.4l5.5 5.3L72 .4l5.5 5.3L83.1.4l5.4 5.3L94.1.4l5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3L161 .4l5.4 5.3L172 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3L261 .4l5.4 5.3L272 .4l5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3L361 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.6-5.4 5.5 5.3L461 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1L550 .4l5.4 5.3L561 .4l5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2L650 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2L750 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2L850 .4l5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.4V0H-.2v5.8z"></path></svg>';
								break;

							case 'illusion':
								shape = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 19.6" preserveAspectRatio="none"><path class="shape-divider-fill" opacity="0.33" d="M0 0L0 18.8 141.8 4.1 283.5 18.8 283.5 0z"></path><path class="shape-divider-fill" opacity="0.33" d="M0 0L0 12.6 141.8 4 283.5 12.6 283.5 0z"></path><path class="shape-divider-fill" opacity="0.33" d="M0 0L0 6.4 141.8 4 283.5 6.4 283.5 0z"></path><path class="shape-divider-fill" d="M0 0L0 1.2 141.8 4 283.5 1.2 283.5 0z"></path></svg>';
								break;

							default:
								shape = '';
								break;
						}

						element.innerHTML = shape;
						element.querySelector('svg').classList.add( 'op-ts' );

						setTimeout( function() {
							element.querySelector('svg').classList.add( 'op-1' );
						}, 500);

						element.classList.add('shape-divider-complete');
					});
				}
			};
		}(),
		// ShapeDivider Functions End

		/**
		 * --------------------------------------------------------------------------
		 * StickySidebar Functions Start
		 * --------------------------------------------------------------------------
		 */
		StickySidebar: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof jQuery !== 'undefined' && jQuery().scwStickySidebar;
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-stickysidebar', event: 'pluginStickySidebarReady' });

						selector = __core.getSelector( selector );
						if( selector.length < 1 ){
							return false;
						}

						selector.each( function(){
							var element = jQuery(this),
								elTop = element.attr('data-offset-top') || 110,
								elBottom = element.attr('data-offset-bottom') || 50;

							element.scwStickySidebar({
								additionalMarginTop: Number(elTop),
								additionalMarginBottom: Number(elBottom)
							});
						});
					});
				}
			};
		}(),
		// StickySidebar Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Cookies Functions Start
		 * --------------------------------------------------------------------------
		 */
		Cookies: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof Cookies !== "undefined";
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-cookie', event: 'pluginCookieReady' });

						selector = __core.getSelector( selector, false );
						if( selector.length < 1 ){
							return true;
						}

						var cookieBar = document.querySelector('.gdpr-settings'),
							elSpeed = cookieBar?.getAttribute('data-speed') || 300,
							elExpire = cookieBar?.getAttribute('data-expire') || 30,
							elDelay = cookieBar?.getAttribute('data-delay') || 1500,
							elPersist = cookieBar?.getAttribute('data-persistent'),
							elDirection = 'bottom',
							elHeight = cookieBar?.offsetHeight + 100,
							elWidth = cookieBar?.offsetWidth + 100,
							elSize,
							elSettings = document.querySelector('.gdpr-cookie-settings'),
							elSwitches = elSettings?.querySelectorAll('[data-cookie-name]');

						if( !cookieBar && !elSettings ) {
							return true;
						}

						if( cookieBar ) {
							if( elPersist == 'true' ) {
								Cookies.set('cnvsUsesCookies', '');
							}

							if( cookieBar?.classList.contains('gdpr-settings-sm') && cookieBar?.classList.contains('gdpr-settings-right') ) {
								elDirection = 'right';
							} else if( cookieBar?.classList.contains('gdpr-settings-sm') ) {
								elDirection = 'left';
							}

							if( elDirection == 'left' ) {
								elSize = -elWidth;
								cookieBar.style.right = 'auto';
								cookieBar.style.marginLeft = '1rem';
							} else if( elDirection == 'right' ) {
								elSize = -elWidth;
								cookieBar.style.left = 'auto';
								cookieBar.style.marginRight = '1rem';
							} else {
								elSize = -elHeight;
							}

							cookieBar.style[elDirection] = elSize + 'px';

							if( Cookies.get('cnvsUsesCookies') != 'yesConfirmed' ) {
								setTimeout( function() {
									cookieBar.style[elDirection] = 0;
									cookieBar.style.opacity = 1;
								}, Number( elDelay ) );
							}

							document.querySelector('.gdpr-accept').onclick = function(e) {
								e.preventDefault();

								cookieBar.style[elDirection] = elSize + 'px';
								cookieBar.style.opacity = 0;
								Cookies.set('cnvsUsesCookies', 'yesConfirmed', { expires: Number( elExpire ) });
							};
						}

						elSwitches?.forEach( function(el) {
							var elCookie = el.getAttribute( 'data-cookie-name' ),
								getCookie = Cookies.get( elCookie );

							if( typeof getCookie !== 'undefined' && getCookie == '1' ) {
								el.checked = true;
							} else {
								el.checked = false;
							}
						});

						if( document.querySelector('.gdpr-save-cookies') ) {
							document.querySelector('.gdpr-save-cookies').onclick = function(e) {
								e.preventDefault();

								elSwitches.forEach( function(el) {
									var elCookie = el.getAttribute( 'data-cookie-name' );

									if( el.checked == true ) {
										Cookies.set( elCookie, '1', { expires: Number( elExpire ) });
									} else {
										Cookies.remove( elCookie, '' );
									}
								});

								if( elSettings.closest( '.mfp-content' ).length > 0 ) {
									jQuery$.magnificPopup.close();
								}

								setTimeout( function() {
									window.location.reload();
								}, 500);
							};
						}

						document.querySelectorAll('.gdpr-container')?.forEach( function(element) {
							var elCookie = element.getAttribute('data-cookie-name'),
								elContent = element.getAttribute('data-cookie-content'),
								elContentAjax = element.getAttribute('data-cookie-content-ajax'),
								getCookie = Cookies.get( elCookie );

							if( typeof getCookie !== 'undefined' && getCookie == '1' ) {
								element.classList.add('gdpr-content-active');
								if( elContentAjax ) {
									fetch( elContentAjax ).then( function(response) {
										return response.text();
									}).then( function(html) {
										var domParser = new DOMParser();
										var parsedHTML = domParser.parseFromString(html, 'text/html');

										element?.insertAdjacentHTML('beforeend', parsedHTML.body.innerHTML);
									}).catch( function(err) {
										console.log(err);
									});
								} else {
									if( elContent ) {
										element.innerHTML += elContent;
									}
								}
								__core.runContainerModules(element);
							} else {
								element.classList.add('gdpr-content-blocked');
							}
						});
					});
				}
			};
		}(),
		// Cookies Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Quantity Functions Start
		 * --------------------------------------------------------------------------
		 */
		Quantity: function() {
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
		}(),
		// Quantity Functions End

		/**
		 * --------------------------------------------------------------------------
		 * ReadMore Functions Start
		 * --------------------------------------------------------------------------
		 */
		ReadMore: function() {
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
		}(),
		// ReadMore Functions End

		/**
		 * --------------------------------------------------------------------------
		 * PricingSwitcher Functions Start
		 * --------------------------------------------------------------------------
		 */
		PricingSwitcher: function() {
			var _switcher = function(checkbox, parent, pricing, defClass, actClass) {
				parent.querySelectorAll('.pts-left,.pts-right').forEach( function(el) {
					actClass.split(" ").forEach( function(_class) {
						el.classList.remove(_class);
					});

					defClass.split(" ").forEach( function(_class) {
						el.classList.add(_class);
					});
				});

				pricing.querySelectorAll('.pts-switch-content-left,.pts-switch-content-right').forEach( function(el) {
					el.classList.add('d-none');
				});

				if( checkbox.checked == true ) {
					defClass.split(" ").forEach( function(_class) {
						parent.querySelector('.pts-right').classList.remove(_class);
					});

					actClass.split(" ").forEach( function(_class) {
						parent.querySelector('.pts-right').classList.add(_class);
					});
					pricing.querySelectorAll('.pts-switch-content-right').forEach( function(el) {
						el.classList.remove('d-none');
					});
				} else {
					defClass.split(" ").forEach( function(_class) {
						parent.querySelector('.pts-left').classList.remove(_class);
					});

					actClass.split(" ").forEach( function(_class) {
						parent.querySelector('.pts-left').classList.add(_class);
					});

					pricing.querySelectorAll('.pts-switch-content-left').forEach( function(el) {
						el.classList.remove('d-none');
					});
				}
			};

			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-pricing-switcher', event: 'pluginPricingSwitcherReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(element) {
						var elCheck = element.querySelector('[type="checkbox"]'),
							elParent = element.closest('.pricing-tenure-switcher'),
							elDefClass = element.getAttribute('data-default-class') || 'text-muted op-05',
							elActClass = element.getAttribute('data-active-class') || 'fw-bold',
							elPricing = document.querySelector( elParent.getAttribute('data-container') );

						_switcher(elCheck, elParent, elPricing, elDefClass, elActClass);

						elCheck.addEventListener( 'change', function() {
							_switcher(elCheck, elParent, elPricing, elDefClass, elActClass);
						});
					});
				}
			};
		}(),
		// PricingSwitcher Functions End

		/**
		 * --------------------------------------------------------------------------
		 * AjaxButton Functions Start
		 * --------------------------------------------------------------------------
		 */
		AjaxButton: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-ajaxbutton', event: 'pluginAjaxButtonReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					selector.forEach( function(el) {
						el.onclick = function(e) {
							e.preventDefault();

							var trigger = el,
								elLoader = el.getAttribute('data-ajax-loader'),
								elContainer = document.querySelector( el.getAttribute('data-ajax-container') ),
								elContentPlacement = el.getAttribute('data-ajax-insertion') || 'append',
								elTriggerHide = el.getAttribute('data-ajax-trigger-hide') || 'true',
								elTriggerDisable = el.getAttribute('data-ajax-trigger-disable') || 'true';

							fetch(elLoader).then( function(response) {
								return response.text();
							}).then( function(html) {
								var domParser = new DOMParser();
								var parsedHTML = domParser.parseFromString(html, 'text/html');

								if( elContentPlacement == 'append' ) {
									elContainer?.insertAdjacentHTML('beforeend', parsedHTML.body.innerHTML);
								} else {
									elContainer?.insertAdjacentHTML('afterbegin', parsedHTML.body.innerHTML);
								}

								if( elTriggerHide == 'true' ) {
									el.classList.add('d-none');
								}

								__core.runContainerModules(elContainer);

								if( elTriggerDisable == 'true' ) {
									setTimeout( function() {
										trigger.onclick = function(e) {
											e.stopPropagation();
											e.preventDefault();

											return false;
										};
									}, 1000);
								}
							}).catch( function(err) {
								var errorDIV = document.createElement("div");
								errorDIV.classList.add( 'd-inline-block', 'text-danger', 'me-3' );
								errorDIV.innerText = 'Content Cannot be Loaded!';
								elContainer?.prepend( errorDIV, ': ' + err );
							});
						};
					});
				}
			};
		}(),
		// AjaxButton Functions End

		/**
		 * --------------------------------------------------------------------------
		 * VideoFacade Functions Start
		 * --------------------------------------------------------------------------
		 */
		VideoFacade: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-videofacade', event: 'pluginVideoFacadeReady' });

					selector = __core.getSelector( selector, false );

					selector.forEach( function(element) {
						element.onclick = function(e) {
							e.preventDefault();

							var videoContent = element.getAttribute('data-video-html'),
								videoRatio = element.getAttribute('data-video-ratio') || 'ratio ratio-16x9',
								videoPreviewEl = element.querySelector('.video-facade-preview'),
								videoContentEl = element.querySelector('.video-facade-content');

							videoPreviewEl.classList.add('d-none');
							videoContentEl.innerHTML += videoContent;

							videoRatio.split(" ").forEach( function(ratioClass) {
								videoContentEl.classList.add(ratioClass);
							});
						};
					});
				}
			};
		}(),
		// VideoFacade Functions End

		/**
		 * --------------------------------------------------------------------------
		 * SchemeToggler Functions Start
		 * --------------------------------------------------------------------------
		 */
		SchemeToggle: function() {
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
		}(),
		// SchemeToggler Functions End

		/**
		 * --------------------------------------------------------------------------
		 * Clipboard Functions Start
		 * --------------------------------------------------------------------------
		 */
		Clipboard: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

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
		}(),
		// Clipboard Functions End

		/**
		 * --------------------------------------------------------------------------
		 * CodeHighlight Functions Start
		 * --------------------------------------------------------------------------
		 */
		CodeHighlight: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.loadCSS({ file: 'components/prism.css', id: 'canvas-prism-css', cssFolder: true });
					__core.isFuncTrue( function() {
						return typeof Prism !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-codehighlight', event: 'pluginCodeHighlightReady' });

						selector = __core.getSelector( selector, false );
						if( selector.length < 1 ){
							return true;
						}

						selector.forEach( function(el) {
							Prism.highlightElement( el.querySelector('code') );
						});
					});
				}
			};
		}(),
		// CodeHighlight Functions End

		/**
		 * --------------------------------------------------------------------------
		 * ViewportDetect Functions Start
		 * --------------------------------------------------------------------------
		 */
		ViewportDetect: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.initFunction({ class: 'has-plugin-viewportdetect', event: 'pluginViewportDetectReady' });

					selector = __core.getSelector( selector, false );
					if( selector.length < 1 ){
						return true;
					}

					var observer = new IntersectionObserver( function(entries) {
						entries.forEach( function(entry) {
							var elTarget = entry.target;
							var elDelay = elTarget.getAttribute('data-delay') || 0;
							var elViewportClass = elTarget.getAttribute('data-viewport-class') || "";

							if( entry.isIntersecting ) {
								setTimeout( function() {
									elTarget.classList.add('is-in-viewport');
									elViewportClass.split(" ").forEach( function(_class) {
										_class && elTarget.classList.add(_class);
									});
								}, Number(elDelay));
							} else {
								elTarget.classList.remove('is-in-viewport');
								elViewportClass.split(" ").forEach( function(_class) {
									_class && elTarget.classList.remove(_class);
								});
							}
						});
					}, {
						threshold: 1.0,
					});

					selector.forEach( function(el) {
						observer.observe(el);
					});
				}
			};
		}(),
		// ViewportDetect Functions End

		/**
		 * --------------------------------------------------------------------------
		 * BSComponents Functions Start
		 * --------------------------------------------------------------------------
		 */
		BSComponents: function() {
			return {
				init: function(selector) {
					if( __core.getSelector(selector, false, false).length < 1 ){
						return true;
					}

					__core.isFuncTrue( function() {
						return typeof bootstrap !== 'undefined';
					}).then( function(cond) {
						if( !cond ) {
							return false;
						}

						__core.initFunction({ class: 'has-plugin-bscomponents', event: 'pluginBsComponentsReady' });

						selector = __core.getSelector( selector, false );
						if( selector.length < 1 ){
							return true;
						}

						var tooltips = [].slice.call(__core.getVars.baseEl.querySelectorAll('[data-bs-toggle="tooltip"]'));
						var tooltipList = tooltips.map( function(tooltipEl) {
							return new bootstrap.Tooltip(tooltipEl, {container: 'body'});
						});

						var popovers = [].slice.call(__core.getVars.baseEl.querySelectorAll('[data-bs-toggle="popover"]'));
						var popoverList = popovers.map( function(popoverEl) {
							return new bootstrap.Popover(popoverEl, {container: 'body'});
						});

						var tabs = document.querySelectorAll('[data-bs-toggle="tab"],[data-bs-toggle="pill"]');

						var tabTargetShow = function(target) {
							var tabTrigger = new bootstrap.Tab(target);
							tabTrigger.show();
						};

						document.querySelectorAll('.canvas-tabs').forEach( function(el) {
							var activeTab = el.getAttribute('data-active');

							if( activeTab ) {
								activeTab = Number(activeTab) - 1;
								tabTargetShow(el.querySelectorAll('[data-bs-target]')[activeTab]);
							}
						});

						document.querySelectorAll('.tab-hover').forEach( function(el) {
							el.querySelectorAll('[data-bs-target]').forEach( function(tab) {
								tab.addEventListener( 'mouseover', function() {
									tabTargetShow(tab);
								});
							});
						});

						if( __core.getVars.hash && document.querySelector('[data-bs-target="'+__core.getVars.hash+'"]') ) {
							tabTargetShow(document.querySelector('[data-bs-target="'+__core.getVars.hash+'"]'));
						}

						tabs.forEach( function(el) {
							el.addEventListener('shown.bs.tab', function(e) {
								if( !el.classList.contains('container-modules-loaded') ) {
									var tabContent = el.getAttribute('data-bs-target') ? el.getAttribute('data-bs-target') : el.getAttribute('href');
									__core.runContainerModules(document.querySelector(tabContent));

									document.querySelector(tabContent).querySelectorAll('.flexslider').forEach( function(flex) {
										setTimeout( function() {
											jQuery(flex).find('.slide').resize();
										}, 500);
									});

									el.classList.add('container-modules-loaded');
								}
							});
						});

						document.querySelectorAll('.style-msg .btn-close').forEach( function(el) {
							el.onclick = function(e) {
								e.preventDefault();

								el.closest( '.style-msg' ).classList.add('d-none');
							};
						});
					});
				}
			};
		}(),
		// BSComponents Functions End
	};
})));
