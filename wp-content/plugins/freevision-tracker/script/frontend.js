var google_recaptcha;
var google_recaptcha_inline;
/**
* Tracking ID ajax search
*
* @tracking_id
*/
function ajax_tracking_search(tracking_id, g_recaptcha_code) {
	"use strict";
	jQuery('#freevision_tracker_loading_screen').show();
	jQuery.ajax({
		url: $OZY_WP_AJAX_URL,
		data: { action: 'freevision_tracking_ajax_search', 'tracking_id': encodeURIComponent(tracking_id), 'g_recaptcha_code': g_recaptcha_code},
		cache: false,
		success: function(data) {
			jQuery('#freevision_tracker_loading_screen').hide();
			if(data == '0') {
				alertify.log('Tracking ID seems no valid, please check and try again.');
			}else{
				window.location = data;
			}
		},
		error: function(MLHttpRequest, textStatus, errorThrown){  
			jQuery('#freevision_tracker_loading_screen').hide();
			alertify.log("MLHttpRequest: " + MLHttpRequest + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown); 
		}  
	});
}

function download_tracking_pdf(post_id) {
	"use strict";
	// No AJAX magic here
	window.open($OZY_WP_AJAX_URL + '?action=freevision_tracking_ajax_pdf_generator&post_id=' + post_id);
	return false;
}

function email_tracking_pdf(post_id) {
	"use strict";
	jQuery('#freevision_tracker_loading_screen').show();
	jQuery.ajax({
		url: $OZY_WP_AJAX_URL,
		data: { action: 'freevision_tracking_ajax_pdf_email', 'post_id': post_id},
		cache: false,
		success: function(data) {
			jQuery('#freevision_tracker_loading_screen').hide();
			alertify.log(data);						return false;
		},
		error: function(MLHttpRequest, textStatus, errorThrown){  
			jQuery('#freevision_tracker_loading_screen').hide();
			alertify.log("MLHttpRequest: " + MLHttpRequest + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown); 		}  
	});
}

jQuery(document).ready(function($) {
	$('.freevision-tracker-tableWrapper').respTables();
	
	$('.freevision_tracker_query_button,#freevision_tracker_id_field').attr('disabled', 'disabled');
	
	/*top form*/
	$('#freevision_tracker_form.freevision_tracker_form:not(.freevision-tracker-form-shortcode) #freevision_tracker_query_button').click(function(e) {
        e.preventDefault();
		
		if (grecaptcha.getResponse(google_recaptcha) == ""){
			alertify.log("Please verify captcha before processing.");
		} else {
			ajax_tracking_search($('#freevision_tracker_form.freevision_tracker_form:not(.freevision-tracker-form-shortcode) .freevision_tracker_id_field').val(), grecaptcha.getResponse(google_recaptcha));
		}
		
		return false;
    });
	
	/*inline form*/
	$('#freevision_tracker_form.freevision-tracker-form-shortcode .freevision_tracker_query_button').click(function(e) {
        e.preventDefault();
		
		if (grecaptcha.getResponse(google_recaptcha_inline) == ""){
			alertify.log("Please verify captcha before processing.");
		} else {
			ajax_tracking_search($('#freevision_tracker_form.freevision-tracker-form-shortcode .freevision_tracker_id_field').val(), grecaptcha.getResponse(google_recaptcha_inline));
		}
		
		return false;
    });	
	
	$('#freevision_tracker_pdf_download').unbind('click').on('click', function(e) {
		e.preventDefault();
		download_tracking_pdf($(this).data('trackingid'));		return false;
	});

	$('#freevision_tracker_pdf_email').unbind('click').on('click', function(e) {
		e.preventDefault();
		email_tracking_pdf($(this).data('trackingid'));				return false;
	});		

	$('#freevision_tracker_print').unbind('click').on('click', function(e) {
		e.preventDefault();
		var print_contents = $('.ozy_tracking.type-ozy_tracking').html();
		print_contents = $.strRemove("a,svg", print_contents);
		var window_object = window.open('', "PrintWindow", "width=1024,height=640,top=200,left=200,toolbars=no,scrollbars=no,status=no,resizable=no");
		window_object.document.writeln(print_contents);
		window_object.document.close();
		window_object.focus();
		window_object.print();
		window_object.close();
		return false;
	});
	
	/* Add loading screen overlay */
	$('body').append('<div id="freevision_tracker_loading_screen"><div><svg width=\'64px\' height=\'64px\' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-magnify"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g><circle fill="#acf7ff" cx="47" cy="47" r="20" opacity="0.5"></circle><path d="M77.5,69.3l-6.2-6.2c-0.7-0.7-1.3-1.2-1.9-1.6c2.6-4,4.1-8.8,4.1-14c0-14.4-11.7-26.1-26.1-26.1S21.3,33.2,21.3,47.5 S33,73.6,47.4,73.6c5.4,0,10.4-1.6,14.5-4.4c0.5,0.7,1.1,1.4,1.9,2.2l5.8,5.8c2.9,2.9,7.1,3.5,9.2,1.3C81,76.4,80.4,72.2,77.5,69.3z M47.4,66.2c-10.3,0-18.7-8.4-18.7-18.6s8.4-18.6,18.7-18.6s18.7,8.4,18.7,18.6S57.7,66.2,47.4,66.2z" fill="#ffffff"></path><animateTransform attributeName="transform" type="translate" from="15 15" to="15 15" dur="1s" repeatCount="indefinite" values="15 15;-15 15;0 -10.98;15 15" keyTimes="0;0.33;0.66;1"></animateTransform></g></svg></div></div>');
});

