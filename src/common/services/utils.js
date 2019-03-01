import { icon } from '@fortawesome/fontawesome-svg-core'
import constants from "Common/constants";

function extendObject(a, b) {
  const clone = {...a};
  
  for (let key in b)
    if (b.hasOwnProperty(key))
      clone[key] = b[key];
  return clone;
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
 * @param downloadFilename
 * @param widget
 * @param observerMapper
 * @returns {XMLHttpRequest}
 */
function getHttpRequest(downloadFilename, widget, observerMapper) {
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
        const filename = downloadFilename.substring(downloadFilename.lastIndexOf('/')+1);
        const file = blobToFile(request.response, filename);
        
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

export default  {
  byString,
  setTimer,
  translate,
  blobToFile,
  getUniqueId,
  extendObject,
  defineProperty,
  getHttpRequest,
  extractClasses,
  getSolidIconSVG,
  getUrlToDownload,
  getRegularIconSVG
}
