import constants from '../common/constants'
import loader from '../common/services/loader'
import initializer from '../common/services/initializer'
import utils from '../common/services/utils'

import { fileHasherWidget } from './components'

/**
 * The main entry of the widget
 * @param window
 */
function widget(window) {
  /**
   * Grab the object created during the widget creation
   */
  let globalObject = window[window['file-hasher-widget']];
  
  let widgetClass = globalObject[0];
  let customConfiguration = globalObject[1] || {};
  
  if (!widgetClass)
    throw Error(`The widget class wasn't provided`);
  
  let widgetElement = document.getElementsByClassName(widgetClass)[0];
  
  if (!widgetElement)
    throw Error(`Widget Element with class ${widgetClass} wasn't found`);
  
  /**
   * Initialize the widget
   */
  initialize(widgetElement, customConfiguration);
}

/**
 * Load widget libraries and dependencies
 * @param widgetElement - The HTML element into which the widget is injected
 * @param customConfiguration - Custom widget configuration
 */
function initialize(widgetElement, customConfiguration) {
  /**
   * Extend the default widget configuration
   */
  let defaultConfiguration = initializer.getFileHasherDefaults();
  const configuration = utils.extendObject(defaultConfiguration, customConfiguration);
  
  getWidgetDependencies().then(dependencies => {
    onWidgetInitialized(widgetElement, configuration, dependencies)
  });
}

/**
 * Get all widget library dependencies
 * @returns {Promise<[]>}
 */
function getWidgetDependencies() {
  const promises = [];
  
  promises.push(loader.getWoleetLibs());
  promises.push(loader.getI18mService());
  
  return Promise.all(promises);
}

/**
 * It's called when all dependencies are loaded and configuration is defined
 * @param widgetElement
 * @param configuration
 * @param dependencies
 */
function onWidgetInitialized(widgetElement, configuration, dependencies) {
  console.log('dependencies', dependencies);
  
  addCssLink(configuration.dev);
  fileHasherWidget(widgetElement, configuration, dependencies);
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

widget(window);
