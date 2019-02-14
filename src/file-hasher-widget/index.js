import constants from '../common/constants'
import loader from '../common/services/loader'
import configurator from '../common/services/configurator'
import utils from '../common/services/utils'
import widgetLogger from '../common/services/logger'
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
  let widgetConfiguration = globalObject[0];
  
  if (!widgetConfiguration)
    widgetLogger.error(`The widget configuration isn't provided`);
  
  /**
   * Initialize the widget
   */
  initialize(widgetConfiguration);
}

/**
 * Load widget libraries and dependencies and initialize the widget
 * @param widgetConfiguration - Custom widget configuration
 */
function initialize(widgetConfiguration) {
  /**
   * Load the widget styles
   */
  addCssLink();
  
  getWidgetDependencies().then(dependencies => {
    const {woleet, i18n, solidIconsModule} = dependencies;
    
    if (!window.woleet) {
      window.woleet = woleet;
    }
    
    if (!window.i18n) {
      window.i18n = i18n;
    }
    
    if (!window.solidIconsModule) {
      window.solidIconsModule = solidIconsModule;
    }
  
    /**
     * Initialize all instances of the widget
     */
    const widgetIds = Object.keys(widgetConfiguration);
    
    widgetIds.forEach(widgetId => {
      const customConfiguration = widgetConfiguration[widgetId];
      customConfiguration.widgetId = widgetId;
      /**
       * Extend the default widget configuration
       */
      let defaultConfiguration = configurator.getFileHasherDefaults();
      const configuration = utils.extendObject(defaultConfiguration, customConfiguration);
      
      console.log('configuration', configuration.lang);
      
      onWidgetInitialized(widgetId, configuration)
    });
  });
}

/**
 * Get all widget library dependencies
 * @returns {Promise<[]>}
 */
function getWidgetDependencies() {
  const dependenciesPromises = [];
  
  dependenciesPromises.push(loader.getWoleetLibs());
  dependenciesPromises.push(loader.getI18nService());
  dependenciesPromises.push(loader.getSolidFontAwesomeIcons());
  
  return Promise.all(dependenciesPromises)
    .then(([woleet, i18n, solidIconsModule]) => {
      const initializationPromises = [];
      /**
       * Configure i18next
       */
      initializationPromises.push(
        i18n.init({fallbackLng: configurator.getDefaultLanguage(), debug: window.dev, resources})
      );
      return Promise.all(initializationPromises)
        .then(() => {return {woleet, i18n, solidIconsModule}})
    });
}

/**
 * It's called when all dependencies are loaded and configuration is defined
 * @param widgetElementId
 * @param configuration
 */
function onWidgetInitialized(widgetElementId, configuration) {
  let widgetElement = document.getElementById(widgetElementId);
  
  if (!widgetElement)
    widgetLogger.error(`Widget Element with id ${widgetElementId} wasn't found`);
  /**
   * Render a widget instance and render it
   */
  while (widgetElement.firstChild) {
    widgetElement.removeChild(widgetElement.firstChild);
  }
  widgetElement.appendChild(new FileHasherWidget(configuration).render());
}

/**
 * Load CSS styles
 * Check if the styles weren't loaded before
 */
function addCssLink() {
  const styleId = `${constants.FILE_HASHER_WIDGET_ID}-style`;
  const script = document.getElementById(constants.FILE_HASHER_WIDGET_ID);
  const style = document.getElementById(styleId);
  
  if (script && script.src && style === null) {
    const styleSrc = script.src.replace('.js', '.css');
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = styleId;
    link.type = 'text/css';
    link.href = styleSrc;
    link.media = 'all';
    head.appendChild(link);
  }
}

window.fileHasherWidget = {
  init: initialize
};

widget(window);
