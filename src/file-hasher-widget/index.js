import constants from 'Common/constants';
import { getFileHasherDefaults } from 'FileHasherWidget/defaults';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';

import FileHasherWidget from './components';

const fileHashers = [];

/**
 * The main entry of the widget
 * @param window
 * @param document
 */
function widget(window, document) {
  // Grab the object created during the widget creation
  const widgetElementCollection = document.getElementsByClassName(constants.FILE_HASHER_WIDGET_ID);

  // Initialize and configure all instances of the widget
  const widgetConfigurations = [];
  const widgetElements = Array.from(widgetElementCollection);
  widgetElements.forEach(widgetElement => {
    let widgetConfiguration = utils.parseWidgetAttributeConfiguration(widgetElement);
    if (widgetConfiguration && widgetConfiguration.observers) {
      const observerCodes = Object.keys(widgetConfiguration.observers);
      observerCodes.forEach(observerCode => {
        const observerName = widgetConfiguration.observers[observerCode];
        widgetConfiguration.observers[observerCode] = utils.byString(window, observerName) || function () {
        };
      });
    }
    widgetConfigurations.push({
      el: widgetElement,
      id: widgetConfiguration.id,
      config: widgetConfiguration
    });
  });

  // Load all dependencies then initialize the widget
  loadDependencies()
    .then(() => initialize(widgetConfigurations));
}

/**
 * Load widget styles, libraries and dependencies
 */
function loadDependencies() {
  // Load the widget styles
  const sourceLink = addCssLink();
  if (!window['file-hasher-widget-source'] && sourceLink !== null) {
    window['file-hasher-widget-source'] = sourceLink;
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
    const uniqueWidgetId = utils.getUniqueId(`${constants.FILE_HASHER_WIDGET_ID}-`);
    const {
      config: customConfiguration,
      el: widgetElement,
      id: widgetId = uniqueWidgetId
    } = widgetConfiguration;

    if (!widgetElement) {
      widgetLogger.error('Widget element not found');
      return;
    }

    customConfiguration.widgetId = widgetId;

    // Extend the default widget configuration by user settings
    const configuration = getFileHasherDefaults();
    utils.extendObject(configuration, customConfiguration);

    // Render a widget instance and render it but remove all children before
    while (widgetElement.firstChild) {
      widgetElement.removeChild(widgetElement.firstChild);
    }
    const fileHasherWidget = new FileHasherWidget(configuration);
    widgetElement.appendChild(fileHasherWidget.render());
    fileHashers.push(fileHasherWidget);
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

function reset(id) {
  fileHashers.forEach(fileHasher => {
    if (fileHasher.configuration.id === id) {
      fileHasher.reset();
    }
  });
}

// Create the method to initialize and reset the widget in js code
window.fileHasherWidget = {
  init: initialize,
  reset: reset
};

widget(window, document);
