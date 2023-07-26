CNVS.Twitter = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

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
}();
