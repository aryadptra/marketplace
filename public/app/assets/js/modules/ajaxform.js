CNVS.AjaxForm = function() {
	var __core = SEMICOLON.Core;
	var __modules = SEMICOLON.Modules;

	return {
		init: function(selector) {
			if( __core.getSelector(selector, false, false).length < 1 ){
				return true;
			}

			__core.loadJS({ file: 'plugins.form.js', id: 'canvas-form-js', jsFolder: true });

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
}();
