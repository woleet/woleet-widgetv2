/**
 * Widget constants and default values
 * */
const WIDGET_MODE_ICON = 'ICON';
const WIDGET_MODE_BANNER = 'BANNER';
const WIDGET_MODE_FULL = 'FULL';

const DEFAULT_WIDGET_LANGUAGE = document.documentElement.lang;

const DEFAULT_WIDGET_MODE = WIDGET_MODE_ICON;
const AVAILABLE_WIDGET_MODES = [WIDGET_MODE_ICON, WIDGET_MODE_BANNER, WIDGET_MODE_FULL];

const FILE_HASHER_WIDGET_TYPE = 'FILE_HASHER_WIDGET';
const PROOF_VERIFIER_WIDGET_TYPE = 'PROOF_VERIFIER_WIDGET';

/**
 * TODO: use real urls
 * @type {{css: {file_hasher: string}}}
 */
const URLS = {
  css: {
    file_hasher_widget: '../dist/file-hasher-widget.css',
    proof_verifier_widget: '../dist/proof-verifier-widget.css'
  }
};

const DEV_URLS = {
  css: {
    file_hasher_widget: 'file-hasher-widget.css',
    proof_verifier_widget: 'proof-verifier-widget.css'
  }
};

export default {
  DEFAULT_WIDGET_MODE,
  WIDGET_MODE_ICON,
  WIDGET_MODE_BANNER,
  WIDGET_MODE_FULL,
  AVAILABLE_WIDGET_MODES,
  FILE_HASHER_WIDGET_TYPE,
  PROOF_VERIFIER_WIDGET_TYPE,
  DEFAULT_WIDGET_LANGUAGE,
  DEV_URLS,
  URLS
};
