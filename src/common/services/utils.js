import constants from "Common/constants";
import i18next from 'i18next';

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
  if (i18next.t) {
    return i18next.t(code, mergeDeep({ lng: lang }, options));
  }
  return code;
}

/**
 * Fetch all configuration attributes and define the widget configuration
 * @param widgetElement
 */
function parseWidgetAttributeConfiguration(widgetElement) {
  const forbiddenAttributes = ['config', 'class'];
  let elementAttributes = {};
  let widgetConfiguration = {};

  for (let i = 0, attrs = widgetElement.attributes; i < attrs.length; i++) {
    elementAttributes[attrs[i].nodeName] = attrs[i].nodeValue;
  }

  if (elementAttributes.config) {
    widgetConfiguration = JSON.parse(elementAttributes.config);
  }

  const attributesKeys = Object.keys(elementAttributes);

  attributesKeys.forEach((key) => {
    if (forbiddenAttributes.indexOf(key) === -1) {
      const attributeValue = elementAttributes[key];

      try {
        widgetConfiguration[key] = JSON.parse(attributeValue);
      } catch (e) {
        widgetConfiguration[key] = attributeValue;
      }

      const keyParts = key.split('-');

      if (keyParts.length > 1) {
        const configurationObject = getObjectByString(keyParts.join('.'), widgetConfiguration[key]);

        mergeDeep(widgetConfiguration, configurationObject);
        delete widgetConfiguration[key];
      }
    }
  });

  return widgetConfiguration;
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
 * @param toBlob
 * @returns {XMLHttpRequest}
 */
function getHttpRequest(downloadFilename, widget, observerMapper, url = false, toBlob = false) {
  let request = new XMLHttpRequest();
  
  request.addEventListener('readystatechange', () => {
    if(request.readyState === 2 && request.status === 200) {
      // Download is being started
      if (observerMapper['downloadingStarted']) {
        const downloadingStartedObserver = observerMapper['downloadingStarted'];
        widget.observers[downloadingStartedObserver].broadcast(url);
      }
    } else if(request.readyState === 3) {
      // Download is under progress
    } else if(request.readyState === 4) {
      // Downloading has finished
      if (request.response && request.status === 200) {
        const filename = getFilenameUrl(downloadFilename);

        let file = request.response;

        if (!toBlob) {
          file = blobToFile(file, filename);
          file.url = url;
        }
        
        if (observerMapper['downloadingFinished']) {
          const downloadingFinishedObserver = observerMapper['downloadingFinished'];
          widget.observers[downloadingFinishedObserver].broadcast(file);
        }
      } else if (request.status === 404) {
        if (observerMapper['downloadingFailed']) {
          const downloadingFailedObserver = observerMapper['downloadingFailed'];
          widget.observers[downloadingFailedObserver].broadcast('url_not_found');
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
    try {
      request.open("GET", downloadFilename, true);
      request.send();
    } catch(err) {
      console.log('downloading failed', err);
    }
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
 * Get Html element from SVG string
 * @param svg
 * @returns {*}
 */
function svgToHTML(svg) {
  const div = document.createElement('div');
  div.innerHTML = svg.trim();
  
  const element = div.firstChild;
  const attributes = element.attributes;
  
  return {
    el: element,
    attributes: {
      width: attributes.width.value + 'px',
      height: attributes.height.value + 'px'
    }
  };
}

/**
 * Check if ads are blocked
 * @param callback
 */
function adsBlocked(callback){
  const testURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

  const myInit = {
    method: 'HEAD',
    mode: 'no-cors'
  };

  const myRequest = new Request(testURL, myInit);

  fetch(myRequest).then(function(response) {
    return response;
  }).then(function(response) {
    callback(false)
  }).catch(function(e){
    callback(true)
  });
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

function formatDate(date, lang) {
  let options = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
  return date.toLocaleDateString(lang, options)
}

function saveObjectAs(object, filename, type = 'application/json;charset=utf-8') {
  const strObject = JSON.stringify(object, null, 4);
  const file = new Blob([strObject],{type});
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function calculateWidgetWidths(widgetWidth, iconWidth, parent) {
  const results = {
    widgetWidth,
    iconWidth,
    px: {
      widgetWidth,
      iconWidth
    },
    percent: {
      widgetWidth,
      iconWidth
    }
  };

  const {offsetWidth: parentOffsetWidth} = parent;
  let integerWidgetWidth = parseInt(widgetWidth, 10);
  let integerIconWidth = parseInt(iconWidth, 10);

  const widgetWidthIsPercent = widgetWidth && widgetWidth.indexOf('%') !== -1;
  const iconWidthIsPercent = iconWidth && iconWidth.indexOf('%') !== -1;

  if (!(iconWidth) || (!widgetWidthIsPercent && !iconWidthIsPercent && integerIconWidth > integerWidgetWidth)) {
    results.iconWidth = widgetWidth;
  } else if (widgetWidthIsPercent && !iconWidthIsPercent) {
    const widgetWidthInPixels = (integerWidgetWidth * parentOffsetWidth) / 100;

    if (integerIconWidth > widgetWidthInPixels) {
      results.iconWidth = `${widgetWidthInPixels}px`;
    }
  }

  integerIconWidth = parseInt(results.iconWidth, 10);

  if (widgetWidthIsPercent) {
    results.percent.widgetWidth = integerWidgetWidth;
    results.px.widgetWidth = parseFloat(((integerWidgetWidth * parentOffsetWidth) / 100).toFixed(2));
  } else {
    results.px.widgetWidth = integerWidgetWidth;
    results.percent.widgetWidth = parseFloat(((integerWidgetWidth * 100) / parentOffsetWidth).toFixed(2));
  }

  if (iconWidthIsPercent) {
    results.percent.iconWidth = integerIconWidth;
    results.px.iconWidth = parseFloat(((integerIconWidth * results.px.widgetWidth) / 100).toFixed(2));
  } else {
    results.px.iconWidth = integerIconWidth;
    results.percent.iconWidth = parseFloat(((integerIconWidth * 100) / results.px.widgetWidth).toFixed(2));
  }

  return results;
}

export default  {
  byString,
  setTimer,
  svgToHTML,
  translate,
  blobToFile,
  formatDate,
  adsBlocked,
  getUniqueId,
  saveObjectAs,
  extendObject: mergeDeep,
  defineProperty,
  getHttpRequest,
  extractClasses,
  getFilenameUrl,
  getFileExtension,
  getUrlToDownload,
  getFilenameSource,
  getObjectByString,
  getObjectProperty,
  calculateWidgetWidths,
  parseWidgetAttributeConfiguration
}
