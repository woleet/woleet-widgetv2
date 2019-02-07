import constants from '../common/constants'
import loader from '../common/services/loader'
import utils from '../common/services/utils'

import { displayIcon } from './components/main'

/**
 * The main entry of the application
 * @param window
 */
function app(window) {
  let configuration = {
    mode: constants.DEFAULT_WIDGET_MODE,
    lang: document.documentElement.lang,
    type: constants.FILE_HASHER_WIDGET_TYPE,
    colors: {
      'primary-color': '#3A98D8',
      'secondary-color': '#3A98D8',
      'third-color': '#3A98D8'
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

  configuration = utils.extendObject(configuration, customConfiguration);
  globalObject.configuration = configuration;
  globalObject.widgetElement = widgetElement;
  
  /**
   * TODO: refactor this
   * */
  if(configuration.mode !== constants.WIDGET_MODE_ICON) {
    loader.getWoleetLibs().then(woleet => {
      globalObject.woleet = woleet;
      onAppLoaded(globalObject);
    });
  } else {
    onAppLoaded(globalObject);
  }
}

function onAppLoaded(globalObject) {
  addCssLink(globalObject.configuration.dev);
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
