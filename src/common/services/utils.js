const previewableFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/svg', 'application/pdf'];

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
  });
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
  const uniqueId = (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());

  return prefix + uniqueId + suffix;
}

/**
 * Generate random string
 * @returns {string}
 */
function s4() {
  // eslint-disable-next-line no-bitwise
  return (((1 + Math.random()) * 0x10000) | 0)
    .toString(16)
    .substring(1);
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
 * Get an URL allowing to download a file using the proxy server.
 * @param filename
 * @param proxyUrl
 * @param useProxy
 * @return {string}
 */
function getUrlToDownload(filename, proxyUrl, useProxy) {
  return (useProxy && proxyUrl ? proxyUrl : '') + filename;
}

/**
 * Try to extract the name of the file targeted by an URL.
 * @param url
 * @returns {string}
 */
function getFileNameFromUrl(url) {
  const testRegEx = /^.*\.*/;
  const filename = url.substring(url.lastIndexOf('/') + 1);
  return testRegEx.test(filename) ? filename : null;
}

/**
 * Get the path of the file targeted by an URL.
 * @param url
 * @returns {string}
 */
function getFilePathFromUrl(url) {
  return url.substring(0, url.lastIndexOf('/'));
}

/**
 * Check if a file can be previewed.
 * @param file
 * @returns {boolean}
 */
function isPreviewable(file) {
  const {
    type: filetype
  } = file;
  return previewableFileTypes.includes(filetype);
}

/**
 * @param downloadFilename
 * @param widget
 * @param observerMapper
 * @param url
 * @param toBlob
 * @returns {XMLHttpRequest}
 */
function getHttpRequest(downloadFilename, widget, observerMapper, filename = null, url = false, toBlob = false) {
  let request = new XMLHttpRequest();

  // If the request status was changed
  request.addEventListener('readystatechange', () => {
    if (request.readyState === 2 && request.status === 200) {
      // Download is being started
      if (observerMapper.downloadingStarted) {
        const downloadingStartedObserver = observerMapper.downloadingStarted;
        widget.observers[downloadingStartedObserver].broadcast(url);
      }
    } else if (request.readyState === 3) {
      // Download is under progress
    } else if (request.readyState === 4) {
      // Downloading has finished
      if (request.response && request.status === 200) {
        filename = filename || getFileNameFromUrl(downloadFilename);

        let file = request.response;

        if (!toBlob) {
          // Convert the block object to a file object
          file = blobToFile(file, filename);
          file.url = url;
        }

        /**
         * If a downloadingFinished observer was defined, it will be noticed
         */
        if (observerMapper.downloadingFinished) {
          const downloadingFinishedObserver = observerMapper.downloadingFinished;
          widget.observers[downloadingFinishedObserver].broadcast(file);
        }
      } else if (request.status === 404) {
        /**
         * If a downloadingFailed observer was defined, it will be noticed that a downloading process is failed
         */
        if (observerMapper.downloadingFailed) {
          const downloadingFailedObserver = observerMapper.downloadingFailed;
          widget.observers[downloadingFailedObserver].broadcast('url_not_found', request.status, request.statusText);
        }
      } else if (request.status === 403) {
        if (observerMapper.downloadingFailed) {
          const downloadingFailedObserver = observerMapper.downloadingFailed;
          widget.observers[downloadingFailedObserver].broadcast('forbidden', request.status, request.statusText);
        }
      } else if (observerMapper.downloadingFailed) {
        const downloadingFailedObserver = observerMapper.downloadingFailed;
        widget.observers[downloadingFailedObserver].broadcast('download_unavailable', request.status, request.statusText);
      }
    }
  });

  /**
   * Get and calculate percent of a downloading process
   */
  request.addEventListener('progress', function (evt) {
    if (evt.lengthComputable) {
      const percentComplete = parseInt((evt.loaded / evt.total) * 100, 10);
      if (observerMapper.downloadingProgress) {
        const downloadingProgressObserver = observerMapper.downloadingProgress;
        widget.observers[downloadingProgressObserver].broadcast(percentComplete);
      }
    }
  }, false);

  request.responseType = 'blob';

  request.onerror = function (error) {
    if (observerMapper.downloadingFailed) {
      const downloadingFailedObserver = observerMapper.downloadingFailed;

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
      request.open('GET', downloadFilename, true);
      request.send();
    } catch (err) {
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

  fetch(myRequest)
    .then(function (response) {
      return response;
    })
    .then(function () {
      callback(false);
    })
    .catch(function () {
      callback(true);
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
 * Check if the argument is Object
 * TODO: move to a separate type service
 */
function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

export default {
  byString,
  isObject,
  blobToFile,
  adsBlocked,
  getUniqueId,
  mergeDeep,
  defineProperty,
  getHttpRequest,
  extractClasses,
  getFileNameFromUrl,
  getUrlToDownload,
  getFilePathFromUrl,
  getObjectByString,
  parseWidgetAttributeConfiguration,
  isPreviewable
};
