// voter-info-egypt.js
// By Michael Geary - http://mg.to/
// See UNLICENSE or http://unlicense.org/ for public domain notice.

// Language and prefs
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function functionTabs() {
        
        /* if (document.location.href.indexOf('cid=yes') > 0) {
                $("#elec-info").remove();  
        $('.wrapper').append('<div class="map-demo"><img src="http://alimaher-egyptian-elections.googlecode.com/hg/voter-info/images/graphics/map-demo.png" width="300" height="230" /> </div>');
                $("#nid_tab").attr('class' , "" );
                $("#cid_tab").attr('class' , "selected" );
        $("#pid").hide(); 
        cid_input = $("input[type='text']/").attr('id' , "cid" ).attr('class' , 'example').attr('onfocus' , 'Poll411.focus()').attr('onblur' , 'Poll411.blur()');
        $("#nid").replaceWith(cid_input);
        $("#pid_label").hide(); 
        $("#nid_label").html("اسم الدائرة"); 
        
    }*/
        
}

function submitNID(){
	if ((document.location.href.indexOf('nid=') > 0) 
	&& (document.location.href.indexOf('gid=') > 0) 
	&& (document.location.href.indexOf('pid=') > 0)) 
	{
       $("#nid").val(decodeURI((RegExp('nid=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
       $("#pid").val(decodeURI((RegExp('pid=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
       $("#gid").val(decodeURI((RegExp('gid=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
       while(typeof(Poll411) == undefined){
       	
			sleep(500);
		} 
       return Poll411.submit();    
    }
}

function submitCID(){
	if ((document.location.href.indexOf('cid=') > 0)) 
	{
	   //alert("cid");
       $("#nid").val(decodeURI((RegExp('cid=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]));
       while(typeof(Poll411) == undefined){
			sleep(500);
		} 
       return Poll411.submit();    
    }
}

function functionColoring() {
        $("input#nid").focus(function () {
         $('.id-demo > .id-num').fadeIn(500);
    });
    $("input#nid").blur(function () {
         $('.id-demo > .id-num').fadeOut(500);
    });
    
    $("select#gid").focus(function () {
         $('.id-demo > .gov').fadeIn(500);
    });
    $("select#gid").blur(function () {
         $('.id-demo > .gov').fadeOut(500);
    });
    
    $("select#pid").focus(function () {
         $('.id-demo > .station').fadeIn(500);
    });
    $("select#pid").blur(function () {
         $('.id-demo > .station').fadeOut(500);
    });
}

function foorBar() {
	//alert("inside foor bar");
	$('#Poll411Form').submit(function() {
		while(Poll411 == undefined){
			sleep(500);
		} 
		Poll411.submit();
		return false;
	});
}

function functionValidaing(){
	
       $("#Poll411Form").validate({
       	
                rules: {
                        nid: { 
                                required: true,
                                digits: true,
                                rangelength: [14, 14],
                validAge: true
                        },
                        gid: "required",
                        pid: "required"
                },
                messages: {
                        nid: {
                                required: "من فضلك ادخل الرقم القومى",
                                digits: "من فضلك ادخل ارقام فقط",
                                rangelength: "من فضلك أدخل الأربعة عشر رقم",
                validAge: "عفوا, غير مسموح لإقل من 18 سنة بالإنتخاب"
                        },
                        gid:"من فضلك اختر المحافظة",
                        pid:"من فضلك اختر القسم"
                }
                });
}

$(window).load(function() {
        
   setTimeout("$('#pid').chained('#gid'); ",1000);
   setTimeout("functionTabs(); ",1000);
   setTimeout("submitNID(); ",1000);
   //$('#pid').chained('#gid');
   submitNID();
   submitCID();
   setTimeout("functionColoring(); ",1000);
   setTimeout("functionValidaing(); ",1000);
   //setTimeout("fooBar(); ",1000);
    
});
        
$(document).ready(function(){
        


/**
 * jQuery Validation Plugin 1.8.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2011 J�rn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function(c){c.extend(c.fn,{validate:function(a){if(this.length){var b=c.data(this[0],"validator");if(b)return b;b=new c.validator(a,this[0]);c.data(this[0],"validator",b);if(b.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){b.cancelSubmit=true});b.settings.submitHandler&&this.find("input, button").filter(":submit").click(function(){b.submitButton=this});this.submit(function(d){function e(){if(b.settings.submitHandler){if(b.submitButton)var f=c("<input type='hidden'/>").attr("name",
b.submitButton.name).val(b.submitButton.value).appendTo(b.currentForm);b.settings.submitHandler.call(b,b.currentForm);b.submitButton&&f.remove();return false}return true}b.settings.debug&&d.preventDefault();if(b.cancelSubmit){b.cancelSubmit=false;return e()}if(b.form()){if(b.pendingRequest){b.formSubmitted=true;return false}return e()}else{b.focusInvalid();return false}})}return b}else a&&a.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing")},valid:function(){if(c(this[0]).is("form"))return this.validate().form();
else{var a=true,b=c(this[0].form).validate();this.each(function(){a&=b.element(this)});return a}},removeAttrs:function(a){var b={},d=this;c.each(a.split(/\s/),function(e,f){b[f]=d.attr(f);d.removeAttr(f)});return b},rules:function(a,b){var d=this[0];if(a){var e=c.data(d.form,"validator").settings,f=e.rules,g=c.validator.staticRules(d);switch(a){case "add":c.extend(g,c.validator.normalizeRule(b));f[d.name]=g;if(b.messages)e.messages[d.name]=c.extend(e.messages[d.name],b.messages);break;case "remove":if(!b){delete f[d.name];
return g}var h={};c.each(b.split(/\s/),function(j,i){h[i]=g[i];delete g[i]});return h}}d=c.validator.normalizeRules(c.extend({},c.validator.metadataRules(d),c.validator.classRules(d),c.validator.attributeRules(d),c.validator.staticRules(d)),d);if(d.required){e=d.required;delete d.required;d=c.extend({required:e},d)}return d}});c.extend(c.expr[":"],{blank:function(a){return!c.trim(""+a.value)},filled:function(a){return!!c.trim(""+a.value)},unchecked:function(a){return!a.checked}});c.validator=function(a,
b){this.settings=c.extend(true,{},c.validator.defaults,a);this.currentForm=b;this.init()};c.validator.format=function(a,b){if(arguments.length==1)return function(){var d=c.makeArray(arguments);d.unshift(a);return c.validator.format.apply(this,d)};if(arguments.length>2&&b.constructor!=Array)b=c.makeArray(arguments).slice(1);if(b.constructor!=Array)b=[b];c.each(b,function(d,e){a=a.replace(RegExp("\\{"+d+"\\}","g"),e)});return a};c.extend(c.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",
validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:c([]),errorLabelContainer:c([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(a){this.lastActive=a;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass);this.addWrapper(this.errorsFor(a)).hide()}},onfocusout:function(a){if(!this.checkable(a)&&(a.name in this.submitted||!this.optional(a)))this.element(a)},
onkeyup:function(a){if(a.name in this.submitted||a==this.lastElement)this.element(a)},onclick:function(a){if(a.name in this.submitted)this.element(a);else a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).addClass(b).removeClass(d):c(a).addClass(b).removeClass(d)},unhighlight:function(a,b,d){a.type==="radio"?this.findByName(a.name).removeClass(b).addClass(d):c(a).removeClass(b).addClass(d)}},setDefaults:function(a){c.extend(c.validator.defaults,
a)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:c.validator.format("Please enter no more than {0} characters."),
minlength:c.validator.format("Please enter at least {0} characters."),rangelength:c.validator.format("Please enter a value between {0} and {1} characters long."),range:c.validator.format("Please enter a value between {0} and {1}."),max:c.validator.format("Please enter a value less than or equal to {0}."),min:c.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){function a(e){var f=c.data(this[0].form,"validator");e="on"+e.type.replace(/^validate/,
"");f.settings[e]&&f.settings[e].call(f,this[0])}this.labelContainer=c(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||c(this.currentForm);this.containers=c(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var b=this.groups={};c.each(this.settings.groups,function(e,f){c.each(f.split(/\s/),function(g,h){b[h]=e})});var d=this.settings.rules;
c.each(d,function(e,f){d[e]=c.validator.normalizeRule(f)});c(this.currentForm).validateDelegate(":text, :password, :file, select, textarea","focusin focusout keyup",a).validateDelegate(":radio, :checkbox, select, option","click",a);this.settings.invalidHandler&&c(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){this.checkForm();c.extend(this.submitted,this.errorMap);this.invalid=c.extend({},this.errorMap);this.valid()||c(this.currentForm).triggerHandler("invalid-form",
[this]);this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(a){this.lastElement=a=this.clean(a);this.prepareElement(a);this.currentElements=c(a);var b=this.check(a);if(b)delete this.invalid[a.name];else this.invalid[a.name]=true;if(!this.numberOfInvalids())this.toHide=this.toHide.add(this.containers);this.showErrors();return b},showErrors:function(a){if(a){c.extend(this.errorMap,
a);this.errorList=[];for(var b in a)this.errorList.push({message:a[b],element:this.findByName(b)[0]});this.successList=c.grep(this.successList,function(d){return!(d.name in a)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){c.fn.resetForm&&c(this.currentForm).resetForm();this.submitted={};this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},
objectLength:function(a){var b=0,d;for(d in a)b++;return b},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{c(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(a){}},findLastActive:function(){var a=this.lastActive;return a&&c.grep(this.errorList,function(b){return b.element.name==
a.name}).length==1&&a},elements:function(){var a=this,b={};return c(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&a.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in b||!a.objectLength(c(this).rules()))return false;return b[this.name]=true})},clean:function(a){return c(a)[0]},errors:function(){return c(this.settings.errorElement+"."+this.settings.errorClass,
this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=c([]);this.toHide=c([]);this.currentElements=c([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset();this.toHide=this.errorsFor(a)},check:function(a){a=this.clean(a);if(this.checkable(a))a=this.findByName(a.name).not(this.settings.ignore)[0];var b=c(a).rules(),d=false,e;for(e in b){var f={method:e,parameters:b[e]};try{var g=
c.validator.methods[e].call(this,a.value.replace(/\r/g,""),a,f.parameters);if(g=="dependency-mismatch")d=true;else{d=false;if(g=="pending"){this.toHide=this.toHide.not(this.errorsFor(a));return}if(!g){this.formatAndAdd(a,f);return false}}}catch(h){this.settings.debug&&window.console&&console.log("exception occured when checking element "+a.id+", check the '"+f.method+"' method",h);throw h;}}if(!d){this.objectLength(b)&&this.successList.push(a);return true}},customMetaMessage:function(a,b){if(c.metadata){var d=
this.settings.meta?c(a).metadata()[this.settings.meta]:c(a).metadata();return d&&d.messages&&d.messages[b]}},customMessage:function(a,b){var d=this.settings.messages[a];return d&&(d.constructor==String?d:d[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(arguments[a]!==undefined)return arguments[a]},defaultMessage:function(a,b){return this.findDefined(this.customMessage(a.name,b),this.customMetaMessage(a,b),!this.settings.ignoreTitle&&a.title||undefined,c.validator.messages[b],"<strong>Warning: No message defined for "+
a.name+"</strong>")},formatAndAdd:function(a,b){var d=this.defaultMessage(a,b.method),e=/\$?\{(\d+)\}/g;if(typeof d=="function")d=d.call(this,b.parameters,a);else if(e.test(d))d=jQuery.format(d.replace(e,"{$1}"),b.parameters);this.errorList.push({message:d,element:a});this.errorMap[a.name]=d;this.submitted[a.name]=d},addWrapper:function(a){if(this.settings.wrapper)a=a.add(a.parent(this.settings.wrapper));return a},defaultShowErrors:function(){for(var a=0;this.errorList[a];a++){var b=this.errorList[a];
this.settings.highlight&&this.settings.highlight.call(this,b.element,this.settings.errorClass,this.settings.validClass);this.showLabel(b.element,b.message)}if(this.errorList.length)this.toShow=this.toShow.add(this.containers);if(this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight){a=0;for(b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass)}this.toHide=this.toHide.not(this.toShow);
this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return c(this.errorList).map(function(){return this.element})},showLabel:function(a,b){var d=this.errorsFor(a);if(d.length){d.removeClass().addClass(this.settings.errorClass);d.attr("generated")&&d.html(b)}else{d=c("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(a),generated:true}).addClass(this.settings.errorClass).html(b||
"");if(this.settings.wrapper)d=d.hide().show().wrap("<"+this.settings.wrapper+"/>").parent();this.labelContainer.append(d).length||(this.settings.errorPlacement?this.settings.errorPlacement(d,c(a)):d.insertAfter(a))}if(!b&&this.settings.success){d.text("");typeof this.settings.success=="string"?d.addClass(this.settings.success):this.settings.success(d)}this.toShow=this.toShow.add(d)},errorsFor:function(a){var b=this.idOrName(a);return this.errors().filter(function(){return c(this).attr("for")==b})},
idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(a){var b=this.currentForm;return c(document.getElementsByName(a)).map(function(d,e){return e.form==b&&e.name==a&&e||null})},getLength:function(a,b){switch(b.nodeName.toLowerCase()){case "select":return c("option:selected",b).length;case "input":if(this.checkable(b))return this.findByName(b.name).filter(":checked").length}return a.length},
depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):true},dependTypes:{"boolean":function(a){return a},string:function(a,b){return!!c(a,b.form).length},"function":function(a,b){return a(b)}},optional:function(a){return!c.validator.methods.required.call(this,c.trim(a.value),a)&&"dependency-mismatch"},startRequest:function(a){if(!this.pending[a.name]){this.pendingRequest++;this.pending[a.name]=true}},stopRequest:function(a,b){this.pendingRequest--;if(this.pendingRequest<
0)this.pendingRequest=0;delete this.pending[a.name];if(b&&this.pendingRequest==0&&this.formSubmitted&&this.form()){c(this.currentForm).submit();this.formSubmitted=false}else if(!b&&this.pendingRequest==0&&this.formSubmitted){c(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}},previousValue:function(a){return c.data(a,"previousValue")||c.data(a,"previousValue",{old:null,valid:true,message:this.defaultMessage(a,"remote")})}},classRuleSettings:{required:{required:true},
email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(a,b){a.constructor==String?this.classRuleSettings[a]=b:c.extend(this.classRuleSettings,a)},classRules:function(a){var b={};(a=c(a).attr("class"))&&c.each(a.split(" "),function(){this in c.validator.classRuleSettings&&c.extend(b,c.validator.classRuleSettings[this])});return b},attributeRules:function(a){var b=
{};a=c(a);for(var d in c.validator.methods){var e=a.attr(d);if(e)b[d]=e}b.maxlength&&/-1|2147483647|524288/.test(b.maxlength)&&delete b.maxlength;return b},metadataRules:function(a){if(!c.metadata)return{};var b=c.data(a.form,"validator").settings.meta;return b?c(a).metadata()[b]:c(a).metadata()},staticRules:function(a){var b={},d=c.data(a.form,"validator");if(d.settings.rules)b=c.validator.normalizeRule(d.settings.rules[a.name])||{};return b},normalizeRules:function(a,b){c.each(a,function(d,e){if(e===
false)delete a[d];else if(e.param||e.depends){var f=true;switch(typeof e.depends){case "string":f=!!c(e.depends,b.form).length;break;case "function":f=e.depends.call(b,b)}if(f)a[d]=e.param!==undefined?e.param:true;else delete a[d]}});c.each(a,function(d,e){a[d]=c.isFunction(e)?e(b):e});c.each(["minlength","maxlength","min","max"],function(){if(a[this])a[this]=Number(a[this])});c.each(["rangelength","range"],function(){if(a[this])a[this]=[Number(a[this][0]),Number(a[this][1])]});if(c.validator.autoCreateRanges){if(a.min&&
a.max){a.range=[a.min,a.max];delete a.min;delete a.max}if(a.minlength&&a.maxlength){a.rangelength=[a.minlength,a.maxlength];delete a.minlength;delete a.maxlength}}a.messages&&delete a.messages;return a},normalizeRule:function(a){if(typeof a=="string"){var b={};c.each(a.split(/\s/),function(){b[this]=true});a=b}return a},addMethod:function(a,b,d){c.validator.methods[a]=b;c.validator.messages[a]=d!=undefined?d:c.validator.messages[a];b.length<3&&c.validator.addClassRules(a,c.validator.normalizeRule(a))},
methods:{required:function(a,b,d){if(!this.depend(d,b))return"dependency-mismatch";switch(b.nodeName.toLowerCase()){case "select":return(a=c(b).val())&&a.length>0;case "input":if(this.checkable(b))return this.getLength(a,b)>0;default:return c.trim(a).length>0}},remote:function(a,b,d){if(this.optional(b))return"dependency-mismatch";var e=this.previousValue(b);this.settings.messages[b.name]||(this.settings.messages[b.name]={});e.originalMessage=this.settings.messages[b.name].remote;this.settings.messages[b.name].remote=
e.message;d=typeof d=="string"&&{url:d}||d;if(this.pending[b.name])return"pending";if(e.old===a)return e.valid;e.old=a;var f=this;this.startRequest(b);var g={};g[b.name]=a;c.ajax(c.extend(true,{url:d,mode:"abort",port:"validate"+b.name,dataType:"json",data:g,success:function(h){f.settings.messages[b.name].remote=e.originalMessage;var j=h===true;if(j){var i=f.formSubmitted;f.prepareElement(b);f.formSubmitted=i;f.successList.push(b);f.showErrors()}else{i={};h=h||f.defaultMessage(b,"remote");i[b.name]=
e.message=c.isFunction(h)?h(a):h;f.showErrors(i)}e.valid=j;f.stopRequest(b,j)}},d));return"pending"},minlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)>=d},maxlength:function(a,b,d){return this.optional(b)||this.getLength(c.trim(a),b)<=d},rangelength:function(a,b,d){a=this.getLength(c.trim(a),b);return this.optional(b)||a>=d[0]&&a<=d[1]},min:function(a,b,d){return this.optional(b)||a>=d},max:function(a,b,d){return this.optional(b)||a<=d},range:function(a,b,d){return this.optional(b)||
a>=d[0]&&a<=d[1]},email:function(a,b){return this.optional(b)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(a)},
url:function(a,b){return this.optional(b)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)},
date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a))},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)},number:function(a,b){return this.optional(b)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},creditcard:function(a,b){if(this.optional(b))return"dependency-mismatch";if(/[^0-9-]+/.test(a))return false;var d=0,e=0,f=false;a=a.replace(/\D/g,"");for(var g=a.length-1;g>=
0;g--){e=a.charAt(g);e=parseInt(e,10);if(f)if((e*=2)>9)e-=9;d+=e;f=!f}return d%10==0},accept:function(a,b,d){d=typeof d=="string"?d.replace(/,/g,"|"):"png|jpe?g|gif";return this.optional(b)||a.match(RegExp(".("+d+")$","i"))},equalTo:function(a,b,d){d=c(d).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){c(b).valid()});return a==d.val()}}});c.format=c.validator.format})(jQuery);
(function(c){var a={};if(c.ajaxPrefilter)c.ajaxPrefilter(function(d,e,f){e=d.port;if(d.mode=="abort"){a[e]&&a[e].abort();a[e]=f}});else{var b=c.ajax;c.ajax=function(d){var e=("port"in d?d:c.ajaxSettings).port;if(("mode"in d?d:c.ajaxSettings).mode=="abort"){a[e]&&a[e].abort();return a[e]=b.apply(this,arguments)}return b.apply(this,arguments)}}})(jQuery);
(function(c){!jQuery.event.special.focusin&&!jQuery.event.special.focusout&&document.addEventListener&&c.each({focus:"focusin",blur:"focusout"},function(a,b){function d(e){e=c.event.fix(e);e.type=b;return c.event.handle.call(this,e)}c.event.special[b]={setup:function(){this.addEventListener(a,d,true)},teardown:function(){this.removeEventListener(a,d,true)},handler:function(e){arguments[0]=c.event.fix(e);arguments[0].type=b;return c.event.handle.apply(this,arguments)}}});c.extend(c.fn,{validateDelegate:function(a,
b,d){return this.bind(b,function(e){var f=c(e.target);if(f.is(a))return d.apply(f,arguments)})}})})($);




/*
 * Custom validation method by Barary @ eSpace
 */
$.validator.addMethod("validAge", function (value, element) {

   validAgeBool = true;

   if (value.charAt(1) == '9') // 90s
   {

       if (value.charAt(2) > '3') // 93
       {
           validAgeBool = false;
       } else if (value.charAt(2) == '3') // 93
       {

           if (value.charAt(3) > '0' || value.charAt(4) > '7') // after July false
           {
               validAgeBool = false;
           } else if (value.charAt(4) == '7') // born in July
           {

               // day less than or equal 20
               if (value.charAt(5) < '2' || (value.charAt(5) == '2' && value.charAt(6) == '0')) {validAgeBool = true;}

               else {validAgeBool = false;}

           } else {
               validAgeBool = true;
           } // before July
       } else {
           validAgeBool = true;
       } // before 93
   } else {
       validAgeBool = true;
   }; //born before 90s
   return this.optional(element) || validAgeBool;
},$.validator.format("عفوا, غير مسموح لإقل من 18 سنة بالإنتخاب")); 


/*
* Chained - jQuery non AJAX(J) chained selects plugin
*
* Copyright (c) 2010 Mika Tuupola
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
*/

(function($) {

    $.fn.chained = function(parent_selector, options) {
        
        return this.each(function() {
            
            /* Save this to self because this changes when scope changes. */
            var self = this;
            var backup = $(self).clone();
                        
            /* Handles maximum two parents now. */
            $(parent_selector).each(function() {
                                                
                $(this).bind("change", function() {
                    $(self).html(backup.html());

                    /* If multiple parents build classname like foo\bar. */
                    var selected = "";
                    $(parent_selector).each(function() {
                        selected += "\\" + $(":selected", this).val();
                    });
                    selected = selected.substr(1);

                    /* Also check for first parent without subclassing. */
                    /* TODO: This should be dynamic and check for each parent */
                    /* without subclassing. */
                    var first = $(parent_selector).first();
                    var selected_first = $(":selected", first).val();
                
                    $("option", self).each(function() {
                        /* Remove unneeded items but save the default value. */
                        if (!$(this).hasClass(selected) &&
                            !$(this).hasClass(selected_first) && $(this).val() !== "") {
                                $(this).remove();
                        }
                    });
                
                    /* If we have only the default value disable select. */
                    if (1 == $("option", self).size() && $(self).val() === "") {
                        $(self).attr("disabled", "disabled");
                    } else {
                        $(self).removeAttr("disabled");
                    }
                    $(self).trigger("change");
                });
                
                /* Force IE to see something selected on first page load, */
                /* Unless something is already selected */
                if ( !$("option:selected", this).length ) {
                    $("option", this).first().attr("selected", "selected");
                }

                /* Force updating the children. */
                $(this).trigger("change");

            });
        });
    };
    
    /* Alias for those who like to use more English like syntax. */
    $.fn.chainedTo = $.fn.chained;
    
})(jQuery);


        //$(function() {      
                //setTimeout("$('#pid').chained('#gid')",20);   
//      });



        
        





});

//Michael code
var defaultLanguage = 'ar';
var supportedLanguages = {
        ar: 'عربي',
        en: 'English',
        fr: 'Français',
        _: null
};

var prefs = new _IG_Prefs();
var pref = {
        lang: prefs.getString( '.lang' )
};

if( ! supportedLanguages[pref.lang] )
        pref.lang = defaultLanguage;

function localPrefs( pref ) {
}

var initialBbox = [ 22.6066970, 21.61291460, 38.9982990, 31.79954240 ];

//var initialBbox = [ 22.6066970, 21.61291460, 38.9982990, 31.79954240 ];

// Output formatters

function attribution() {
        return T( 'attribution' );
}

function locationWarning() {
        return vote.locations && vote.locations.length ?
                T('locationWarning') :
                '';
}

function electionInfo() {
        var elections = [];
        return S(
                generalInfo(),
                elections.join(''),
                infoLinks(),
                attribution()
        );
}

function generalInfo() {
        return S(
                '<div style="margin-bottom:0.5em;">',
                '</div>'
        );
}

function perElectionInfo( state, electionDay, electionName ) {
        
        var cands = candidates();
        return cands ? S(
                '<div style="margin-bottom:0.5em;">',
                        '<div class="heading" style="margin:0.75em 0;">',
                                formatDate(electionDay), ' ', electionName,
                        '</div>',
                        cands,
                '</div>'
        ) : '';
        
        function candidates() {
                var contests = getContests();
                if( ! contests ) return '';
                contests = sortArrayBy( contests, 'ballot_placement', { numeric:true } );
                var randomize = contests[0].ballot.candidate[0].order_on_ballot == null;
                var randomizedMessage = ! randomize ? '' : S(
                        '<div style="font-size:85%; font-style:italic; margin-top:0.5em">',
                                T('candidateRandomOrder'),
                        '</div>'
                );
                return S(
                        '<div>',
                                randomizedMessage,
                                contests.mapjoin( function( contest ) {
                                        var candidates = contest.ballot.candidate;
                                        candidates = randomize ?
                                                candidates.randomized() :
                                                sortArrayBy( candidates, 'order_on_ballot', { numeric:true } );
                                                
                                        return S(
                                                '<div class="heading" style="xfont-size:110%; margin-top:0.5em">',
                                                        contest.office,
                                                '</div>',
                                                candidates.mapjoin( function( candidate ) {
                                                        function party() {
                                                                return candidate.party ? S(
                                                                        '<span style="color:#444; font-size:85%;">',
                                                                                ' - ',
                                                                                candidate.party,
                                                                        '</span>'
                                                                ) : '';
                                                        }
                                                        return S(
                                                                '<div>',
                                                                        linkIf( candidate.name, candidate.candidate_url ),
                                                                        party(),
                                                                '</div>'
                                                        );
                                                })
                                        );
                                }),
                        '</div>'
                );
        }
}

function gotoConstit(code){
        setMap(vote.info,['c'+code],13);
        if(vote.info.latlng ){
                map.setCenter( vote.info.latlng );
        }else{
                map.setCenter(new gm.LatLng(  30.01,31.14)); 
        }
        return selectTab('#mapbox');
}

function setVoteHtml() {
        if( !( vote.info || vote.locations ) ) {
                $details.append( log.print() );
                return;
        }
        
        function voteLocation( infowindow ) {
                var loc = T('yourVotingLocation');
                if( !( vote.locations && vote.locations.length ) )
                        return '';
                if( vote.info ){
                        return formatLocations(vote.locations, vote.info,null,loc, infowindow, '', true );
                }

        }
        
        if( ! sidebar ) 
                $tabs.show();
        $detailsbox.html( longInfo() ).show();
        vote.html = infoWrap( S(
                log.print(),
                electionHeader(),
                homeAndVote()
        ) );
        vote.htmlInfowindow = infoWrap( S(
                log.print(),
                electionHeader(),
                homeAndVote( true )
        ) );
        
        function homeAndVote( infowindow ) {
                var viewMessage = "";
                var viewLink = sidebar ? '' : S(
                        '<div style="padding-top:0.75em;">',
                                '<a href="#detailsbox" onclick="return selectTab(\'#detailsbox\');">',
                                        viewMessage,
                                '</a>',
                        '</div>'
                );

                return vote.info && vote.info.latlng ? S(voteLocation( true ),viewLink) : S(voteLocation( infowindow ));
                
        }
        
        function longInfo() {
                var location = vote.locations[0];
                var locationHtml = (location)?S(
                '<h1>بيانات اللجنة الانتخابية</h1>',
                '<div class="place">',
                  '<p>لجنتك الانتخابية :'+location.name+'</p>',
                  '<p>العنوان : '+location.address+'</p>',
                '</div>'):'';

                var contests = vote.info.contests;
                var boundriesHtml = '';         
                if(contests){   
                        //boundries
                        var contestButtonsHtml = '';
                        for(var i = 0;i <contests.length; i++){
                                contestButtonsHtml += ('<li><a href="#mapbox" onclick="gotoConstit(\''+contests[i].constituency_code+'\')">'+contests[i].type+' '+contests[i].constituency+'</a></li>');
                        } 

                        boundriesHtml = S(
                               '<h1>لمعرفة حدود اللجنة الإنتخابية</h1>',
                               '<ul class="area-cover clearfix">',
                                contestButtonsHtml,
                               '</ul>'
                        );
                        //candidates
                        var listingsHtml = '';
                        for(var i = 0;i <contests.length; i++){
                                if(contests[i].ballot_choices.candidates.length){
                                        listingsHtml += ('<h1>المرشحين عن دائرة'+' '+contests[i].type+' '+contests[i].constituency+'</h1>');
                                        listingsHtml += S('<table width="100%" cellspacing="0">',
                                                                '<tr>',
                                                                  '<th scope="col">الاسم</th>',
                                                                  '<th scope="col">اسم الشهرة</th>',
                                                                  '<th scope="col">الحزب</th>',
                                                                  '<th scope="col">الصفة</th>',
                                                                  '<th scope="col">الرمز</th>',
                                                                '</tr>'
                                        );
                                        var candidates = contests[i].ballot_choices.candidates;
                                        for(var j = 0;j<candidates.length;j++){
                                                c = (j%2 == 0)?'even':'';
                                                listingsHtml += S('<tr class = "'+c+'">',
                                                                  '<td><a href="'+candidates[j].url+'">'+candidates[j].name+'</a></td>',
                                                                  '<td>'+candidates[j].nick_name+'</td>',
                                                                  '<td>'+candidates[j].party_name+'</td>',
                                                                  '<td>'+candidates[j].type+'</td>',
                                                                  '<td><img width="50" height="50" src="'+candidates[j].symbol_url+'" alt="'+candidates[j].symbol+'" /></td>',
                                                                '</tr>'
                                                );
                                        }
                                        listingsHtml += '</table>';
                                }else if(contests[i].ballot_choices.choices.length){
                                        listingsHtml += ('<h1>المرشحين عن دائرة'+' '+contests[i].type+' '+contests[i].constituency+'</h1>');
                                        listingsHtml += '<p>اضغط على اسم القائمة لمزيد من التفاصيل</p>';
                                        listingsHtml += '<ul class="lists">';

                                        var lists = contests[i].ballot_choices.choices;
                                        for(var l= 0;l<lists.length;l++){
                                                listingsHtml += '<li>';
                                                listingsHtml += '<img width="50" height="50"src="'+lists[l].symbol_url+'" class="img-border" /> <a href="'+lists[l].url+'">قائمة '+lists[l].name+'</a>';
                                                listingsHtml += S('<table width="100%" cellspacing="0">',
                                                                        '<tr>',
                                                                          '<th scope="col">الاسم</th>',
                                                                          '<th scope="col">اسم الشهرة</th>',
                                                                          '<th scope="col">الحزب</th>',
                                                                          '<th scope="col">الصفة</th>',
                                                                          '<th scope="col">الرمز</th>',
                                                                        '</tr>'
                                                );
                                
                                                var candidates = lists[l].candidates;
                                                for(var j = 0;j<candidates.length;j++){
                                                        c = (j%2 == 0)?'even':'';
                                                        listingsHtml += S('<tr class = "'+c+'">',
                                                                          '<td><a href="'+candidates[j].url+'">'+candidates[j].name+'</a></td>',
                                                                          '<td>'+candidates[j].nick_name+'</td>',
                                                                          '<td>'+candidates[j].party_name+'</td>',
                                                                          '<td>'+candidates[j].type+'</td>',
                                                                          '<td><img width="50" height="50" src="'+candidates[j].symbol_url+'" alt="'+candidates[j].symbol+'" /></td>',
                                                                        '</tr>'
                                                        );
                                                }

                                                listingsHtml += S('<tr>',
                                                                '<td colspan="10" class="center list-info"><a href="'+lists[l].url+'">للمزيد من المعلومات قم بزيارة الموقع الخاص بقائمة'+' '+lists[l].name +' </a></td>',
                                                                '</tr>'
                                                );
                                                listingsHtml += '</table>';
                                                listingsHtml += '</li>';
                                        }       
                                        listingsHtml +='</ul>';
                                }
                        }
        
                }


                var html = S(
                        '<div class="content">',
                                '<div class="wrapper">',
                                        '<div class="main">',
                                                '<div class="results">',
                                                        locationHtml,
                                                        boundriesHtml,
                                                        listingsHtml,
                                                '</div>',
                                        '</div>',
                                '</div>',
                        '</div>'
                );
                return T('longInfo',{html: html});

                /*return T( 'longInfo', {
                        log: log.print(),
                        header: electionHeader(),
                        location: voteLocation(),
                        warning: locationWarning(),
                        info: electionInfo()
                });*/
        }
}

function getContests() {
        var contests = vote && vote.poll && vote.poll.contests && vote.poll.contests[0];
        return contests && contests.length && contests;
}

function formatLocations( locations, info, icon, title, infowindow, extra, mapped ) {
        function formatLocationRow( info ) {
                var address = T( 'address', {
                        location: H( info.location ),
                        address: multiLineAddress( info.address )
                });
                


                return T( 'locationRow', {
                        iconSrc: "",//imgUrl(icon.url),
                        iconWidth: 0,//icon.width,
                        iconHeight: 0,//icon.height,
                        address: address,
                        directions: info.directions || '',
                        hours: info.hours ? 'Hours: ' + info.hours : '',
                        extra: extra || ''
                });
        }
        
        var rows = info ?
                [ formatLocationRow(info) ] :
                locations.map( function( location ) {
                        var a = location.address;
                        return formatLocationRow({
                                location: a && a.location_name || '',
                                directions: location.directions || '',
                                hours: location.pollinghours || '',
                                address: a
                        });
                });
        
        return S(
                T( 'locationHead', {
                        select: includeMap() ? 'onclick="return maybeSelectTab(\'#mapbox\',event);" style="cursor:pointer;"' : '',
                        title: title
                }),
                rows.join(''),
                T( 'locationFoot', {
                        unable: info && info.latlng || mapped ? '' : T('locationUnable')
                })
        );
}

// Set up map and sidebar when the polling place location is known
function setVoteGeo(location) {
        
        if( location ) {
/*              var place = {address_components:[{long_name:"", short_name:"", types:["street_number"]}, {long_name:location[0].address.location_name, short_name:location[0].address.location_name, types:["route"]}, {long_name:"Oakton", short_name:"Oakton", types:["locality", "political"]}, {long_name:"Providence", short_name:"Providence", types:["administrative_area_level_3", "political"]}, {long_name:"Fairfax", short_name:"Fairfax", types:["administrative_area_level_2", "political"]}, {long_name:"Virginia", short_name:"VA", types:["administrative_area_level_1", "political"]}, {long_name:"United States", short_name:"US", types:["country", "political"]}, {long_name:"22124", short_name:"22124", types:["postal_code"]}], formatted_address:"11509 Waples Mill Rd, Oakton, VA 22124, USA", geometry:{location:{Pa:38.875815, Qa:-77.344786}, location_type:"ROOFTOP", viewport:{ba:{b:38.8744660197085, d:38.8771639802915}, V:{d:-77.34613498029148, b:-77.34343701970852}}}, partial_match:true, types:["street_address"]}*/
                /*var place = {geometry:{location:{Pa:38.875815, Qa:-77.344786}, location_type:"ROOFTOP", viewport:{ba:{b:38.8744660197085, d:38.8771639802915}, V:{d:-77.34613498029148, b:-77.34343701970852}}}};*/

                var place ={geometry: {
                location: {},
                location_type: "ROOFTOP"//,
                /*viewport: {
                        southwest: {lat: location.lat-0.02,lng: location.lng-0.01},
                        northeast: {lat: location.lat+0.02,lng: location.lng+0.01}
                },*/
                /*bounds: {
                        southwest: {lat: location.lat-0.0005,lng: location.lng-0.001},
                        northeast: {lat: location.lat+0.0015,lng: location.lng+0.001}

                }*/
            }};
            place.geometry.location =new gm.LatLng( location.lat, location.lng );
            //place.geometry.location = new gm.LatLng(  30.0647,31.2495);
            log( 'Getting polling place map info' );
            setMap( vote.info = mapInfo( vote.poll.contests, place, location ),null,null );
            if(vote.info.latlng ){
                map.setCenter( vote.info.latlng );
            }else{
                map.setCenter(new gm.LatLng(  30.01,31.14)); 
            }
                
        
        }
        setVoteNoGeo();
        if(vote.info.latlng ) selectTab('#mapbox');
}

// Set up map and sidebar with no polling place location
function setVoteNoGeo() {
        setVoteHtml();
        forceDetails();
}

// Return a single line formatted address, from either a string or
// an address object
function oneLineAddress( address ) {
        if( ! address )
                return '';
        //if( typeof address == 'string' )
        //      return H(address).replace( /, USA$/, '' );
        return H( S(
                address.line1 ? address.line1 + ', ' : '',
                address.line2 ? address.line2 + ', ' : '',
                address.city, ', ', address.state,
                address.zip ? ' ' + address.zip : ''
        ) );
}

// Return a multiline formatted address, from either a string or
// an address object
function multiLineAddress( address ) {
        if( ! address )
                return '';
        if( typeof address == 'string' )
                return H(address)
                        //.replace( /, USA$/, '' )
                        .replace( /, (\w\w) /, '\| $1 ' )
                        .replace( /, /g, '<br>' )
                        .replace( /\|/g, ',' );
        return S(
                address.line1 ? H(address.line1) + '<br>' : '',
                address.line2 ? H(address.line2) + '<br>' : '',
                H(address.city), ', ', H(address.state),
                address.zip ? ' ' + H(address.zip) : ''
        );
}

// Apply any local fixups to an address
function fixInputAddress( addr ) {
        //if( addr == pref.example )
        //      addr = addr.replace( /^.*: /, '' );
        return addr;
}

// Geocoding and Election Center API

function lookupPollingPlace( nid,gid,pid, callback ) {
        //alert ("lookupPollingPlace");
        function ok( poll ) { return poll.status == 'SUCCESS'; }
        function countyAddress() {
                return S( info.street, ', ', info.county, ', ', info.state.abbr, ' ', info.zip );
        }
        pollingApi( nid,gid,pid, function( poll ) {
                if( ok(poll) ){
                        if((poll.status == 'SUCCESS') && ((gid != poll.stateInfo.gid) || ( pid != poll.stateInfo.pid))) {
                                notTheSame();
                                return;
                        }
                        callback( poll );
                }else{
                        sorry();
                        return;
                }
        });
}

function findPrecinct( nid,gid,pid ) {
        //alert("findPrecinct");
        lookupPollingPlace( nid,gid,pid, 


function(poll) {
                //alert("callback called");
                log( 'API status code: ' + poll.status || '(OK)' );
                vote.poll = poll;
                var locations = vote.locations = poll.locations;
                var contests = poll.contests;
                //Phase1
                /*if( poll.status != 'SUCCESS'  ||  ! locations  ||  ! locations.length ) {
                        sorry();
                        return;
                }*/
                if( poll.status != 'SUCCESS') {
                        sorry();
                        return;
                }
                //end phase1            
                if((poll.status == 'SUCCESS') && ((gid != poll.stateInfo.gid) || ( pid != poll.stateInfo.pid))) {
                        notTheSame();
                        return;
                }
                var location = {};
                if (locations && locations.length){
                        location = locations[0];
                        location.address = location.unparsed_address;
                }
                
                if( location.lng && location.lat ){
                        log( 'Polling address found' );                 
                        setVoteGeo( location );
                }
                else {
                        log( 'No polling address' );                    
                        setMap( null);
                        setVoteNoGeo();
                }
        }

);
}

// Gadget initialization

function zoomTo( bbox ) {
        var bounds = new gm.LatLngBounds(
                new gm.LatLng( bbox[1], bbox[0] ),
                new gm.LatLng( bbox[3], bbox[2] )
        );
        map.fitBounds( bounds );
}

function gadgetReady( json ) {
        initMap( function() {
                setupTabs();
                if( pref.ready ){
                        submit( pref.address || pref.example );
                }else{
                        zoomTo( initialBbox );
                }
        });
}