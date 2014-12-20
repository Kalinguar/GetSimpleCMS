/**
 * GetSimple js file    
 * 
 */

if (typeof GS == "undefined") GS = {};
GS.notifyExpireDelay = 10000; // timout  to expire persistant notifications so they show stale (.notify_expired)
GS.removeItDelay     = 5000;  // timeout to remove non-persistant notifications

/* jshint multistr: true */

/* jQuery reverseOrder
 * Written by Corey H Maass for Arc90; (c) Arc90, Inc.
 */
(function($){$.fn.reverseOrder=function(){return this.each(function(){$(this).prependTo($(this).parent())})}})(jQuery);
/*
 * jQuery Capslock 0.4
 * Copyright (c) Arthur McLean
 */
(function($){$.fn.capslock=function(options){if(options)$.extend($.fn.capslock.defaults,options);this.each(function(){$(this).bind("caps_lock_on",$.fn.capslock.defaults.caps_lock_on);$(this).bind("caps_lock_off",$.fn.capslock.defaults.caps_lock_off);$(this).bind("caps_lock_undetermined",$.fn.capslock.defaults.caps_lock_undetermined);$(this).keypress(function(e){check_caps_lock(e)})});return this};function check_caps_lock(e){var ascii_code=e.which;var letter=String.fromCharCode(ascii_code);var upper=letter.toUpperCase();var lower=letter.toLowerCase();var shift_key=e.shiftKey;if(upper!==lower){if(letter===upper&&!shift_key){$(e.target).trigger("caps_lock_on")}else if(letter===lower&&!shift_key){$(e.target).trigger("caps_lock_off")}else if(letter===lower&&shift_key){$(e.target).trigger("caps_lock_on")}else if(letter===upper&&shift_key){if(navigator.platform.toLowerCase().indexOf("win")!==-1){$(e.target).trigger("caps_lock_off")}else{if(navigator.platform.toLowerCase().indexOf("mac")!==-1&&$.fn.capslock.defaults.mac_shift_hack){$(e.target).trigger("caps_lock_off")}else{$(e.target).trigger("caps_lock_undetermined")}}}else{$(e.target).trigger("caps_lock_undetermined")}}else{$(e.target).trigger("caps_lock_undetermined")}if($.fn.capslock.defaults.debug){if(console){console.log("Ascii code: "+ascii_code);console.log("Letter: "+letter);console.log("Upper Case: "+upper);console.log("Shift key: "+shift_key)}}}$.fn.capslock.defaults={caps_lock_on:function(){},caps_lock_off:function(){},caps_lock_undetermined:function(){},mac_shift_hack:true,debug:false}})(jQuery);


function randomNum(m,n) {
      m = parseInt(m);
      n = parseInt(n);
      return Math.floor( Math.random() * (n - m + 1) ) + m;
}

/* jcrop display */
function updateCoords(c) {
	var x = Math.floor(c.x);
	var y = Math.floor(c.y);
	var w = Math.floor(c.w);
	var h = Math.floor(c.h);
	$('#handw').show();
	$('#x').val(x);
	$('#y').val(y);
	$('#w').val(w);
	$('#h').val(h);
	$('#pich').html(h);
	$('#picw').html(w);
}

Debugger = function () {};
Debugger.log = function (message) {
	try {
		console.log(message);
	} catch (exception) {
		return;
	}
};

// log = function(msg){ Debugger.log(msg) };
// Debugger.log('Debugger Init');

(function ( $ ) {
/*
 * popit
 * element attention blink
 * ensures occurs only once
 * @param int $speed animation speed in ms
 */
$.fn.popit = function ($speed) {
	$speed = $speed || 500;
	$(this).each(function () {
		if ($(this).data('popped') !== true) {
			$(this).fadeOut($speed).fadeIn($speed);
			$(this).data('popped', true);
		}
	});
	return $(this);
};

/*
 * removeit
 * fadeout close on delay
 * @param int $delay delay in ms
 */
$.fn.removeit = function ($delay) {
	$delay = $delay || GS.removeItDelay;
	$(this).each(function () {
		$(this).delay($delay).fadeOut(500);
		// $(this).delay($delay).slideUp(300);
	});
	return $(this);
};

// overrides a method thats supposed to be called on a single node (a method like val)
// @todo why did i add this?
$.fn.overrideNodeMethod = function(methodName, action) {
    var originalVal = $.fn[methodName];
    var thisNode = this;
    $.fn[methodName] = function() {
    	// if called on node, avoid recursion from callback
        if (this[0]==thisNode[0] && arguments.callee.caller !== action) {
            return action.apply(this, arguments);
        } else {
            return originalVal.apply(this, arguments);
        }
    };
};

/**
 * add a close button to element
 */
$.fn.addCloseButton = function(){
	var button = $('<span class="close"><a href="javascript:void(0)"><i class="fa fa-times"></i></a></span>');
	$(button).on('click',function(){
		$(this).parent().dequeue().fadeOut(200);
	});
	$(this).prepend($(button));
	return $(this);
}

/*
 * gs spin wrapper for spin.js
 *
 * adds ajax or wait spinner, configured via opts object or presets
 * inherits color from parent if not present
 * presets.gs is base opts, all others are extended and override
 * 
 * @since 3.4
 *
 */

$.fn.spin = function(opts, color, shim) {

	return this.each(function() {
		var $this = $(this),
		data = $this.data();

		if (data.spinner) {
			data.spinner.stop();
			delete data.spinner;
		}

		if(opts === undefined) opts = $.fn.spin.presets['gs'];

		if (opts !== false) {
			opts = $.extend(
				{ color: color || $this.css('color') },
				$.fn.spin.presets['gs'],
				$.fn.spin.presets[opts] || opts
			);
			
			if(opts.shim !== undefined && opts.shim === true){
				var shimElem = $('<div style="position:relative;display:inline-block;height:100%;width:100%"></div>');
				$this.append(shimElem);
				data.spinner = new Spinner(opts).spin($(shimElem)[0]);
			} else {
				data.spinner = new Spinner(opts).spin(this); return;
			}
		}

		// @todo fix this
		// $(this).stopspinner = function(){
		// 	Debugger.log('stop');
		// 	$(this).data('spinner').stop();
		// }

	});
};

$.fn.spin.presets = {
	tiny:  {  width: 2, radius: 2 },
	large: { width: 6, radius: 8 },
	xlarge: { width: 10, radius: 13 },
	gsdefault: { color : 'rgba(255, 255, 255, 0.8)' },
	gstable: { shim: true },
	gsfilemanager: { width:3, radius: 4,color : 'rgba(0, 0, 0, 0.6)',left: '13px' , top: '50%' },
	gs: {
		lines      : 9,          // The number of lines to draw
		length     : 0,          // The length of each line
		width      : 4,          // The line thickness
		radius     : 5,          // The radius of the inner circle
		corners    : 1,          // Corner roundness (0..1)
		rotate     : 0,         // The rotation offset
		direction  : 1,          // 1 clockwise, -1 counterclockwise
		// color     : '#FFF',  // #rgb or #rrggbb or array of colors
		speed      : 1.2,        // Rounds per second
		trail      : 45,         // Afterglow percentage
		opacity    : 0,          // Opacity of the lines
		shadow     : false,      // Whether to render a shadow
		hwaccel    : false,      // Whether to use hardware acceleration
		className  : 'spinner',  // The CSS class to assign to the spinner
		zIndex     : 2e9,        // The z-index (defaults to 2000000000)
		top        : '50%',      // Top position relative to parent
		left       : '50%'      // Left position relative to parent
	}
};

}( jQuery));


