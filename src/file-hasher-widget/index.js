import constants from 'Common/constants';
import fileHasherDefaults from 'FileHasherWidget/defaults';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';
import FileHasherWidget from './components';

const fileHashers = [];

/**
 * Main entry point of the file hasher widget
 * @param window
 * @param document
 */
function widget(window, document) {
  // Build the configurations for all instances of the widget
  const widgetConfigurations = [];
  Array.from(document.getElementsByClassName(constants.FILE_HASHER_WIDGET))
    .forEach(widgetElement => {
      let widgetConfiguration = utils.parseWidgetAttributeConfiguration(widgetElement);
      if (widgetConfiguration && widgetConfiguration.observers) {
        const observerCodes = Object.keys(widgetConfiguration.observers);
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

  // Load all dependencies then initialize all the instances of the widget
  loadDependencies()
    .then(() => init(widgetConfigurations));
}

/**
 * Load widget styles, libraries and dependencies
 */
function loadDependencies() {
  // Load the CSS styles
  const sourceLink = addCssLink();
  if (!window['file-hasher-widget-source'] && sourceLink !== null) {
    window['file-hasher-widget-source'] = sourceLink;
  }
  return new Promise((resolve) => resolve(true));
}

/**
 * Load the CSS styles
 * Check if the styles weren't loaded before
 */
function addCssLink() {
  const script = document.getElementById(constants.FILE_HASHER_WIDGET);
  const styleId = `${constants.FILE_HASHER_WIDGET}-style`;
  const style = document.getElementById(styleId);
  let sourcePath = null;

  // If file hasher's JS script is imported but not its CSS style sheet
  if (script && script.src && style === null) {
    // Grab the URL of the JS file and generate the CSS path
    const styleSrc = script.src.replace('.js', '.css');
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    sourcePath = utils.getFilePathFromUrl(script.src);

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

/**
 * Initialize all the instances of the widget
 * @param widgetConfigurations
 */
function init(widgetConfigurations) {
  // For all widget instances
  widgetConfigurations.forEach(widgetConfiguration => {
    // Get instance configuration
    const uniqueWidgetId = utils.getUniqueId(`${constants.FILE_HASHER_WIDGET}-`);
    const {
      el: widgetElement,
      id: widgetId = uniqueWidgetId,
      config: widgetConfig = {}
    } = widgetConfiguration;

    // Check that widget element is present
    if (!widgetElement) {
      widgetLogger.error('Widget element not found');
      return;
    }

    // Deep merge the fileHasherDefaults into a new object
    // to prevent the modification of the fileHasherDefaults properties by the widget config
    const configuration = {};
    utils.mergeDeep(configuration, fileHasherDefaults);

    // Extend the default config with widget config
    utils.mergeDeep(configuration, widgetConfig);
    configuration.widgetId = widgetId;

    // Render the widget instance (remove all children before)
    while (widgetElement.firstChild) {
      widgetElement.removeChild(widgetElement.firstChild);
    }
    const fileHasherWidget = new FileHasherWidget(configuration);
    widgetElement.appendChild(fileHasherWidget.render());
    fileHashers.push(fileHasherWidget);
  });
}

/**
 * Reset an instance of the widget
 * @param id identifier of the widget
 */
function reset(id) {
  fileHashers.forEach(fileHasher => {
    if (fileHasher.configuration.widgetId === id) {
      fileHasher.reset();
    }
  });
}

// Create the methods to initialize and reset the widget from JS code
window.fileHasherWidget = {
  init: init,
  reset: reset
};

widget(window, document);
