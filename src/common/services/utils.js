import { icon } from '@fortawesome/fontawesome-svg-core'
import constants from "Common/constants";

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 * @returns {*}
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
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
    return window.i18n.t(code, mergeDeep({ lng: lang }, options));
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

/**
 * Get unique id
 * @returns {*}
 */
function getUniqueId(prefix = '', suffix = '') {
  const uniqueId = (s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4());

  return prefix + uniqueId + suffix;
}

function s4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function setTimer(callback, delay) {
  if (delay && delay > 0) {
    setTimeout(callback, delay)
  }
}

/**
 * The function converts Blob to File
 * @param blob
 * @param filename
 * @returns {File}
 */
function blobToFile(blob, filename) {
  return new File([blob], filename, {type: blob.type, lastModifiedDate: new Date()});
}

/**
 * Get url to download file using Proxy Server
 * @param filename
 * @returns {*}
 */
function getUrlToDownload(filename) {
  return constants.PROXY_URL + filename;
}

/**
 * Get filename of a URL
 * @param url
 * @returns {string}
 */
function getFilenameUrl(url) {
  return url.substring(url.lastIndexOf('/')+1);
}

/**
 *
 * @param url
 * @returns {string}
 */
function getFilenameSource(url) {
  return url.substring(0, url.lastIndexOf('/'));
}

/**
 * Get filename of a URL
 * @param filename
 * @returns {string}
 */
function getFileExtension(filename) {
  return filename.substring(filename.lastIndexOf('.')+1).toLowerCase();
}

/**
 * @param downloadFilename
 * @param widget
 * @param observerMapper
 * @param url
 * @returns {XMLHttpRequest}
 */
function getHttpRequest(downloadFilename, widget, observerMapper, url = false) {
  let request = new XMLHttpRequest();
  
  request.addEventListener('readystatechange', () => {
    if(request.readyState === 2 && request.status === 200) {
      // Download is being started
      if (observerMapper['downloadingStarted']) {
        const downloadingStartedObserver = observerMapper['downloadingStarted'];
        widget.observers[downloadingStartedObserver].broadcast();
      }
    } else if(request.readyState === 3) {
      // Download is under progress
    } else if(request.readyState === 4) {
      // Downloading has finished
      if (request.response) {
        
        
        const filename = getFilenameUrl(downloadFilename);
        const file = blobToFile(request.response, filename);
  
        file.url = url;
        
        if (observerMapper['downloadingFinished']) {
          const downloadingFinishedObserver = observerMapper['downloadingFinished'];
          widget.observers[downloadingFinishedObserver].broadcast(file);
        }
      }
    }
  });
  
  request.addEventListener("progress", function (evt) {
    if (evt.lengthComputable) {
      const percentComplete = parseInt((evt.loaded / evt.total) * 100, 10);
      if (observerMapper['downloadingProgress']) {
        const downloadingProgressObserver = observerMapper['downloadingProgress'];
        widget.observers[downloadingProgressObserver].broadcast(percentComplete);
      }
    }
  }, false);
  
  request.responseType = 'blob';
  
  
  
  request.onerror = function (error) {
    if (observerMapper['downloadingFailed']) {
      const downloadingFailedObserver = observerMapper['downloadingFailed'];
      widget.observers[downloadingFailedObserver].broadcast(error);
    }
  };
  
  request.start = () => {
    request.open("GET", downloadFilename, true);
    request.send();
  };
  
  return request;
}

/**
 * Get nested object property by string
 * @param o
 * @param s
 * @returns {*}
 */
function byString(o, s) {
  s = s.replace(/^window./g, '');
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return false;
    }
  }
  return o;
}

/**
 *
 * @param str
 * @param value
 * @param result
 * @returns {{}}
 */
function getObjectByString(str, value, result = {}) {
  const values = str.split('.');
  const item = values.shift();

  if (values.length === 0) {
    result[item] = value;
    return result;
  }

  result[item] = getObjectByString(values.join('.'), value);
  return result;
}

/**
 * Check is the property exists in the object
 * @param object
 * @param property
 */
function getObjectProperty(object, property) {
  let result = false;

  for (let key in object) {
    if (object.hasOwnProperty(key) && key.toLowerCase() === property.toLowerCase()) {
      result = object[key];
    }
  }

  return result;
}

export default  {
  byString,
  setTimer,
  translate,
  blobToFile,
  getUniqueId,
  extendObject: mergeDeep,
  defineProperty,
  getHttpRequest,
  extractClasses,
  getFilenameUrl,
  getSolidIconSVG,
  getFileExtension,
  getUrlToDownload,
  getFilenameSource,
  getRegularIconSVG,
  getObjectByString,
  getObjectProperty
}
