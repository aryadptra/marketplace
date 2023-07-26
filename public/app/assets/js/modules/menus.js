CNVS.Menus = function() {
	var __core = SEMICOLON.Core;
	var __base = SEMICOLON.Base;

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
}();
