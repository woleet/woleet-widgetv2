import { icon } from '@fortawesome/fontawesome-svg-core'

function extendObject(a, b) {
  for (let key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
}

function defineProperty(target) {
  return (name, value) => Object.defineProperty(target, name, {
    enumerable: false,
    value
  })
}

function extractClasses(styles, classCodes) {
  return Object.keys(styles)
    .map(classCode => classCodes.indexOf(classCode) !== -1 ? styles[classCode] : '')
    .filter(className => className && className.length > 0);
}

function translate(code, lang = '', options = {}) {
  if (window.i18n && window.i18n.t) {
    return window.i18n.t(code, extendObject({ lng: lang }, options));
  }
  return code;
}

/**
 * Get regular SVG icon of the library Font-Awesome
 * @param iconCode
 * @param options
 * @returns {*}
 */
function getRegularIconSVG(iconCode, options = {}) {
  if (window.regularIconsModule) {
    return icon(window.regularIconsModule[iconCode], options).html[0];
  }
  return false;
}

/**
 * Get solid SVG icon of the library Font-Awesome
 * @param iconCode
 * @param options
 * @returns {*}
 */
function getSolidIconSVG(iconCode, options = {}) {
  if (window.solidIconsModule) {
    return icon(window.solidIconsModule[iconCode], options).html[0];
  }
  return false;
}

export default  {
  translate,
  extendObject,
  defineProperty,
  extractClasses,
  getSolidIconSVG,
  getRegularIconSVG
}
