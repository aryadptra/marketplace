CNVS.YoutubeBG = function() {
	var __core = SEMICOLON.Core;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.youtube.js', id: 'canvas-youtube-js', jsFolder: true });

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
}();
