import constants from 'ProofVerifierWidget/services/constants';
import { getDefaultLanguage } from 'Common/services/configurator';
import { getProofVerifierWidgetDefaults } from 'ProofVerifierWidget/defaults';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';
import resources from 'Resources/locales';
import i18next from 'i18next';

import ProofVerifierWidget from './components';

/**
 * The main entry of the widget
 * @param window
 * @param document
 */
function widget(window, document) {
  const widgetConfigurations = [];
  const widgetClassName = 'proof-verifier-widget';

  // Grab the object created during the widget creation
  const widgetElementCollection = document.getElementsByClassName(widgetClassName);

  if (!widgetElementCollection.length === 0) { widgetLogger.error('The widget elements were not found'); }

  // Convert the element collection to an array
  const widgetElements = Array.from(widgetElementCollection);

  // Initialize and configure all instances of the widget
  widgetElements.forEach(widgetElement => {
    let widgetConfiguration = utils.parseWidgetAttributeConfiguration(widgetElement);

    if (widgetConfiguration && widgetConfiguration.observers) {
      const observerCodes = Object.keys(widgetConfiguration.observers);

      // Try to find the widget observers
      observerCodes.forEach(observerCode => {
        const observerName = widgetConfiguration.observers[observerCode];
        widgetConfiguration.observers[observerCode] = utils.byString(window, observerName) || function () {};
      });
    }

    widgetConfigurations.push({
      el: widgetElement,
      id: widgetConfiguration.id,
      config: widgetConfiguration
    });
  });

  // Initialize the widget but load all dependencies before
  loadDependencies()
    .then(() => initialize(widgetConfigurations));
}

/**
 * Load widget styles, libraries and dependencies
 */
function loadDependencies() {
  // Load the widget styles
  const sourceLink = addCssLink();

  // Initialize the translation library
  i18next.init({ fallbackLng: getDefaultLanguage(), debug: window.dev, resources });

  if (!window['proof-verifier-widget-source'] && sourceLink !== null) {
    window['proof-verifier-widget-source'] = sourceLink;
  }

  return new Promise((resolve) => resolve(true));
}

/**
 * Initialize the widget
 * @param widgetConfigurations
 */
function initialize(widgetConfigurations) {
  // Initialize all instances of the widget
  widgetConfigurations.forEach(widgetConfiguration => {
    const uniqueWidgetId = utils.getUniqueId(`${constants.PROOF_VERIFIER_WIDGET_ID}-`);
    const { config: customConfiguration, el: widgetElement, id: widgetId = uniqueWidgetId } = widgetConfiguration;

    if (!widgetElement) {
      widgetLogger.error('Widget element wasn\'t found');
    }

    customConfiguration.widgetId = widgetId;

    // Extend the default widget configuration by user settings
    const configuration = getProofVerifierWidgetDefaults();
    utils.extendObject(configuration, customConfiguration);

    if (!widgetElement) {
      widgetLogger.error('Widget element wasn\'t found');
    }

    /**
     * If the banner height wasn't define, set it to icon height
     */
    if (!configuration.styles.banner.height) {
      const styles = configuration.styles;
      configuration.styles.banner.height = styles.icon.height;
    }

    /**
     * If the panel width wasn't define, calculate it as icon width + banner width
     */
    if (!configuration.styles.panel.width) {
      const styles = configuration.styles;
      configuration.styles.panel.width = parseInt(styles.icon.width, 10) + parseInt(styles.banner.width, 10) + 'px';
    }

    console.log('configuration', configuration);

    // Render a widget instance and render it but remove all children before
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

  // Check it js link exists
  if (script && script.src && style === null) {
    // Grab the url of js file and generate the css path
    const styleSrc = script.src.replace('.js', '.css');
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');

    sourcePath = utils.getFilenameSource(script.src);

    // Then append it to the HTML code
    link.rel = 'stylesheet';
    link.id = styleId;
    link.type = 'text/css';
    link.href = styleSrc;
    link.media = 'all';
    head.appendChild(link);
  }

  return sourcePath;
}

// Create the method to initialize the widget in js code
window.fileVerifierWidget = {
  init: initialize
};

widget(window, document);
