/**
 * Widget constants and default values
 * */
const WIDGET_MODE_ICON = 'ICON';
const WIDGET_MODE_BANNER = 'BANNER';
const WIDGET_MODE_FULL = 'FULL';

const DEFAULT_WIDGET_MODE = WIDGET_MODE_ICON;
const AVAILABLE_WIDGET_MODES = [WIDGET_MODE_ICON, WIDGET_MODE_BANNER, WIDGET_MODE_FULL];

/**
 * TODO: use real urls
 * @type {{css: {file_hasher: string}}}
 */
const URLS = {
  css: {
    file_hasher: '../dist/main.css'
  }
};

export default {
  DEFAULT_WIDGET_MODE,
  WIDGET_MODE_ICON,
  WIDGET_MODE_BANNER,
  WIDGET_MODE_FULL,
  AVAILABLE_WIDGET_MODES,
  URLS
};