/* notification functions */

function notifySuccess($msg) {
	return notify($msg, 'success');
}

function notifyOk($msg) {
	return notify($msg, 'ok');
}
 
function notifyWarn($msg) {
	return notify($msg, 'warning');
}
 
function notifyInfo($msg) {
	return notify($msg, 'info');
}
 
function notifyError($msg) {
	return notify($msg, 'error');
}
 
function notify($msg, $type) {
	// if ($type == 'ok' || $type== 'success' || $type == 'warning' || $type == 'info' || $type == 'error') {
		var $notify = $('<div style="display:none;" class="notify notify_' + $type + '"><p>' + $msg + '</p></div>').clone();
		// check for #bodycontent if .bodycontent does not exist, ckeditor fullscreen removes it
		if($('div.bodycontent').get(0)) var notifyelem = $('div.bodycontent').before($notify);
		else if($('#bodycontent').get(0)) var notifyelem = $('#bodycontent').before($notify);
		else Debugger.log('nowhere to insert notify');
		$notify.fadeIn();
		$notify.addCloseButton();
		$notify.notifyExpire();
		return $notify;
	// }
	// @todo else plain
}

$.fn.notifyExpire = function($delay){
	var self = $(this);
	$delay = $delay || GS.notifyExpireDelay;	
	// Debugger.log('expiring ' + $delay);
	setTimeout(
		function(e){
			// @todo this is broken, sometimes this fires as soon as its called, perhaps old timer is acting on it?
			self.addClass('notify_expired')
		},
		$delay
	);

	return $(this);
}
 
$.fn.parseNotify = function(){
	Debugger.log($(this));
	
	return $(this).each(function() {
		var msg     = $(this).html();
		var persist = $(this).hasClass('persist');
		var remove  = $(this).hasClass('remove');

		if($(this).hasClass('notify_success')){
			// clear other success messages cause this is probably a repeat or redundant, also undo nonce is stale
			clearNotify('success');
		    elem = notify(msg,'success');
		}
		else if($(this).hasClass('notify_error'))   elem = notify(msg,'error');
		else if($(this).hasClass('notify_info'))    elem = notify(msg,'info');
		else if($(this).hasClass('notify_warning')) elem = notify(msg,'warning');
		else elem = notify(msg);

		elem = elem.popit(); // we pop after ajax always and not on load ?

		if(persist) elem = elem.notifyExpire(); // expire persistants so we know they are older
		if(remove)  elem = elem.removeit();
	});
}

function clearNotify($type) {
	Debugger.log('CLEAR NOTIFY '+ $type);
	if($type !== undefined)	return $('.notify.notify_'+$type).remove();
	return $('div.wrapper .notify').remove();
}
 
function basename(str){
	return str.substring(0,str.lastIndexOf('/') );
}
	
/**
 * generic i18n using array
 * @todo add sprintf
 */
function i18n(key){
	Debugger.log(GS.i18n);
	if(!GS.i18n) return;
	return GS.i18n[key] || key;
}

/*
 * shitty sprintf can only replace %s for now
 */
function sprintf(str,value){
 	return str.replace(/%s/g,value);
}

/**
 * get elements tagname
 */
function getTagName(elem){
	return $(elem).prop('tagName');
}


