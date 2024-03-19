// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(l){function t(){for(var t=h.scrollTop(),e=u.height(),i=e-m,n=i<t?i-t:0,r=0,s=g.length;r<s;r++){var o,c,p,a=g[r],d=a.stickyWrapper.offset().top-a.topSpacing-n;a.stickyWrapper.css("height",a.stickyElement.outerHeight()),t<=d?null!==a.currentTop&&(a.stickyElement.css({width:"",position:"",top:"","z-index":""}),a.stickyElement.parent().removeClass(a.className),a.stickyElement.trigger("sticky-end",[a]),a.currentTop=null):((o=e-a.stickyElement.outerHeight()-a.topSpacing-a.bottomSpacing-t-n)<0?o+=a.topSpacing:o=a.topSpacing,a.currentTop!==o&&(a.getWidthFrom?(padding=a.stickyElement.innerWidth()-a.stickyElement.width(),c=l(a.getWidthFrom).width()-padding||null):a.widthFromWrapper&&(c=a.stickyWrapper.width()),null==c&&(c=a.stickyElement.width()),a.stickyElement.css("width",c).css("position","fixed").css("top",o).css("z-index",a.zIndex),a.stickyElement.parent().addClass(a.className),null===a.currentTop?a.stickyElement.trigger("sticky-start",[a]):a.stickyElement.trigger("sticky-update",[a]),a.currentTop===a.topSpacing&&a.currentTop>o||null===a.currentTop&&o<a.topSpacing?a.stickyElement.trigger("sticky-bottom-reached",[a]):null!==a.currentTop&&o===a.topSpacing&&a.currentTop<o&&a.stickyElement.trigger("sticky-bottom-unreached",[a]),a.currentTop=o),p=a.stickyWrapper.parent(),a.stickyElement.offset().top+a.stickyElement.outerHeight()>=p.offset().top+p.outerHeight()&&a.stickyElement.offset().top<=a.topSpacing?a.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):a.stickyElement.css("position","fixed").css("top",o).css("bottom","").css("z-index",a.zIndex))}}function e(){m=h.height();for(var t=0,e=g.length;t<e;t++){var i=g[t],n=null;i.getWidthFrom?i.responsiveWidth&&(n=l(i.getWidthFrom).width()):i.widthFromWrapper&&(n=i.stickyWrapper.width()),null!=n&&i.stickyElement.css("width",n)}}var i=Array.prototype.slice,n=Array.prototype.splice,c={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"inherit"},h=l(window),u=l(document),g=[],m=h.height(),p={init:function(o){return this.each(function(){var t=l.extend({},c,o),e=l(this),i=e.attr("id"),n=i?i+"-"+c.wrapperClassName:c.wrapperClassName,r=l("<div></div>").attr("id",n).addClass(t.wrapperClassName);e.wrapAll(function(){if(0==l(this).parent("#"+n).length)return r});var s=e.parent();t.center&&s.css({width:e.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===e.css("float")&&e.css({float:"none"}).parent().css({float:"right"}),t.stickyElement=e,t.stickyWrapper=s,t.currentTop=null,g.push(t),p.setWrapperHeight(this),p.setupChangeListeners(this)})},setWrapperHeight:function(t){var e=l(t),i=e.parent();i&&i.css("height",e.outerHeight())},setupChangeListeners:function(e){window.MutationObserver?new window.MutationObserver(function(t){(t[0].addedNodes.length||t[0].removedNodes.length)&&p.setWrapperHeight(e)}).observe(e,{subtree:!0,childList:!0}):window.addEventListener?(e.addEventListener("DOMNodeInserted",function(){p.setWrapperHeight(e)},!1),e.addEventListener("DOMNodeRemoved",function(){p.setWrapperHeight(e)},!1)):window.attachEvent&&(e.attachEvent("onDOMNodeInserted",function(){p.setWrapperHeight(e)}),e.attachEvent("onDOMNodeRemoved",function(){p.setWrapperHeight(e)}))},update:t,unstick:function(t){return this.each(function(){for(var t=l(this),e=-1,i=g.length;0<i--;)g[i].stickyElement.get(0)===this&&(n.call(g,i,1),e=i);-1!==e&&(t.unwrap(),t.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",t,!1),window.addEventListener("resize",e,!1)):window.attachEvent&&(window.attachEvent("onscroll",t),window.attachEvent("onresize",e)),l.fn.sticky=function(t){return p[t]?p[t].apply(this,i.call(arguments,1)):"object"!=typeof t&&t?void l.error("Method "+t+" does not exist on jQuery.sticky"):p.init.apply(this,arguments)},l.fn.unstick=function(t){return p[t]?p[t].apply(this,i.call(arguments,1)):"object"!=typeof t&&t?void l.error("Method "+t+" does not exist on jQuery.sticky"):p.unstick.apply(this,arguments)},l(function(){setTimeout(t,0)})});