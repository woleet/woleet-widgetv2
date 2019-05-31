import constants from 'Common/constants'
import { getDefaultLanguage } from 'Common/services/configurator'
import { getFileHasherDefaults } from 'FileHasherWidget/defaults'
import utils from 'Common/services/utils'
import widgetLogger from 'Common/services/logger'
import resources from 'Resources/locales'
import i18next from 'i18next';

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
  const widgetClassName = constants.FILE_HASHER_WIDGET_ID;

  /**
   * Grab the object created during the widget creation
   */
  const widgetElementCollection = document.getElementsByClassName(widgetClassName);
  
  if (!widgetElementCollection.length === 0)
    widgetLogger.error(`The widget elements were not found`);

  const widgetElements = Array.from(widgetElementCollection);

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
      id: widgetConfiguration.id,
      config: widgetConfiguration
    });
  });
  
  /**
   * Initialize the widget
   */
  loadDependencies()
    .then(() => initialize(widgetConfigurations));
}

/**
 * Load widget styles, libraries and dependencies
 */
function loadDependencies() {
  /**
   * Load the widget styles
   */
  const sourceLink = addCssLink();
  
  i18next.init({fallbackLng: getDefaultLanguage(), debug: window.dev, resources});
  
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
  /**
   * Initialize all instances of the widget
   */
  widgetConfigurations.forEach(widgetConfiguration => {
    const uniqueWidgetId = utils.getUniqueId(`${constants.FILE_HASHER_WIDGET_ID}-`);
    const {config: customConfiguration, el: widgetElement, id: widgetId = uniqueWidgetId} = widgetConfiguration;

    if (!widgetElement) {
      widgetLogger.error(`Widget element wasn't found`);
    }

    customConfiguration.widgetId = widgetId;
    /**
     * Extend the default widget configuration
     */
    const configuration = getFileHasherDefaults();
    utils.extendObject(configuration, customConfiguration);
  
    const {icon: { width: iconWidth }, width: widgetWidth } = configuration.styles;
    const widgetWidths = calculateWidgetWidths(widgetWidth, iconWidth, widgetElement, widgetId);

    if (widgetWidths && widgetWidths.iconWidth) {
      configuration.styles.icon.width = widgetWidths.iconWidth;
    }

    console.log(`Configuration of the widget "${widgetId}"`, configuration);

    /**
     * Render a widget instance and render it
     */
    while (widgetElement.firstChild) {
      widgetElement.removeChild(widgetElement.firstChild);
    }
    widgetElement.appendChild(new FileHasherWidget(configuration).render());
  });
}

function calculateWidgetWidths(widgetWidth, iconWidth, parent, id) {
  const results = {
    widgetWidth,
    iconWidth
  };

  const widgetWidthIsPercent = widgetWidth && widgetWidth.indexOf('%') !== -1;
  const iconWidthIsPercent = iconWidth && iconWidth.indexOf('%') !== -1;

  if (!(iconWidth) || (!widgetWidthIsPercent && !iconWidthIsPercent &&
    parseInt(iconWidth, 10) > parseInt(widgetWidth, 10))) {
    results.iconWidth = widgetWidth;
  } else if (widgetWidthIsPercent && !iconWidthIsPercent) {
    const widgetWidthInPixels = (parseInt(widgetWidth, 10) * parent.offsetWidth) / 100;

    if (parseInt(iconWidth, 10) > widgetWidthInPixels) {
      results.iconWidth = `${widgetWidthInPixels - 6}px`;
    }
  }

  return results;
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
