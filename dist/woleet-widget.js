!function(e){function t(t){for(var n,o,i=t[0],u=t[1],c=0,a=[];c<i.length;c++)o=i[c],r[o]&&a.push(r[o][0]),r[o]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);for(l&&l(t);a.length;)a.shift()()}var n={},r={0:0};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise(function(t,o){n=r[e]=[t,o]});t.push(n[2]=i);var u,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+""+({}[e]||e)+".js"}(e),u=function(t){c.onerror=c.onload=null,clearTimeout(l);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src,u=new Error("Loading chunk "+e+" failed.\n("+o+": "+i+")");u.type=o,u.request=i,n[1](u)}r[e]=void 0}};var l=setTimeout(function(){u({type:"timeout",target:c})},12e4);c.onerror=c.onload=u,document.head.appendChild(c)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="../dist/",o.oe=function(e){throw console.error(e),e};var i=window.webpackJsonp=window.webpackJsonp||[],u=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var l=u;o(o.s=109)}({108:function(e,t){},109:function(e,t,n){"use strict";n.r(t);var r={DEFAULT_WIDGET_MODE:"ICON",WIDGET_MODE_ICON:"ICON",WIDGET_MODE_BANNER:"BANNER",WIDGET_MODE_FULL:"FULL",AVAILABLE_WIDGET_MODES:["ICON","BANNER","FULL"]};var o={getWoleetLibs:function(){return Promise.all([n.e(1),n.e(2)]).then(n.t.bind(null,110,7)).then(function(e){return e.default}).catch(function(e){return"An error occurred while loading the component"})},getLodash:function(){return n.e(3).then(n.t.bind(null,111,7)).then(function(e){return e.default}).catch(function(e){return"An error occurred while loading the component"})}};var i={extendObject:function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}},u=n(41),c=n.n(u);n(108);function l(e){var t,n;t=document.getElementsByTagName("head")[0],(n=document.createElement("link")).rel="stylesheet",n.type="text/css",n.href="../dist/main.css",n.media="all",t.appendChild(n),function(e){e.widgetElement.innerHTML=c.a,e.widgetElement.getElementsByClassName("woleet-widget__wrapper")[0].textContent=JSON.stringify(e.configurations)}(e),console.log("globalObject",e)}!function(e){var t={mode:r.DEFAULT_WIDGET_MODE,colors:{"primary-color":"#ADFF2F","secondary-color":"#9ACD32","link-color":"#98FB98"}},n=e[e["woleet-widget"]],u=n[0],c=n[1],a=document.getElementsByClassName(u)[0];if(!a)throw Error("Widget Element with class ".concat(u," wasn't found"));t=i.extendObject(t,c),n.configurations=t,n.widgetElement=a,t.mode!==r.WIDGET_MODE_ICON?o.getWoleetLibs().then(function(e){n.woleet=e,l(n)}):l(n)}(window)},41:function(e,t){e.exports='<div class="woleet-widget__wrapper"></div>\n'}});