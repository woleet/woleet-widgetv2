import constants from 'Common/constants'
import { getDefaultLanguage } from 'Common/services/configurator'
import loader from 'Common/services/loader'
import {getProofVerifierWidgetDefaults} from 'ProofVerifierWidget/defaults'
import utils from 'Common/services/utils'
import widgetLogger from 'Common/services/logger'
import resources from 'Resources/locales'
import from from 'core-js/features/array/from'

import ProofVerifierWidget from './components'

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
  const widgetClassName = 'proof-verifier-widget';

  /**
   * Grab the object created during the widget creation
   */
  const widgetElementCollection = document.getElementsByClassName(widgetClassName);

  if (!widgetElementCollection.length === 0)
    widgetLogger.error(`The widget elements were not found`);

  const widgetElements = from(widgetElementCollection);

  widgetElements.forEach(widgetElement => {
    let widgetConfiguration = utils.parseWidgetAttributeConfiguration(widgetElement);

    if (widgetConfiguration && widgetConfiguration.observers) {
      const observerCodes = Object.keys(widgetConfiguration.observers);

      /**
       * Try to find the observers
       */
      observerCodes.forEach(observerCode => {
        const observerName = widgetConfiguration.observers[observerCode];
        widgetConfiguration.observers[observerCode] = utils.byString(window, observerName) || function() {};
      })
    }

    widgetConfigurations.push({
      el: widgetElement,
      id: widgetConfiguration.id || utils.getUniqueId(widgetClassName + '-'),
      config: widgetConfiguration
    });
  });

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
  const sourceLink = addCssLink();

  return getWidgetDependencies()
    .then(dependencies => {
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

      if (!window['proof-verifier-widget-source'] && sourceLink !== null) {
        window['proof-verifier-widget-source'] = sourceLink;
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
    const configuration = getProofVerifierWidgetDefaults();
    utils.extendObject(configuration, customConfiguration);

    if (!widgetElement)
      widgetLogger.error(`Widget element wasn't found`);

    console.log('configuration', configuration);

    /**
     * Render a widget instance and render it
     */
    while (widgetElement.firstChild) {
      widgetElement.removeChild(widgetElement.firstChild);
    }
    widgetElement.appendChild(new ProofVerifierWidget(configuration).render());
  });
}

/**
 * Load CSS styles
 * Check if the styles weren't loaded before
 */
function addCssLink() {
  const styleId = `${constants.PROOF_VERIFIER_WIDGET_ID}-style`;
  const script = document.getElementById(constants.PROOF_VERIFIER_WIDGET_ID);
  const style = document.getElementById(styleId);
  let sourcePath = null;

  if (script && script.src && style === null) {
    const styleSrc = script.src.replace('.js', '.css');
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');

    sourcePath = utils.getFilenameSource(script.src);

    link.rel = 'stylesheet';
    link.id = styleId;
    link.type = 'text/css';
    link.href = styleSrc;
    link.media = 'all';
    head.appendChild(link);
  }

  return sourcePath;
}

window.fileHasherWidget = {
  init: initialize
};

widget(window, document);
