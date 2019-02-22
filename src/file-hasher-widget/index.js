import constants from 'Common/constants'
import loader from 'Common/services/loader'
import {getDefaultLanguage, getFileHasherDefaults} from 'Common/services/configurator'
import utils from 'Common/services/utils'
import widgetLogger from 'Common/services/logger'
import resources from 'Resources/locales'

import FileHasherWidget from './components'

/**
 * The main entry of the widget
 * @param window
 * @param document
 */
function widget(window, document) {
  /**
   * TODO: customize it somehow
   * @type {string}
   */
  const widgetConfigurations = [];
  const widgetClassName = 'file-hasher-widget';

  /**
   * Grab the object created during the widget creation
   */
  const widgetElementCollection = document.getElementsByClassName(widgetClassName);
  
  if (!widgetElementCollection.length === 0)
    widgetLogger.error(`The widget elements were not found`);

  const widgetElements = [...widgetElementCollection];

  widgetElements.forEach(widgetElement => {
    let widgetConfiguration = widgetElement.getAttribute('config');
    let parsedWidgetConfiguration = JSON.parse(widgetConfiguration);

    if (parsedWidgetConfiguration && parsedWidgetConfiguration.observers) {
      const observerCodes = Object.keys(parsedWidgetConfiguration.observers);

      /**
       * Try to find the observers
       */
      observerCodes.forEach(observerCode => {
        const observerName = parsedWidgetConfiguration.observers[observerCode];
        parsedWidgetConfiguration.observers[observerCode] = utils.byString(window, observerName) || function() {};
      })
    }

    widgetConfigurations.push({
      el: widgetElement,
      id: parsedWidgetConfiguration.id || utils.getUniqueId(widgetClassName + '-'),
      config: parsedWidgetConfiguration
    });
  });

  console.log('widgetConfigurations', widgetConfigurations);
  
  /**
   * Initialize the widget
   */
  loadDependencies()
    .then(response => initialize(widgetConfigurations));
}

/**
 * Load widget styles, libraries and dependencies
 */
function loadDependencies() {
  /**
   * Load the widget styles
   */
  addCssLink();
  
  return getWidgetDependencies().then(dependencies => {
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

    return new Promise((resolve, reject) => resolve(true));
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
        i18n.init({fallbackLng: getDefaultLanguage(), debug: window.dev, resources})
      );
      return Promise.all(initializationPromises)
        .then(() => {return {woleet, i18n, solidIconsModule}})
    });
}

/**
 * Initialize the widget
 * @param widgetConfigurations
 */
function initialize(widgetConfigurations) {
  /**
   * Initialize all instances of the widget
   */
  widgetConfigurations.forEach(widgetConfiguration => {
    const {config: customConfiguration, el: widgetElement, id: widgetId} = widgetConfiguration;
    customConfiguration.widgetId = widgetId;
    /**
     * Extend the default widget configuration
     */
    const defaultConfiguration = getFileHasherDefaults();
    const configuration = utils.extendObject(defaultConfiguration, customConfiguration);

    if (!widgetElement)
      widgetLogger.error(`Widget element wasn't found`);

    /**
     * Render a widget instance and render it
     */
    while (widgetElement.firstChild) {
      widgetElement.removeChild(widgetElement.firstChild);
    }
    widgetElement.appendChild(new FileHasherWidget(configuration).render());
  });
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

widget(window, document);
