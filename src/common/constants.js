/**
 * Widget constants and default values
 * */
const PROXY_URL = 'http://localhost:3000/download?url=';
const DEFAULT_WIDGET_LANGUAGE = document.documentElement.lang;

/**
 * File hasher widget constants
 * @type {string}
 */
const FILE_HASHER_WIDGET_ID = 'file-hasher-widget';
const FILE_HASHER_WIDGET_TYPE = 'FILE_HASHER_WIDGET';

export default {
  PROXY_URL,
  DEFAULT_WIDGET_LANGUAGE,

  FILE_HASHER_WIDGET_ID, /* export file-hasher-widget constants */
  FILE_HASHER_WIDGET_TYPE
};