jQuery(document).ready(function () {


	if($('body#upload')){
		if(getUrlParam('CKEditorFuncNum')) uploadCkeditorBrowse();
		else if (getUrlParam('browse') !== undefined) uploadBrowse();
	}
	
	function uploadBrowse(){
		Debugger.log('upload browse');
		// hide stuff header, footer, sidebar items, and filter if images
		$('#header').hide();
		$('body').css('margin-top','10px');
		if(!GS.debug) $('#footer').hide();
		$('#sidebar ul li:not(".dispupload")').hide();
		
		if(getUrlParam('type') == 'images'){
			$('#imageFilter').hide();
			$('.thumblinkexternal').show();
		}	
	}

	function uploadCustomBrowse(){
		var path = getUrlParam('path') ? getUrlParam('path')+'/' : '';

		// bind all primary links to callback
		$('.primarylink').each(function(item){
			// add listener
			$(this).on('click',function(e){
				e.preventDefault();
				var siteurl = GS.uploads;
				var fileUrl = $(this).data('fileurl');
				window.opener.filebrowsercallback(siteurl+fileUrl);
				window.close();
				return false;
			});
		});

		// handle thumbnails
		$('.thumblinkexternal').each(function(item){

			// add listeners
			$(this).on('click',function(e){
				e.preventDefault();
				var siteurl = '';
				var fileUrl = $(this).data('fileurl');
				window.opener.filebrowsercallback(siteurl+fileUrl);
				window.close();
				return false;
			});
		});

	}
	function filebrowsercallback(url,arg1,arg2){

	}

	function uploadCkeditorBrowse(){
		Debugger.log('upload ckeditor browse');
		uploadBrowse();

		//CKEditor=post-content&CKEditorFuncNum=1&langCode=en
		var funcnum  = getUrlParam('CKEditorFuncNum');
		var editorid = getUrlParam('CKEditor');
		var langcode = getUrlParam('langCode');

		// setup ckeditor callbacks

		// add cke func num to folder links
		// @todo this is no longer necessary, since I am preserving in php
		// 
		// $('tr.folder a').each(function(item){
		// 	var href = $(this).prop('href');
		// 	$(this).prop('href',href+'&CKEditorFuncNum='+funcnum)
		// 	$(this).prop('href',href+'&CKEditor='+editorid)
		// 	$(this).prop('href',href+'&langCode='+langcode)
		// });

		var path = getUrlParam('path') ? getUrlParam('path')+'/' : '';

		// bind all primary links to callback
		$('.primarylink').each(function(item){
			// add listener
			$(this).on('click',function(e){
				e.preventDefault();
				var siteurl = GS.siteurl;
				var fileUrl = $(this).data('fileurl');
				window.opener.CKEDITOR.tools.callFunction(funcnum, siteurl+fileUrl);
				window.close();
				return false;
			});
		});

		// handle thumbnails
		$('.thumblinkexternal').each(function(item){
			// add listeners
			$(this).on('click',function(e){
				e.preventDefault();
				var siteurl = GS.siteurl;
				var fileUrl = $(this).data('fileurl');
				window.opener.CKEDITOR.tools.callFunction(funcnum, siteurl+fileUrl);
				window.close();
				return false;
			});
		});

	}

	// gs event for file uploaded via dropzone
	$(window).on('fileuploaded',fileuploaded);
	
	function fileuploaded(){
		Debugger.log('fileuploaded');
		if(getUrlParam('CKEditorFuncNum')) uploadCkeditorBrowse();
		else if (getUrlParam('browse') !== undefined) uploadBrowse();
	};

	// Helper function to get parameters from the query string.
	// @todo this is temporary, splitters are much faster than regex, 
	// plus we will probably need a url mutator library in core soon 
	function getUrlParam(paramName)
	{
		var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=?([^&]+)?', 'i') ;
		var match = window.location.search.match(reParam) ;
		if(match && match.length > 1){
			// Debugger.log(match[1]);
			if(typeof match[1] == 'undefined') return '';
			return match[1];
		}
	}

	// init jq tabs custom handlers
	if(window.tabs){
		$("#tabs").tabs({
			activate: function(event, ui) {
				// set bookmarkable urls
				var hash = ui.newTab.context.hash;
				hash = "tab_"+hash.replace('#','');
				window.location.replace(('' + window.location).split('#')[0] + '#' + hash);	// should not affect history
			},
			create: function (event,ui) {
				// set active tab from hash
				if(window.location.hash){
					var selectedTabHash = window.location.hash.replace(/tab_/,"");
					var tabIndex = $( "#tabs li a" ).index($("#tabs li a[href='"+selectedTabHash+"']"));
					if(tabIndex > 0) $( "#tabs" ).tabs("option", "active", tabIndex );
				}	
			}
		});
	}
	// init aja xindicator
	var loadingAjaxIndicator;
	if($('#loader')[0]) initLoaderIndicator();


	function initLoaderIndicator(){
		// replace loader IMG with ajax loader
		$('#loader').remove();
		loadingAjaxIndicator = $($('#nav_loaderimg').spin('gsdefault').data('spinner').el).attr('id','loader').hide();
	}

	function checkCoords() {
		if (parseInt($('#x').val(),10)) return true;
		alert('Please select a crop region then press submit.');
		return false;
	}
   
	/* Listener for filter dropdown */
	function attachFilterChangeEvent() {
		$(document).on('change', "#imageFilter", function () {
			Debugger.log('attachFilterChangeEvent');
			loadingAjaxIndicator.show();
			var filterx = $(this).val();
			var filterTitle = $(this).find('option:selected').text();
			$("#imageTable").find("tr").hide();
			if (filterx == 'image') {
				$("#imageTable").find("tr .imgthumb").show();
			} else {
				$("#imageTable").find("tr .imgthumb").hide();
			}
			$("#filetypetoggle").html('&nbsp;&nbsp;/&nbsp;&nbsp;' + filterTitle);
			$("#imageTable").find("tr." + filterx).show();
			$("#imageTable").find("tr.folder").show();
			$("#imageTable").find("tr:first-child").show();
			$("#imageTable").find("tr.deletedrow").hide();
			loadingAjaxIndicator.fadeOut(500);
		});
	}
 
	//upload.php
	attachFilterChangeEvent();
 	$("#imageFilter").change(); //@todo if selected

	//image.php 
	var copyKitTextArea = $('textarea.copykit');
	$("select#img-info").change(function () {
		var codetype = $(this).val();
		var code = $('p#' + codetype).html();
		var originalBG = $('textarea.copykit').css('background-color');
		var fadeColor = "#FFFFD1";
		copyKitTextArea.fadeOut(500).fadeIn(500).html(code);
	});
	$(".select-all").on("click", function () {
		copyKitTextArea.focus().select();
		return false;
	});
 
 
	//autofocus index.php & resetpassword.php user fields on pageload
	$("#index input#userid").focus();
	$("#resetpassword input[name='username']").focus();
	
	// init capslock warning on password fields
	var capslockoptions = {
		caps_lock_on: function () {
			$(this).addClass('capslock');
		},
		caps_lock_off: function () {
			$(this).removeClass('capslock');
		},
		caps_lock_undetermined: function () {
			$(this).removeClass('capslock');
		},
		debug: false
	};
	$("input[type='password']").capslock(capslockoptions);
 
	// components.php
	
	function focusCompEditor(selector){
		var editor = $(selector + ' textarea');		
		editor.focus();
	}

	// auto focus component editors
	$('#components div.compdivlist a').on('click', function(ev){
		focusCompEditor($(this).attr('href'));
		ev.preventDefault();		
	});
	
	// bind component new button
	$("#addcomponent").on("click", function ($e) {
		$e.preventDefault();
		ajaxStatusWait();

		// get current highest id
		var id = $("#id").val();

		// copy template and add ids to fields
		var comptemplate = $('#comptemplate').clone();
		var newcomponent = comptemplate.children(':first');

		newcomponent.prop('id','section-'+id);
		newcomponent.css('display','none');
		newcomponent.find('.delcomponent').prop('rel',id);
		newcomponent.find("[name='id[]']").prop('value',id);
		newcomponent.find("[name='active[]']").prop('value',id);

		// insert new component
		$("#divTxt").prepend(newcomponent);
		
		// remove template noeditor class
		var input = newcomponent.find("[name='val[]']");
		input.addClass('oneline');
		input.removeClass('noeditor');
		
		// fade in
		newcomponent.slideToggle(500);

		// trigger title change
		newcomponent.find($("b.editable")).comptitleinput();

 		// bump id
		nextid = (id - 1) + 2;
		$("#id").val(nextid);

		$('#submit_line').fadeIn(); // fadein in case no components exist
		ajaxStatusComplete();
		
		// add code ditor
		var codeedit = input.hasClass('code_edit');
		if( codeedit && $.isFunction($.fn.editorFromTextarea)) input.editorFromTextarea();

		// add html editor
		var htmledit = input.hasClass('html_edit');
		if( htmledit && $.isFunction($.fn.htmlEditorFromTextarea)) input.htmlEditorFromTextarea();

		// set custom code editor height
		// var editor = input.data('editor');
		// if(editor){
		// 	// retain autosizing but make sure the editor start larger than 1 line high
		// 	$(editor.getWrapperElement()).find('.CodeMirror-scroll').css('min-height',100);
		// 	editor.refresh();
		// }

		$("#divTxt").find('input').get(0).focus(); // focus input so editor gets focused ( if it listens of course )
		// @todo make better focus events
	});

	// bind delete component button
	$("#maincontent").on("click",'.delcomponent', function ($e) {
		$e.preventDefault();
		Debugger.log($(this));
		var message = $(this).attr("title");
		var compid = $(this).attr("rel");
		var answer = confirm(message);
		if (answer) {
			loadingAjaxIndicator.show();
			var myparent = $(this).parents('.compdiv');
			myparent.slideUp(500, function () {
				if ($("#divlist-" + compid).length) {
					$("#divlist-" + compid).remove();
				}
				var title = $(myparent).find("[name='title[]']").val();
				notifyError(sprintf(i18n('COMPONENT_DELETED'),title)).popit();
				myparent.remove();
			});
			loadingAjaxIndicator.fadeOut(1000);
		}
	});

	// bind double click component name
	$("#maincontent").on('dblclick',"b.editable",function () {
		$(this).comptitleinput();
	});

	$.fn.comptitleinput = function(){
		var t = $(this).html();		
		$(this).parents('.compdiv').find("input.comptitle").hide();
		$(this).after('<div id="changetitle"><label>Title: </b><input class="text newtitle titlesaver" name="titletmp[]" value="' + t + '" /></div>');
		$(this).next('#changetitle').find('input.titlesaver').focus();
		$(this).parents('.compdiv').find("input.compslug").val('');
		$(this).hide();		
	}

	// update components codetext and slug upon title changes
	$("#maincontent").on("keyup","input.titlesaver", function () {
		var myval = $(this).val();
		$(this).parents('.compdiv').find(".compslugcode").html("'" + myval.toLowerCase() + "'");
		$(this).parents('.compdiv').find("b.editable").html(myval);
	}).on("focusout", "input.titlesaver", function () {
		var myval = $(this).val();
		$(this).parents('.compdiv').find(".compslugcode").html("'" + myval.toLowerCase() + "'");
		$(this).parents('.compdiv').find("b.editable").html(myval);
		$(this).parents('.compdiv').find("input.comptitle").val(myval);
		if(myval !== ''){
			$("b.editable").show();
			$('#changetitle').remove();
		}	
	});
 
 	// handle toggling active, @todo: enable some kind of css style etc here
	$("#maincontent").on("change","[name='active[]']", function () {
		var myval = $(this).val();
		// if($(this).is(':checked')) // do stuff
	});		

	// other general functions
	
	// suppress current sidemenus
	// @todo remove this, sometimes this is desired, eg. create new page
	$(".snav a.current").on("click", function ($e) {
		$e.preventDefault();
	});

	// grabs confirmation dialogs from source
	$(".confirmation").on("click", function ($e) {
		loadingAjaxIndicator.show();
		var message = $(this).attr("title");
		var answer = confirm(message);
		if (!answer) {
			loadingAjaxIndicator.fadeOut(500);
			return false;
		}
		loadingAjaxIndicator.fadeOut(500);
	});

	// delete confirm for pages
	// get message, link, tr make ajax call
	$("#maincontent").on("click",".delconfirm", function () {
		var message = $(this).attr("title");
		var dlink   = $(this).attr("href");
		var mytr    = $(this).parents("tr");

		mytr.css("font-style", "italic");
		var answer = confirm(message);
		if (answer) {
			if (!$(this).hasClass('noajax')) {
				loadingAjaxIndicator.show();
				mytr.addClass('deletedrow');
				mytr.fadeOut(500, function () {
					$.ajax({
						type: "GET",
						url: dlink,
						success: function (response) {
							response = $.parseHTML(response);
							mytr.remove();
							if ($("#pg_counter").length) {
								counter = $("#pg_counter").html();
								$("#pg_counter").html(counter - 1);
							}
 
							$('div.wrapper .updated').remove();
							$('div.wrapper .error').remove();
							$(response).find('div.notify').parseNotify();
							}
					});
					loadingAjaxIndicator.fadeOut(500);
				});
				return false;
			}
		} else {
			mytr.css('font-style', 'normal');
			return false;
		}
	});

	//wait for archive creation
	$("#waittrigger").click(function () {
		loadingAjaxIndicator.fadeIn();
		$("#waiting").fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000);
	});
 
 
	/* Notifications */
 
	/*
	notifyError('This is an ERROR notification');
	notifySuccess('This is an OK notification');
	notifyWarn('This is an WARNING notification');
	notifyInfo('This is an INFO notification');
	notify('message','msgtype');
	notifyError('This notification blinks and autocloses').popit(ms speed).removeit(ms delay);   
	*/
 
	function popAlertMsg() {
		/* legacy, see jquery extend popit() and removeit() */
		$(".updated").fadeOut(500).fadeIn(500);
		$(".error").fadeOut(500).fadeIn(500);
 
		$(".notify").popit(); // allows legacy use
		$(".notify.remove").removeit();
		$(".notify.persist").notifyExpire();
		$(".notify").addCloseButton();
	}
 
	popAlertMsg();
 
 	// fancybox lightbox init
 	// rel=fancybox (_i/_s)
	if (jQuery().fancybox) {
		$('a[rel*=facybox]').fancybox({
			type: 'ajax',
			padding: 0,
			scrolling: 'auto'
		});
		$('a[rel*=facybox_i]').fancybox();
		$('a[rel*=facybox_s]').fancybox({
			type: 'ajax',
			padding: 0,
			scrolling: 'no'
		}).on('click',function(e){e.preventDefault();});
	}
 
 	/* Ajax save status indicator control */
    function ajaxStatusWait(){
    	$('input[type=submit]').attr('disabled', 'disabled');
		loadingAjaxIndicator.show();
    }

    function ajaxStatusComplete(){
    	$('input[type=submit]').attr('disabled', false);
		loadingAjaxIndicator.fadeOut();
		$("body").removeClass('dirty');	
   	}

	//plugins.php
	$("#maincontent").on("click", ".toggleEnable", function ($e) {
		$e.preventDefault();
 
		// document.body.style.cursor = "wait";
		loadingAjaxIndicator.show();
 
		var message = $(this).attr("title");
		var dlink = $(this).attr("href");
		var mytd = $(this).parents("td");
		var mytr = $(this).parents("tr");

		var old = mytd.html();
		mytd.html('').addClass('ajaxwait_tint_dark').spin('gstable');

		$('.toggleEnable').addClass('disabled');

		$.ajax({
			type: "GET",
			dataType: "html",
			url: dlink,
			success: function (data, textStatus, jqXHR) {
				// Store the response as specified by the jqXHR object
				// responseText = jqXHR.responseText;
				// responseText = $.parseHTML(data);

				rscript      = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;						
				responseText = data.replace(rscript, "");
				response     = $($.parseHTML(data));

				if ($(response).find('div.notify_success')) {
					// remove scripts to prevent assets from loading when we create temp dom
					rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	 
					// create temp doms to reliably find elements
					$('#header').html($("<div>").append($(response)).find('#header > *'));
					$('#sidebar').html($("<div>").append($(response)).find('#sidebar > *'));
					$('#maincontent').html($("<div>").append($(response)).find('#maincontent > *'));
	 
					// document.body.style.cursor = "default";
					$(response).find('div.updated').parseNotify();
					initLoaderIndicator();
				} else if ($(response).find('div.notify_error')) {
					document.body.style.cursor = "default";
					mytd.html(old).removeClass('ajaxwait_tint_dark');
					$('.toggleEnable').removeClass('disabled');
					loadingAjaxIndicator.fadeOut();
					Debugger.log(mytd.data('spinner'));
					mytd.data('spinner').stop(); // @todo not working, spinner keeps spinning
					$(response).find('div.updated').parseNotify();
				} else {
					clearNotify();
					notifyError(i18n('ERROR'));
				}
			},
			error: function (data, textStatus, jqXHR) {
				// These go in failures if we catch them in the future
				document.body.style.cursor = "default";
				mytd.removeClass('ajaxwait_tint_dark');
				$('.toggleEnable').removeClass('disabled');
				loadingAjaxIndicator.fadeOut();
				mytd.stop();
				clearNotify();
				notifyError(i18n('ERROR'));
			}
 
		});
	});
 
	function getElemLabel(element){
		var label = $("label[for='"+element.attr('id')+"']");
		if (label.length === 0) {
			label = element.closest('label');
		}
		return label;
	}

	// edit.php
	function updateMetaDescriptionCounter(ev) {
		var element = $(ev.currentTarget);
		var label = getElemLabel(element);
		var countdown = label.find('.countdown');
		var charlimit = element.attr('data-maxLength');

		if(label && charlimit && countdown){
			var remaining = charlimit - element.val().length;
			countdown.text(remaining);
			if(remaining < 0) countdown.addClass('maxchars');
			else countdown.removeClass('maxchars');
		}
	}

	if ($('.charlimit').length) {
		$('.charlimit').change(updateMetaDescriptionCounter);
		$('.charlimit').keyup(updateMetaDescriptionCounter);
		$('.charlimit').trigger('change');
	}

	// focus page title on new page
	if ($("#edit input#post-title:empty").val() === '') {
		$("#edit input#post-title").focus();
	}

	// LEGACY page options toggle for page options for plugin support
	$("#metadata_toggle").on("click", function ($e) {
		$e.preventDefault();
		$("#metadata_window").slideToggle('fast');
		$(this).toggleClass('current');
	});


	// page is private toggle changes color
	var privateLabel = $("#post-private-wrap label");
	$("#post-private").change(function () {
		if ($(this).val() == "Y") {
			privateLabel.css("color", '#cc0000');
		} else {
			privateLabel.css("color", '#333333');
		}
	});

	if ($("#post-private").val() == "Y") {
		privateLabel.css("color", '#cc0000');
	} else {
		privateLabel.css("color", '#333333');
	}

	// menu enabled toggle
	$("#post-menu-enable").on("click", function () {
		$("#menu-items").slideToggle("fast");
	});

	if ($("#post-menu-enable").is(":checked")) {} else {
		$("#menu-items").css("display", "none");
	}

	// init auto saving
	if(typeof GSAUTOSAVEPERIOD !== 'undefined' && parseInt(GSAUTOSAVEPERIOD,10) > 0) autoSaveInit();

    // ajaxify edit.php submit
    $('body #editform').on('submit',function(e){
        if($('body').hasClass('ajaxsave')){
        	e.preventDefault();
            if(checkTitle()) ajaxSave().done(ajaxSaveCallback);
            return false;
        } else {
            warnme      = false;
        	pageisdirty = false;
        	return checkTitle();
        	// return true;
        }
    });

    /* Warning for unsaved Data */
    var yourText    = null;
    var warnme      = false;
    var pageisdirty = false;

    $('#cancel-updates').hide();

    window.onbeforeunload = function () {
        if (warnme || pageisdirty === true) {
            return i18n('UNSAVED_INFORMATION');
        }
    };

    // check that title is not empty
    function checkTitle(){
        if($.trim($("#post-title").val()).length === 0){
            alert(i18n('CANNOT_SAVE_EMPTY'));
            return false;
        } return true;
    }

    // init auto save for page edit
	function autoSaveInit(){
		Debugger.log('auto saving initialized ' + GSAUTOSAVEPERIOD);
		$('#autosavestatus').show();
		$('#autosavenotify').show();
		setInterval(autoSaveIntvl, GSAUTOSAVEPERIOD*1000);
    }

    // interval for autosave
    function autoSaveIntvl(){
        Debugger.log('autoSaveIntvl called ' + GSAUTOSAVEPERIOD);
        if(pageisdirty === true){
            Debugger.log('autoSaveIntvl called, form is dirty: autosaving');
            ajaxSave('&autosave=1').done(autoSaveCallback);
            pageisdirty = false;
        }
    }

	function autoSaveDestroy(){
		Debugger.log('auto saving destroying ' + GSAUTOSAVEPERIOD);
		$('#autosavestatus').show();
		$('#autosavenotify').show();
		setInterval(autoSaveIntvl, GSAUTOSAVEPERIOD*1000);
    }

    // ajax save function for edit.php #editform
    function ajaxSave(urlargs) {

        // $('input[type=submit]').attr('disabled', 'disabled');
        ajaxStatusWait();
        // we are using ajax, so ckeditor wont copy data to our textarea for us, so we do it manually
        if($('#post-content').data('htmleditor')){ $('#post-content').val($('#post-content').data('htmleditor').getData()); }
		// Debugger.log($('#post-content').val());

        var dataString = $("#editform").serialize();
        dataString += '&submitted=true&ajaxsave=1';
        if(urlargs) dataString += urlargs;

        return $.ajax({
            type: "POST",
            url: "changedata.php",
            data: dataString
        });
    }

    // perform upating after auto save
    function autoSaveUpdate(success,status){
        $('#autosavestatus').hide();
        $('#autosavenotify').html(status);
        $('input[type=submit]').attr('disabled', false);
        if(success){
        	Debugger.log("auto save success");
            $('#cancel-updates').hide();
			ajaxStatusComplete();
            warnme = false;
        }
        pageisdirty = !success;
    }

    // prerform updating after ajax save
    function ajaxSaveUpdate(success,status){
		clearNotify('success');
        notifySuccess(status).popit();    	
        if(success) {
            $('#cancel-updates').hide();
            ajaxStatusComplete();
            warnme = false;
        }
        pageisdirty = !success;
    }

    // handle ajaxsave success
    function ajaxSaveSucess(response){
        updateEditSlug(response);
        updateNonce(response);
        $('#maincontent.newdraft').removeClass('newdraft'); // remove newdraft class / show action buttons
        // @todo change window url to new slug so refreshes work
    }

    // handle ajax save error
    function ajaxSaveError(response){
        ajaxError(response);
        if ($(response).find('div.updated')) {
        	$(response).find('div.updated').parseNotify();
        } else notifyError(i18n('ERROR_OCCURED')).popit();
        warnme = false;
        pageisdirty = true;
    }

    // call callbacks for autosave succcess or error
    function autoSaveCallback(response){
        Debugger.log('autoSaveCallback ');
        response = $.parseHTML(response);
        if ($(response).find('div.updated')) {
            autoSaveUpdate(true,$(response).find('div.autosavenotify').html());
            ajaxSaveSucess(response);
        }
        else {
            ajaxSaveError(response);
            autoSaveUpdate(false,i18n('ERROR_OCCURED'));
        }
    }

    // ajaxsave callback parse response
    function ajaxSaveCallback(response){
        // Debugger.log('ajaxSaveCallback ' + response);
        response = $.parseHTML(response);
        if ($(response).find('div.updated')) {
            ajaxSaveUpdate(true,$(response).find('div.updated').html());
            ajaxSaveSucess(response);
        }
        else {
            ajaxSaveError(response);
        }
    }

    // We register title and slug changes with change() which only fires when you lose focus to prevent midchange saves.
    $('#post-title, #post-id').change(function () {
        $('#editform #post-content').trigger('change');
    });

    // We register all other form elements to detect changes of any type by using bind
    $('#editform input,#editform textarea,#editform select').not('#post-title').not('#post-id').bind('change keypress paste textInput input',function(){
        Debugger.log('#editform changed');
        warnme      = true;
        pageisdirty = true;
        autoSaveInd();
    });

    // auto save indicator, show notify, reset button style
    function autoSaveInd(){
        $("body").addClass('dirty');        
        // $('input[type=submit]').css('border-color','#CC0000');
        $('#cancel-updates').show();
    }

	// adds sidebar submit buttons and fire clicks
	var edit_line = $('#submit_line span').html();
	// var edit_ok = '<i class="fa fa-fw fa-check-circle label-ok-color" style="font-size: 24px;"></i></p>';
	$('#js_submit_line').html(edit_line);
	$("#js_submit_line input.submit").on("click", function () {
		$("#submit_line input.submit").trigger('click');
	});

	// page is dirty, add to sidebars inputs
	var unsaved = '<p id="pagechangednotify">'+ i18n('PAGE_UNSAVED')+'</p>';
	$('#js_submit_line').after(unsaved);

    $('form input,form textarea,form select').not('#post-title').not('#post-id').bind('change keypress paste textInput input',function(){
        // Debugger.log('form changed');
        if($("body").hasClass('dirty')) return;
        if($(this).closest($('form')).find('#submit_line').get(0)) $("body").addClass('dirty');
    });

	// save and close
	$(".save-close a").on("click", function ($e) {
		$e.preventDefault();
		$('body').removeClass('ajaxsave');
		$('input[name=redirectto]').val('pages.php');
		$("#submit_line input.submit").trigger('click');
	});
 
 
	// pages.php
	
	// toggle status
	$("#show-characters").on("click", function () {
		if($(this).hasClass('current')) hidePageStatus();
		else showPageStatus();
	});
 
	function showPageStatus(){
		$(".showstatus").show();
		$("#show-characters").addClass('current');
		setConfig('pagestatustoggle',true);	
	}

	function hidePageStatus(){
		$(".showstatus").hide();
		$("#show-characters").removeClass('current');
		setConfig('pagestatustoggle',false);
	}

	function initPageStatus(){
		var filterstate = getConfig('pagestatustoggle');
		if(typeof filterstate !== undefined){
			if(filterstate == true) showPageStatus(true);
			else hidePageStatus(true);
		}		
	}
	
	initPageStatus();

 
	// log.php
	if (jQuery().reverseOrder) {
		$('ol.more li').reverseOrder();
	}
	$("ol.more").each(function () {
		var show = 7; // how many to show
		$("li:gt("+(show-1)+")", this).hide(); /* :gt() is zero-indexed */
		if($("li:nth-child("+(show+1)+")", this)[0]) $("li:nth-child("+show+")", this).after("<li class='more'><a href='#'>More...</a></li>"); /* :nth-child() is one-indexed */
	});
	$("li.more a").on("click", function ($e) {
		$e.preventDefault();
		var li = $(this).parents("li:first");
		li.parent().children().show();
		li.remove();
	});

	// theme.php
	$("#theme_select").on('change',function (e) {
		var theme_new = $(this).val();
		var theme_url_old = $("#theme_preview").attr('src');
		// we dont have a global paths in js so work theme path out
		var theme_path = basename(basename(basename(theme_url_old)));	
		var theme_url_new = theme_path+'/'+theme_new+'/images/screenshot.png';
		$("#theme_preview").attr('src',theme_url_new);
		$("#theme_preview").css('visibility','visible');
		$('#theme_no_img').css('visibility','hidden');		
	});
 
	$("#theme_preview").on('error',function ($e) {
		$(this).css('visibility','hidden');
		$('#theme_no_img').css('visibility','visible');
	});

	///////////////////////////////////////////////////////////////////////////
	// theme-edit.php
	///////////////////////////////////////////////////////////////////////////
	
	// change gs theme dropdown
	$("#theme-folder").on('change',function (e) {
		var thmfld = $(this).val();
		if (checkChanged()) return; // todo: change selection back
		$('#theme_filemanager').html('Loading...');
		updateTheme(thmfld);
	});

	// codemirror editor theme select
	$('#cm_themeselect').on('change',function(e){
		var theme = $(this).find(":selected").text();
		sendDataToServer('theme-edit.php','themesave='+theme);
		cm_theme_update(theme);		
	});

	function sendDataToServer(url,datastring){
		$.ajax({
			type: "POST",
			dataType: "html",
			url: url,
			data: datastring,
			success: function (data) {
				
			}	
		});
	}	

	// theme-edit fileselector change
	// delegated on() handlers survive ajax replacement
	$(document).on('click',"#theme_filemanager a.file",function(e){
		// Debugger.log('filechange');
		e.preventDefault();
		var thmfld = $("#theme-folder").val();
		// Debugger.log($(this).attr('href'));
		if (checkChanged()) return;
		clearFileOpen();
		$(this).addClass('open').addClass('ext-wait');
		$(this).parent().spin('gsfilemanager'); // ajax spinner
		updateTheme('','_noload',$(this).attr('href')+'&ajax=1'); // ajax request
	});

	function checkChanged(){
		// @todo add non codemirror change detection using listeners
		if($('#codetext').data('editor') && $('#codetext').data('editor').hasChange === true){
			return !confirm(i18n('UNSAVED_PROMPT'));
		}
	}

	// update theme-edit code editor
	function updateTheme(theme,file,url){

		// Debugger.log(theme);
		theme = theme === undefined ? '' : theme;
		file  = file  === undefined ? '' : file;
		url   = url   === undefined ? "theme-edit.php?t="+theme+'&f='+file : url;
		
		ajaxStatusWait();
		if($('#codetext').data('editor')){
			$('#codetext').data('editor').setValue('');
			$('#codetext').data('editor').hasChange = false;
		}
		$('#theme_edit_code').addClass('readonly')

		$.ajax({
			type: "GET",
			cache: false,
			url: url,
			paramfile: file, // not sure if its ok to stuff local things here, but it takes it
			success: function( data ) {
				rscript      = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;						
				responseText = data.replace(rscript, "");
				response     = $($.parseHTML(data));

				/* load dir tree */
				// using this var to prevent reloads on the filetree for now, 
				// can go away when we are sending proper ajax responses and not full html pages.
				if(this.paramfile!='_noload'){
					$('#theme_filemanager').html(response.find('#theme_filemanager > *') ); 
				}

				/* load file code content */
				var newcontent = response.find('#codetext');
				$('#codetext').val(newcontent.val());
				
				/* update form action for no ajaxsave */
				/* !important lame JS issue, form must be inside a element in the resposne, innerhtml parents cannot be form tags and they get removed */
				var themeEditform = response.find('#themeEditForm');
				var action = $(themeEditform).attr('action');
				$('#themeEditForm').attr('action',action);

				// update edited_file
				var filenamefield = response.find('#edited_file');
				var filename = $(filenamefield).val();
				$('#edited_file').val(filename);
				updateNonce(response);

				// update codemirror instance with new code
				if($('#codetext').data('editor')){
					$('#codetext').data('editor').setValue(newcontent.val());
					$('#codetext').data('editor').hasChange = false;
					/* update editor mode */
					$('#codetext').data('editor').setOption('mode',getEditorMode(getExtension(filename)));
					$('#codetext').data('editor').refresh();
				}
				/* hook wrapper */
				$('#theme-edit-extras-wrap').html(response.find('#theme-edit-extras-wrap > *'));

				/* title */
				$('#theme_editing_file').html(filename);

				clearFileWaits();
				ajaxStatusComplete();

				if($(filenamefield).hasClass('nofile')) return;
				$('#theme_edit_code').removeClass('readonly');

			}
		});

	}
	
	// removes loading icons
	function clearFileWaits(){
		$('#theme_filemanager li .spinner').each(function(){$(this).closest('li').data('spinner').stop();}); 
		$('#theme_filemanager a.ext-wait').removeClass('ext-wait'); 
	}

	// removes active file backgrounds
	function clearFileOpen(){
		$('#theme_filemanager a.open').removeClass('open'); 
	}

	// ajaxify theme submit
	$('body.ajaxsave #themeEditForm').on('submit',function(e){
		e.preventDefault();
		themeFileSave($('#codetext').data('editor'));
	});

	$('#themeEditForm .cancel').on('click',function(e){
		e.preventDefault();
		editor = $('#codetext').data('editor');
		if(editor){
			$('#theme_edit_code').addClass('readonly');
			editor.setValue($(editor.getTextArea()).val());
			editor.hasChange = false;
			setTimeout(function(){$('#theme_edit_code').removeClass('readonly');},500);
		}
		notifyWarn('Updates cancelled').removeit();
	});

	// theme-edit ajax save
	themeFileSave = function(cm){
		ajaxStatusWait();

		if($(cm)[0] && $.isFunction(cm.save)){
			cm.save(); // copy cm back to textarea if editor has save method
		}	

		var dataString = $("#themeEditForm").serialize();

		$.ajax({
			type: "POST",
			cache: false,
			url: 'theme-edit.php',
			data: dataString+'&submitsave=1&ajaxsave=1',
			success: function( response ) {
				response = $.parseHTML(response); // jquery 1.9 html parsing fix
				$('div.wrapper .updated').remove();
				$('div.wrapper .error').remove();
				if ($(response).find('div.updated')) {
					$(response).find('div.notify').parseNotify();
				}
				else {
					notifyError("<p>ERROR</p>").popit().removeit();					
				}

				updateNonce(response);

				ajaxStatusComplete();
				$('#codetext').data('editor').hasChange = false; // mark clean		
			}
		});
	};

	// ajaxify components submit
	$('body.ajaxsave #compEditForm').on('submit',function(e){
		e.preventDefault();
		componentSave(e);
	});
	
	componentSave = function(e){

		Debugger.log("onsubmit");
		e.preventDefault();
		ajaxStatusWait();
		
		cm_save_editors();
		cm_save_htmleditors();
		cm_save_inlinehtmleditors();
		var dataString = $("#compEditForm").serialize();			

		$.ajax({
			type: "POST",
			cache: false,
			// url: 'components.php',
			data: dataString+'&submitted=1&ajaxsave=1',
			success: function( response ) {
				response = $.parseHTML(response);
				// Debugger.log($(response).find('div.updated'));
				$(response).find('div.updated').parseNotify();
				updateNonce(response);
				ajaxStatusComplete();
			}
		});
	};

	updateNonce = function(html){
		var newnonce = $(html).find('#nonce').val();
		if(newnonce) $('#nonce').val(newnonce);
		// Debugger.log(newnonce);
	};

	updateEditSlug = function(html){
		var newslug = $(html).find('#existing-url').val();
		if(newslug) $('#existing-url').val(newslug);
		// Debugger.log(newslug);

		var newslug = $(html).find('#post-id').val();
		if(newslug) $('#post-id').val(newslug);
		// Debugger.log(newslug);
	};

	function getExtension(file){
		var extension = file.substr( (file.lastIndexOf('.') +1) );
		return extension;
	}

	// tree folding
	$(document).on('click',"#theme_filemanager a.directory",function(e){
		$(this).toggleClass('dir-open');
		$(this).next("ul").slideToggle('fast');
	});


	// update editor theme and lazy load css file async and update theme on callback
	cm_theme_update = function(theme){
		// Debugger.log('updating codemirror theme: ' + theme);
		var parts = theme.split(' ');
		callback = function () {
				cm_theme_update_editors(theme);
			};
		if(theme == "default") cm_theme_update_editors(theme);
		else loadjscssfile("template/js/codemirror/theme/"+parts[0]+".css", "css", callback );
	};

	// set all editors themes
	cm_theme_update_editors = function(theme){
		// Debugger.log(theme);
		$('.code_edit').each(function(i, textarea){
			var editor = $(textarea).data('editor');
			// Debugger.log(editor);
			// update all editor themes, unless they were modified manually
			if(editor && editor.getOption('theme') == editorTheme) {
				editor.setOption('theme',theme);	
				editor.refresh();
			}	
		});	
		editorConfig.theme = theme;		
		editorTheme = theme; // update global
	};

	// save all editors
	cm_save_editors = function(){
		// Debugger.log(theme);
		$('.code_edit').each(function(i, textarea){
			var editor = $(textarea).data('editor');
			// Debugger.log(editor);
			if(editor) {
				editor.save();
			}	
		});		
	};

	// save all editors
	cm_save_htmleditors = function(){
		// Debugger.log(theme);
		$('.html_edit').each(function(i, textarea){
			var editor = $(textarea).data('htmleditor');
			// Debugger.log(editor);
			if(editor) {
				Debugger.log('saving html editors');
				editor.updateElement(); 
			}
		});		
	};

	// save all editors
	cm_save_inlinehtmleditors = function(){
		// Debugger.log(theme);
		$('[contenteditable="true"]').each(function(i,elem){
			Debugger.log($(elem).prop('id'));
			var id = $(this).prop('id');
			var editor = CKEDITOR.instances[id];
			// CKEDITOR.instances.[blockID].getData()
			Debugger.log(editor);
			if(editor) {
				Debugger.log('saving html editors');
				Debugger.log(editor.getData());
			}
		});		
	};

	///////////////////////////////////////////////////////////////////////////
	// title filtering on pages.php & backups.php
	///////////////////////////////////////////////////////////////////////////

	var filterSearchInput = $("#filter-search");
	// toggle filter input
	$('#filtertable').on("click", function ($e) {
		$e.preventDefault();
		
		// filterSearchInput.slideToggle();
		if($(this).hasClass('current')) hideFilter();
		else showFilter();
	});
	// enter ignore
	$("#filter-search #q").keydown(function ($e) {
		if ($e.keyCode == 13) {
			$e.preventDefault();
		}
	});
	// create index columns
	// if class filter exists then we expect it to have indexcolumn already
	$("#editpages:not('.filter') tr:has(td.pagetitle)").each(function () {
		Debugger.log('creating index column');
		// find all text in pagetitle td, includes show status toggle (menu item)
		var t = $(this).find('td.pagetitle').text().toLowerCase();
		$("<td class='indexColumn'></td>").hide().text(t).appendTo(this);
		this.addClass('filter');
	});
	// live search
	$("#filter-search #q").keyup(function () {
		var s = $(this).val().toLowerCase().split(" ");
		if(s == '') resetFilter();
		else doFilter(s);
	});
	// cancel filter
	$("#filter-search .cancel").on("click", function ($e) {
		$e.preventDefault();
		resetFilter();
		showFilter();
	});
	
	initFilter();

	function initFilter(){
		var filterstate = getConfig('filtertoggle');
		if(typeof filterstate !== undefined){
			if(filterstate == true) showFilter(true);
			else hideFilter(true);
		}	
	}

	function showFilter(init){
		if(init) filterSearchInput.show();
		else{
			filterSearchInput.slideDown();
			filterSearchInput.find('#q').focus();			
			setConfig('filtertoggle',true);
		}
		$('#filtertable').addClass('current');
	}

	function hideFilter(init){
		filterSearchInput.slideUp();
		$('#filtertable').removeClass('current');		
		if(!init) setConfig('filtertoggle',false);		
	}

	function doFilter(text){
		$("table.filter tr:hidden").show();
		$.each(text, function () {
			if(this.substring(0,1) == '#') {
				// tag searching
				var s = this.substring(1);
				$("table.filter tr:visible .tagColumn:not(:contains('" + s + "'))").parent().hide();
			}	
			else $("table.filter tr:visible .indexColumn:not(:contains('" + this + "'))").parent().hide();
		});
	}

	function resetFilter(){
		$("table.filter tr").show();
		// $('#filtertable').removeClass('current');
		filterSearchInput.find('#q').val('');
	}
 

	///////////////////////////////////////////////////////////////////////////
	// Upload.php
	///////////////////////////////////////////////////////////////////////////

	//create new folder in upload.php
	$("#maincontent").on("click",'#createfolder', function ($e) {
		$e.preventDefault();
		$("#new-folder").find("form").show();
		$(this).hide();
		$("#new-folder").find('#foldername').focus();
	});
	$("#maincontent").on("click","#new-folder .cancel", function ($e) {
		$e.preventDefault();
		$("#new-folder").find("#foldername").val('');
		$("#new-folder").find("form").hide();
		$('#createfolder').show();
	});
 
	// upload.php ajax folder creation
	$('#new-folder form').submit(function () {
		loadingAjaxIndicator.show();
		var dataString = $(this).serialize();
		var newfolder = $('#foldername').val();
		var hrefaction = $(this).attr('action');
		$.ajax({
			type: "GET",
			data: dataString,
			url: hrefaction,
			success: function (response) {
				$('#imageTable').load(location.href + ' #imageTable >*', function () {
					attachFilterChangeEvent();
					$("#new-folder").find("#foldername").val('');
					$("#new-folder").find("form").hide();
					$('#createfolder').show();
					counter = parseInt($("#pg_counter").text(),10);
					$("#pg_counter").html(counter++);
					$("tr." + newfolder + " td").css("background-color", "#F9F8B6");
					loadingAjaxIndicator.fadeOut();
				});
			}
		});
		return false;
	});
 
	function scrollsidebar(){
		var elem = $('body.sbfixed #sidebar');

		if(!jQuery().scrollToFixed || !elem[0]){
			Debugger.log("sbfixed not enabled or scrolltofixed not loaded");
			return;
		}

		elem.scrollToFixed({ 
			marginTop: 15,
			limit: function(){ return $('#footer').offset().top - elem.outerHeight(true) - 15 ;} ,
			postUnfixed: function(){$(this).addClass('fixed') ;},
			postFixed: function(){$(this).removeClass('fixed') ;},
			postAbsolute: function(){$(this).removeClass('fixed') ;},

		});
	}

	// initialize fixed sidebar
	scrollsidebar();

	// CTRL+s save hotkey listener
	$(document).bind('keydown', function(e) {
		// Debugger.log('keydown: ' + e.which);
		var ctrlpress = navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;
		// detect CTRL+S do save on all pages
		if(ctrlpress && (e.which == 83)) {
			Debugger.log('Ctrl+S pressed');
			dosave();
			e.preventDefault();
			return false;
		}
	});

	// catch all ajax error, and redirects for session timeout on HTTP 401 unauthorized
	$( document ).ajaxError(function( event, xhr, settings ) {
		Debugger.log("ajaxComplete: " + xhr.status);
		Debugger.log(event);
		Debugger.log(xhr);
		Debugger.log(settings);
		if(xhr.status == 401){
			notifyInfo("Redirecting...");
			window.location.reload();
		}
		else if(xhr.status == 302){
			Debugger.log("Redirecting...");
			window.location = xhr.responseText;
		}
	});

	// custom ajax error handler
	function ajaxError($response){
		if(GS.debug === true){
            Debugger.log('An error occured in an XHR call, check console for response');
			Debugger.log($response);
		}
	}

	// add tree folding to tree tables
	// addTableTree(minrows,mindepth,headerdepth)
	$('table.tree').addTableTree(1,1,1);

	// end of jQuery ready
});

