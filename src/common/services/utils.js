import i18next from 'i18next';

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
        if (!target[key]) {
          Object.assign(target, {
            [key]: {}
          });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }

  /**
   * Merge the sources recursively
   */
  return mergeDeep(target, ...sources);
}

/**
 * Define not enumerable object property
 * @param target
 * @returns {function(*=, *): any}
 */
function defineProperty(target) {
  return (name, value) => Object.defineProperty(target, name, {
    enumerable: false,
    value
  })
}

/**
 * Find the real class name by its hash code
 * @param styles
 * @param classCodes
 * @returns {T[]}
 */
function extractClasses(styles, classCodes) {
  return Object.keys(styles)
    .map(classCode => classCodes.indexOf(classCode) !== -1 ? styles[classCode] : '')
    .filter(className => className && className.length > 0);
}

/**
 * Translate the phrase to lang
 * @param code
 * @param lang
 * @param options
 * @returns {string | * | *|*}
 */
function translate(code, lang = '', options = {}) {
  if (i18next.t) {
    return i18next.t(code, mergeDeep({
      lng: lang
    }, options));
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

  // Get all attributes
  for (let i = 0, attrs = widgetElement.attributes; i < attrs.length; i++) {
    elementAttributes[attrs[i].nodeName] = attrs[i].nodeValue;
  }

  // All the attributes can be placed in the config attribute
  if (elementAttributes.config) {
    widgetConfiguration = JSON.parse(elementAttributes.config);
  }

  const attributesKeys = Object.keys(elementAttributes);

  attributesKeys.forEach((key) => {
    if (forbiddenAttributes.indexOf(key) === -1) {
      const attributeValue = elementAttributes[key];

      // Get a property by code and replace the config values if they exists
      try {
        widgetConfiguration[key] = JSON.parse(attributeValue);
      } catch (e) {
        widgetConfiguration[key] = attributeValue;
      }

      const keyParts = key.split('-');

      // If an attribute name contains several parts, make them nested and merge recursively
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
 * Get unique widget id
 * @returns {*}
 */
function getUniqueId(prefix = '', suffix = '') {
  const uniqueId = (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());

  return prefix + uniqueId + suffix;
}

/**
 * Generate random string
 * @returns {string}
 */
function s4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * Set a timer for a callback with delay
 * @param callback
 * @param delay
 */
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
  return new File([blob], filename, {
    type: blob.type,
    lastModifiedDate: new Date()
  });
}

/**
 * Get url to download file using Proxy Server
 * @param filename
 * @param proxyUrl
 * @param useProxy
 * @return {string}
 */
function getUrlToDownload(filename, proxyUrl, useProxy) {
  return (useProxy && proxyUrl ? proxyUrl : '') + filename;
}

/**
 * Get filename of a URL
 * @param url
 * @returns {string}
 */
function getFilenameUrl(url) {
  return url.substring(url.lastIndexOf('/') + 1);
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
  return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
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

  // If the request status was changed
  request.addEventListener('readystatechange', () => {
    if (request.readyState === 2 && request.status === 200) {
      // Download is being started
      if (observerMapper['downloadingStarted']) {
        const downloadingStartedObserver = observerMapper['downloadingStarted'];
        widget.observers[downloadingStartedObserver].broadcast(url);
      }
    } else if (request.readyState === 3) {
      // Download is under progress
    } else if (request.readyState === 4) {
      // Downloading has finished
      if (request.response && request.status === 200) {
        const filename = getFilenameUrl(downloadFilename);

        let file = request.response;

        if (!toBlob) {
          // Convert the block object to a file object
          file = blobToFile(file, filename);
          file.url = url;
        }

        /**
         * If a downloadingFinished observer was defined, it will be noticed
         */
        if (observerMapper['downloadingFinished']) {
          const downloadingFinishedObserver = observerMapper['downloadingFinished'];
          widget.observers[downloadingFinishedObserver].broadcast(file);
        }
      } else if (request.status === 404) {
        /**
         * If a downloadingFailed observer was defined, it will be noticed that a downloading process is failed
         */
        if (observerMapper['downloadingFailed']) {
          const downloadingFailedObserver = observerMapper['downloadingFailed'];
          widget.observers[downloadingFailedObserver].broadcast('url_not_found', request.status, request.statusText);
        }
      }
    }
  });

  /**
   * Get and calculate percent of a downloading process
   */
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

      if (error instanceof ProgressEvent) {
        widget.observers[downloadingFailedObserver].broadcast('cors', 0, '');
      } else {
        widget.observers[downloadingFailedObserver].broadcast('url_not_found', 0, '');
      }
    }
  };

  /**
   * Start the AJAX request
   */
  request.start = () => {
    try {
      request.open("GET", downloadFilename, true);
      request.send();
    } catch (err) {
      console.log('downloading failed', err);
    }
  };

  return request;
}

/**
 * Bind context to a function
 * @param func
 * @param context
 * @return {function(): *}
 */
function bind(func, context) {
  return function () {
    return func.apply(context, arguments);
  };
}

/**
 * Get nested object property by string
 * @param o
 * @param s
 * @returns {*}
 */
function byString(o, s) {
  s = s.replace(/^window./g, '');
  s = s.replace(/\[(\w+)\]/g, '.$1'); // Convert indexes to properties
  s = s.replace(/^\./, ''); // Strip a leading dot
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
 * Get HTML element from SVG string
 * @param svg
 * @returns {*}
 */
function svgToHTML(svg) {
  const div = document.createElement('div');
  div.innerHTML = svg.trim();

  const element = div.firstChild;
  const attributes = element.attributes;

  // Return the HTML element and its size params
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
 * @return Promise
 */
function adsBlocked(callback) {
  const testURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

  const myInit = {
    method: 'HEAD',
    mode: 'no-cors'
  };

  const myRequest = new Request(testURL, myInit);

  fetch(myRequest).then(function (response) {
    return response;
  }).then(function (response) {
    callback(false)
  }).catch(function (e) {
    callback(true)
  });
}

/**
 * Convert a string to an object
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

/**
 * Format a date according with given lang
 * @param date
 * @param lang
 * @return {string}
 */
function formatDate(date, lang) {
  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  let timestamp = date;

  if (isNumber(timestamp)) {
    timestamp = new Date();
    timestamp.setTime(date);
  }

  return timestamp.toLocaleDateString(lang, options)
}

/**
 * Save the object in browser memory as a file
 * @param object
 * @param filename
 * @param type
 */
function saveObjectAs(object, filename, type = 'application/json;charset=utf-8') {
  const strObject = JSON.stringify(object, null, 4);
  const file = new Blob([strObject], {
    type
  });
  // If it's EDGE of IE
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

/**
 * Calculate the widget widths
 * @param widgetWidth
 * @param iconWidth
 * @param parent
 * @return {{iconWidth: *, widgetWidth: *, px: {iconWidth: *, widgetWidth: *}, percent: {iconWidth: *, widgetWidth: *}}}
 */
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

  const {
    offsetWidth: parentOffsetWidth
  } = parent;
  let integerWidgetWidth = parseInt(widgetWidth, 10);
  let integerIconWidth = parseInt(iconWidth, 10);

  // If all widgetWidth and iconWidth are in percents
  const widgetWidthIsPercent = widgetWidth && widgetWidth.indexOf('%') !== -1;
  const iconWidthIsPercent = iconWidth && iconWidth.indexOf('%') !== -1;

  if (!iconWidth) {
    results.iconWidth = widgetWidth;
  }

  // If the widths are in pixels and icon is wider than the widget
  /*if (!(iconWidth) || (!widgetWidthIsPercent && !iconWidthIsPercent && integerIconWidth > integerWidgetWidth)) {
    results.iconWidth = widgetWidth;
  } else if (widgetWidthIsPercent && !iconWidthIsPercent) {
    // Calculates the icon width if it was in pixel (f.e. 200px) and the widget is in percent (f.e. 45%)
    // It checks if 200px <= 45% (of the parent element)
    const widgetWidthInPixels = (integerWidgetWidth * parentOffsetWidth) / 100;

    // if it isn't change the icon size
    if (integerIconWidth > widgetWidthInPixels) {
      results.iconWidth = `${widgetWidthInPixels}px`;
    }
  }*/

  integerIconWidth = parseInt(results.iconWidth, 10);

  // Calculate the widget and icon widths in pixels and percents
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

/**
 * Check if the argument is Object
 * TODO: move to a separate type service
 */
function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

/**
 * Return true if a value is really a number
 */
function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Calculate the responsive font size
 * @param elementWidth
 * @param ratio
 * @param maxFontSize
 * @return {number}
 */
function calculateResponsiveFontSize(elementWidth, ratio = 0.08, maxFontSize = 14) {
  const elementFloatWidth = parseFloat(elementWidth);

  // Recalculate the font size of the text zone to make it responsive
  let fontsize = elementFloatWidth * ratio;
  if (fontsize > maxFontSize) {
    fontsize = maxFontSize;
  }

  return fontsize;
}

/**
 *
 * @param parentWidth
 * @param width
 * @return {number}
 */
function getWidthDifference(parentWidth, width) {
  let result = 0;

  if (width.indexOf('%') >= 0) {
    const widthInPercent = parseFloat(width);
    result = parentWidth - ((widthInPercent * width) / 100).toFixed(2)
  } else {
    const widthInPixel = parseFloat(width);
    result = parentWidth - widthInPixel
  }

  return result;
}

function toDataUrl(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

export default {
  bind,
  byString,
  isObject,
  isNumber,
  setTimer,
  svgToHTML,
  translate,
  toDataUrl,
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
  getWidthDifference,
  calculateWidgetWidths,
  calculateResponsiveFontSize,
  parseWidgetAttributeConfiguration
}