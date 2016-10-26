/*!
 * document.currentScript
 * Polyfill for `document.currentScript`.
 * Copyright (c) 2016 James M. Greene
 * Licensed MIT
 * https://github.com/JamesMGreene/document.currentScript
 * v1.1.0
 */
!function(){
// Top-level API (compliant with `document.currentScript` specifications)
//
// Get the currently "executing" (i.e. EVALUATING) `script` DOM
// element, per the spec requirements for `document.currentScript`.
//
// IMPORTANT: This polyfill CANNOT achieve 100% accurate results
//            cross-browser. ;_;
function a(){
// Yes, this IS possible, i.e. if a script removes other scripts (or itself)
if(0===b.length)return null;
// Guaranteed accurate in IE 6-10.
// Not supported in any other browsers. =(
if(e)for(var c=b.length;c--;)if(b[c]&&"interactive"===b[c].readyState)return b[c];
// If the native method exists, defer to that as a last-ditch effort
// If the native method exists, defer to that as a last-ditch effort
return"function"==typeof f&&a.doNotDeferToNativeMethod!==!0?f.call(document)||null:null}
// Live NodeList collection
var b=document.getElementsByTagName("script"),c="readyState"in(b[0]||document.createElement("script")),d=!window.opera||"[object Opera]"!==window.opera.toString(),e=c&&d,f=function(b){function c(){var c,d=!0;
// Potentially dangerous hack...
return f&&(c=Object.getOwnPropertyDescriptor(b,"currentScript")||void 0,c&&"function"==typeof c.get&&c.get===a&&(d=!1)),d?b.currentScript:null}function d(a){var b;return null!=a&&(b=g?Object.getPrototypeOf(a):h?a.__proto__:null!=a.constructor?a.constructor.prototype:void 0),b}/*jshint proto:true */
var e="currentScript"in b,f="function"==typeof Object.getOwnPropertyDescriptor,g="function"==typeof Object.getPrototypeOf,h="object"==typeof"test".__proto__,i=function j(b,g){var h,i;return e&&f&&b&&b!==Object.prototype&&g&&g!==Object.prototype&&(f&&(h=Object.getOwnPropertyDescriptor(b,"currentScript")||void 0,h&&"function"==typeof h.get&&(i=h.get)),i||(i=j(d(b),g))),i?i===a&&(i=void 0):i=c,i}(b,b);return i}(document);
// Allow a last-ditch effort to use the native `document.currentScript` accessor
// method (if it exists and can be retrieved)?
a.doNotDeferToNativeMethod=!1;
// Inspect the polyfill-ability of this browser
var g=!("currentScript"in document),h="function"==typeof Object.defineProperty&&function(){var a;try{Object.defineProperty(document,"_xyz",{get:function(){return"blah"},configurable:!0}),a="blah"===document._xyz,delete document._xyz}catch(b){a=!1}return a}();
// Add the "private" property for testing, even if the real property can be polyfilled
document._currentScript=a,
// Polyfill it!
g&&h&&"undefined"!=typeof e&&e&&Object.defineProperty(document,"currentScript",{get:a})}();
