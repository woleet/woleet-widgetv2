/**
 * Widget constants and default values
 * */
const PROXY_URL = 'http://localhost:3000/download?url=';
const DEFAULT_WIDGET_LANGUAGE = document.documentElement.lang;

/**
 * Proof verifier widget constants
 * @type {string}
 */
const PROOF_VERIFIER_WIDGET_ID = 'proof-verifier-widget';
const PROOF_VERIFIER_WIDGET_TYPE = 'PROOF_VERIFIER_WIDGET';
const PROOF_VERIFIER_MODE_ICON = 'ICON';
const PROOF_VERIFIER_MODE_BANNER = 'BANNER';
const PROOF_VERIFIER_MODE_FULL = 'FULL';

const PROOF_VERIFIER_DEFAULT_MODE = PROOF_VERIFIER_MODE_ICON;
const PROOF_VERIFIER_WIDGET_MODES = [
  PROOF_VERIFIER_MODE_ICON,
  PROOF_VERIFIER_MODE_BANNER,
  PROOF_VERIFIER_MODE_FULL
];

/**
 * File hasher widget constants
 * @type {string}
 */
const FILE_HASHER_WIDGET_ID = 'file-hasher-widget';
const FILE_HASHER_WIDGET_TYPE = 'FILE_HASHER_WIDGET';

export default {
  PROXY_URL,                    /*export common constants*/
  DEFAULT_WIDGET_LANGUAGE,

  PROOF_VERIFIER_WIDGET_ID,     /*export proof-verifier-widget constants*/
  PROOF_VERIFIER_WIDGET_TYPE,
  PROOF_VERIFIER_DEFAULT_MODE,
  PROOF_VERIFIER_WIDGET_MODES,
  PROOF_VERIFIER_MODE_ICON,
  PROOF_VERIFIER_MODE_BANNER,
  PROOF_VERIFIER_MODE_FULL,

  FILE_HASHER_WIDGET_ID,        /*export file-hasher-widget constants*/
  FILE_HASHER_WIDGET_TYPE,
};
