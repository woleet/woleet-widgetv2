import constants from '../common/constants'
import loader from '../common/services/loader'
import utils from '../common/services/utils'

import { displayIcon } from './components/main'

/**
 * The main entry of the application
 * @param window
 */
function app(window) {
  let configurations = {
    mode: constants.DEFAULT_WIDGET_MODE,
    lang: document.documentElement.lang,
    type: constants.FILE_HASHER_WIDGET_TYPE,
    colors: {
      'primary-color': '#ADFF2F',
      'secondary-color': '#9ACD32',
      'link-color': '#98FB98'
    }
  };
  
  let globalObject = window[window['file-hasher-widget']];
  /**
   * TODO: handle all errors
   * */
  let widgetClass = globalObject[0];
  let customConfiguration = globalObject[1];
  let widgetElement = document.getElementsByClassName(widgetClass)[0];
  
  if (!widgetElement)
    throw Error(`Widget Element with class ${widgetClass} wasn't found`);

  configurations = utils.extendObject(configurations, customConfiguration);
  globalObject.configurations = configurations;
  globalObject.widgetElement = widgetElement;
  
  /**
   * TODO: refactor this
   * */
  if(configurations.mode !== constants.WIDGET_MODE_ICON) {
    loader.getWoleetLibs().then(woleet => {
      globalObject.woleet = woleet;
      onAppLoaded(globalObject);
    });
  } else {
    onAppLoaded(globalObject);
  }
}

function onAppLoaded(globalObject) {
  addCssLink(globalObject.configurations.dev);
  displayIcon(globalObject);
}

/**
 * Load CSS styles
 */
function addCssLink(isDevMode) {
  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = constants[isDevMode ? 'DEV_URLS' : 'URLS'].css.file_hasher_widget;
  link.media = 'all';
  head.appendChild(link);
}

app(window);
