import constants from '../common/constants'
import loader from '../common/services/loader'
import initializer from '../common/services/initializer'
import utils from '../common/services/utils'
import resources from '../resources/locales'

import FileHasherWidget from './components'

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
  
  getWidgetDependencies(configuration).then(dependencies => {
    const {woleet, i18n} = dependencies;
    
    if (!window.woleet) {
      window.woleet = woleet;
    }
    
    if (!window.i18n) {
      window.i18n = i18n;
    }
    
    onWidgetInitialized(widgetElement, configuration)
  });
}

/**
 * Get all widget library dependencies
 * @returns {Promise<[]>}
 */
function getWidgetDependencies(configuration) {
  const {lang, dev} = configuration;
  const dependenciesPromises = [];
  
  dependenciesPromises.push(loader.getWoleetLibs());
  dependenciesPromises.push(loader.getI18nService());
  
  return Promise.all(dependenciesPromises)
    .then(([woleet, i18n]) => {
      const initializationPromises = [];
      console.log('lang', lang);
      /**
       * Configure i18next
       */
      initializationPromises.push(
        i18n.init({fallbackLng: initializer.getDefaultLanguage(), lng: lang, debug: dev, resources})
      );
      return Promise.all(initializationPromises)
        .then(() => {return {woleet, i18n}})
    });
}

/**
 * It's called when all dependencies are loaded and configuration is defined
 * @param widgetElement
 * @param configuration
 */
function onWidgetInitialized(widgetElement, configuration) {
  addCssLink(configuration.dev);
  
  /**
   * Render a widget instance and render it
   */
  widgetElement.appendChild(new FileHasherWidget(configuration).render());
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
