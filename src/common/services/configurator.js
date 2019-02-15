import constants from "../constants";

const fileHasherWidgetConfiguration = {
  provenFile: null,
  lang: constants.DEFAULT_WIDGET_LANGUAGE,
  type: constants.FILE_HASHER_WIDGET_TYPE
};

function getFileHasherDefaults() {
  return fileHasherWidgetConfiguration;
}

function getDefaultLanguage() {
  return constants.DEFAULT_WIDGET_LANGUAGE;
}

class ConfigurationService {
  constructor() {
    this.configuration = [];
  }
  
  /**
   * Initialize the instance
   * @param configuration
   */
  init(configuration) {
    this.configuration = configuration;
  }
  
  /**
   * Initialize the widget language
   * @returns {*}
   */
  getLanguage() {
    if (this.configuration && this.configuration.lang) {
      return this.configuration.lang;
    }
    return this.getDefaultLanguage();
  }
  
  /**
   * Get observers
   * @returns {*}
   */
  getObservers() {
    if (this.configuration && this.configuration.observers) {
      return this.configuration.observers;
    }
    return {};
  }
}

export {
  getFileHasherDefaults,
  getDefaultLanguage
}

export default ConfigurationService;
