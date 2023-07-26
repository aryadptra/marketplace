CNVS.GoogleMaps = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			if( !__core.getOptions.gmapAPI ) {
				console.warn( 'No API Key defined for Google Maps! Please set an API Key in js/functions.js File!' );
				return true;
			}

			__core.loadJS({ file: 'https://maps.google.com/maps/api/js?key='+__core.getOptions.gmapAPI+"&callback=SEMICOLON.Modules.gmap", id: 'canvas-gmapapi-js' });
			__core.loadJS({ file: 'plugins.gmap.js', id: 'canvas-gmap-js', jsFolder: true });

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
}();