function isTouchDevice(){
		// detect touch devices, only mobiles, commented out feature spec
		var deviceAgent = navigator.userAgent.toLowerCase();
		var isTouchDevice = (
			// Modernizr.touch || 
			// ('ontouchstart' in document.documentElement) ||
			deviceAgent.match(/(iphone|ipod|ipad)/) ||
			deviceAgent.match(/(android)/)  || 
			deviceAgent.match(/(iemobile)/) || 
			deviceAgent.match(/iphone/i) || 
			deviceAgent.match(/ipad/i) || 
			deviceAgent.match(/ipod/i) || 
			deviceAgent.match(/blackberry/i) || 
			deviceAgent.match(/bada/i) || 
			false
		);

		return isTouchDevice;
}		

function dosave(){
	Debugger.log('saving');
	// Debugger.log($("#submit_line input.submit"));
	$("#submit_line input.submit").trigger('click'); // should do form.submit handlers as well
}

function supports_html5_storage() {
	// return Modernizr.localstorage;
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function setlocal(settings){
	if(!supports_html5_storage) return;	
	var key   = 'gslocalstorage';	
	
	if(settings == undefined){
		Debugger.log('setlocal empty');
		return;
	}
	settings['version'] = '1';
	jsonstr = JSON.stringify(settings);
	localStorage[key] = jsonstr;
	// Debugger.log('setlocal');
	// Debugger.log(localStorage[key]);
}

function getlocal(){
	var tmp = new Object();
	if(!supports_html5_storage) return;	
	
	var key   = 'gslocalstorage';
	var state = localStorage[key];

	// Debugger.log('getlocal');
	// Debugger.log(localStorage[key]);

	if(state == undefined) return tmp;
	state     = JSON.parse(state);
	return state;
}

function getConfig(key){
	var config = getlocal();
	return config[key];
}

function setConfig(key,value){
	// Debugger.log('setconfig ' + key + ' ' + value);
	var settings  = getlocal();
	settings[key] = value;
	setlocal(settings);
}

function clearConfig(){
	var key   = 'gslocalstorage';	
	localStorage.removeItem(key);	
}

// lazy loader for js and css
loadjscssfile = function(filename, filetype, callback){
	if (filetype=="js"){ //if filename is a external JavaScript file
		LazyLoad.js(filename,callback);
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		LazyLoad.css(filename,callback);
	}
};

// prevent js access to cookies
if(!document.__defineGetter__) {
    Object.defineProperty(document, 'cookie', {
        get: function(){return '' ;},
        set: function(){return true ;},
    });
} else {
    document.__defineGetter__("cookie", function() { return '';} );
    document.__defineSetter__("cookie", function() {} );
}