(function($) {
    $.strRemove = function(theTarget, theString) {
        return $("<div/>").append(
            $(theTarget, theString).remove().end()
        ).html();
    };
})(jQuery);

jQuery(window).load(function(){
	if(typeof grecaptcha === "object") {
		var captcha_key = jQuery('#google_recaptcha_html_element').data('sitekey');
		
		var googleRecaptchaOKCallBack = function(val) { 
			jQuery('#freevision_tracker_form .freevision_tracker_query_button, #freevision_tracker_form #freevision_tracker_id_field').prop('disabled', false).focus();
			setTimeout(function(){
				jQuery('#freevision_tracker_form .freevision_tracker_id_field').focus();
			}, 100);
		};
		var googleRecaptchaOKCallBackInline = function(val) { 
			jQuery('.freevision-tracker-form-shortcode .freevision_tracker_query_button, .freevision-tracker-form-shortcode #freevision_tracker_id_field').prop('disabled', false).focus();
			setTimeout(function(){
				jQuery('.freevision-tracker-form-shortcode .freevision_tracker_id_field').focus();
			}, 100);
		};
	
		if(jQuery('#google_recaptcha_html_element').length) {
			google_recaptcha = grecaptcha.render('google_recaptcha_html_element',{
				callback: googleRecaptchaOKCallBack, 
				sitekey: captcha_key
			});
		}

		if(jQuery('#google_recaptcha_html_element_inline').length) {
			google_recaptcha_inline = grecaptcha.render('google_recaptcha_html_element_inline',{
				callback: googleRecaptchaOKCallBackInline, 
				sitekey: captcha_key
			});
		}
	}
	
	/**
	* alertify.js
	* https://alertifyjs.org
	*/
	!function(){"use strict";function t(){var t={parent:document.body,version:"1.0.11",defaultOkLabel:"Ok",okLabel:"Ok",defaultCancelLabel:"Cancel",cancelLabel:"Cancel",defaultMaxLogItems:2,maxLogItems:2,promptValue:"",promptPlaceholder:"",closeLogOnClick:!1,closeLogOnClickDefault:!1,delay:5e3,defaultDelay:5e3,logContainerClass:"alertify-logs",logContainerDefaultClass:"alertify-logs",dialogs:{buttons:{holder:"<nav>{{buttons}}</nav>",ok:"<button class='ok' tabindex='1'>{{ok}}</button>",cancel:"<button class='cancel' tabindex='2'>{{cancel}}</button>"},input:"<input type='text'>",message:"<p class='msg'>{{message}}</p>",log:"<div class='{{class}}'>{{message}}</div>"},defaultDialogs:{buttons:{holder:"<nav>{{buttons}}</nav>",ok:"<button class='ok' tabindex='1'>{{ok}}</button>",cancel:"<button class='cancel' tabindex='2'>{{cancel}}</button>"},input:"<input type='text'>",message:"<p class='msg'>{{message}}</p>",log:"<div class='{{class}}'>{{message}}</div>"},build:function(t){var e=this.dialogs.buttons.ok,o="<div class='dialog'><div>"+this.dialogs.message.replace("{{message}}",t.message);return"confirm"!==t.type&&"prompt"!==t.type||(e=this.dialogs.buttons.cancel+this.dialogs.buttons.ok),"prompt"===t.type&&(o+=this.dialogs.input),o=(o+this.dialogs.buttons.holder+"</div></div>").replace("{{buttons}}",e).replace("{{ok}}",this.okLabel).replace("{{cancel}}",this.cancelLabel)},setCloseLogOnClick:function(t){this.closeLogOnClick=!!t},close:function(t,e){this.closeLogOnClick&&t.addEventListener("click",function(){o(t)}),e=e&&!isNaN(+e)?+e:this.delay,0>e?o(t):e>0&&setTimeout(function(){o(t)},e)},dialog:function(t,e,o,n){return this.setup({type:e,message:t,onOkay:o,onCancel:n})},log:function(t,e,o){var n=document.querySelectorAll(".alertify-logs > div");if(n){var i=n.length-this.maxLogItems;if(i>=0)for(var a=0,l=i+1;l>a;a++)this.close(n[a],-1)}this.notify(t,e,o)},setLogPosition:function(t){this.logContainerClass="alertify-logs "+t},setupLogContainer:function(){var t=document.querySelector(".alertify-logs"),e=this.logContainerClass;return t||(t=document.createElement("div"),t.className=e,this.parent.appendChild(t)),t.className!==e&&(t.className=e),t},notify:function(e,o,n){var i=this.setupLogContainer(),a=document.createElement("div");a.className=o||"default",t.logTemplateMethod?a.innerHTML=t.logTemplateMethod(e):a.innerHTML=e,"function"==typeof n&&a.addEventListener("click",n),i.appendChild(a),setTimeout(function(){a.className+=" show content-font-family"},10),this.close(a,this.delay)},setup:function(t){function e(e){"function"!=typeof e&&(e=function(){}),i&&i.addEventListener("click",function(i){t.onOkay&&"function"==typeof t.onOkay&&(l?t.onOkay(l.value,i):t.onOkay(i)),e(l?{buttonClicked:"ok",inputValue:l.value,event:i}:{buttonClicked:"ok",event:i}),o(n)}),a&&a.addEventListener("click",function(i){t.onCancel&&"function"==typeof t.onCancel&&t.onCancel(i),e({buttonClicked:"cancel",event:i}),o(n)}),l&&l.addEventListener("keyup",function(t){13===t.which&&i.click()})}var n=document.createElement("div");n.className="alertify hide",n.innerHTML=this.build(t);var i=n.querySelector(".ok"),a=n.querySelector(".cancel"),l=n.querySelector("input"),s=n.querySelector("label");l&&("string"==typeof this.promptPlaceholder&&(s?s.textContent=this.promptPlaceholder:l.placeholder=this.promptPlaceholder),"string"==typeof this.promptValue&&(l.value=this.promptValue));var r;return"function"==typeof Promise?r=new Promise(e):e(),this.parent.appendChild(n),setTimeout(function(){n.classList.remove("hide"),l&&t.type&&"prompt"===t.type?(l.select(),l.focus()):i&&i.focus()},100),r},okBtn:function(t){return this.okLabel=t,this},setDelay:function(t){return t=t||0,this.delay=isNaN(t)?this.defaultDelay:parseInt(t,10),this},cancelBtn:function(t){return this.cancelLabel=t,this},setMaxLogItems:function(t){this.maxLogItems=parseInt(t||this.defaultMaxLogItems)},theme:function(t){switch(t.toLowerCase()){case"bootstrap":this.dialogs.buttons.ok="<button class='ok btn btn-primary' tabindex='1'>{{ok}}</button>",this.dialogs.buttons.cancel="<button class='cancel btn btn-default' tabindex='2'>{{cancel}}</button>",this.dialogs.input="<input type='text' class='form-control'>";break;case"purecss":this.dialogs.buttons.ok="<button class='ok pure-button' tabindex='1'>{{ok}}</button>",this.dialogs.buttons.cancel="<button class='cancel pure-button' tabindex='2'>{{cancel}}</button>";break;case"mdl":case"material-design-light":this.dialogs.buttons.ok="<button class='ok mdl-button mdl-js-button mdl-js-ripple-effect'  tabindex='1'>{{ok}}</button>",this.dialogs.buttons.cancel="<button class='cancel mdl-button mdl-js-button mdl-js-ripple-effect' tabindex='2'>{{cancel}}</button>",this.dialogs.input="<div class='mdl-textfield mdl-js-textfield'><input class='mdl-textfield__input'><label class='md-textfield__label'></label></div>";break;case"angular-material":this.dialogs.buttons.ok="<button class='ok md-primary md-button' tabindex='1'>{{ok}}</button>",this.dialogs.buttons.cancel="<button class='cancel md-button' tabindex='2'>{{cancel}}</button>",this.dialogs.input="<div layout='column'><md-input-container md-no-float><input type='text'></md-input-container></div>";break;case"default":default:this.dialogs.buttons.ok=this.defaultDialogs.buttons.ok,this.dialogs.buttons.cancel=this.defaultDialogs.buttons.cancel,this.dialogs.input=this.defaultDialogs.input}},reset:function(){this.parent=document.body,this.theme("default"),this.okBtn(this.defaultOkLabel),this.cancelBtn(this.defaultCancelLabel),this.setMaxLogItems(),this.promptValue="",this.promptPlaceholder="",this.delay=this.defaultDelay,this.setCloseLogOnClick(this.closeLogOnClickDefault),this.setLogPosition("bottom left"),this.logTemplateMethod=null},injectCSS:function(){if(!document.querySelector("#alertifyCSS")){var t=document.getElementsByTagName("head")[0],e=document.createElement("style");e.type="text/css",e.id="alertifyCSS",e.innerHTML="",t.insertBefore(e,t.firstChild)}},removeCSS:function(){var t=document.querySelector("#alertifyCSS");t&&t.parentNode&&t.parentNode.removeChild(t)}};return t.injectCSS(),{_$$alertify:t,parent:function(e){t.parent=e},reset:function(){return t.reset(),this},alert:function(e,o,n){return t.dialog(e,"alert",o,n)||this},confirm:function(e,o,n){return t.dialog(e,"confirm",o,n)||this},prompt:function(e,o,n){return t.dialog(e,"prompt",o,n)||this},log:function(e,o){return t.log(e,"default",o),this},theme:function(e){return t.theme(e),this},success:function(e,o){return t.log(e,"success",o),this},error:function(e,o){return t.log(e,"error",o),this},cancelBtn:function(e){return t.cancelBtn(e),this},okBtn:function(e){return t.okBtn(e),this},delay:function(e){return t.setDelay(e),this},placeholder:function(e){return t.promptPlaceholder=e,this},defaultValue:function(e){return t.promptValue=e,this},maxLogItems:function(e){return t.setMaxLogItems(e),this},closeLogOnClick:function(e){return t.setCloseLogOnClick(!!e),this},logPosition:function(e){return t.setLogPosition(e||""),this},setLogTemplate:function(e){return t.logTemplateMethod=e,this},clearLogs:function(){return t.setupLogContainer().innerHTML="",this},version:t.version}}var e=500,o=function(t){if(t){var o=function(){t&&t.parentNode&&t.parentNode.removeChild(t)};t.classList.remove("show"),t.classList.add("hide"),t.addEventListener("transitionend",o),setTimeout(o,e)}};if("undefined"!=typeof module&&module&&module.exports){module.exports=function(){return new t};var n=new t;for(var i in n)module.exports[i]=n[i]}else"function"==typeof define&&define.amd?define(function(){return new t}):window.alertify=new t}();
	
	alertify.logPosition("top left");
});

/*respTables responsive table*/
(function($){
  $.fn.respTables = function(options) {
    var settings = $.extend({
        // These are the defaults.
        heading: 'th'
    }, options );

    // making the plugin chainable
    return this.each(function() {
      	var t = [];
	$(this).find(settings.heading).each(function() {
	  	// push every header into the array as text by first removing its children
		t.push($(this).clone().children().remove().end().text().trim());
		});
	$(this).find("tr").each(function() {
	  	// put every header into td's before pseudoelement
		for (var r = $(this), i = 0; i < t.length; i++) {
			r.find("td").eq(i).attr("data-before", t[i]);
		}
	});
    });
  }
}(jQuery));
