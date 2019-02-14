import constants from "../constants";

const fileHasherWidgetConfiguration = {
  provenFile: null,
  lang: constants.DEFAULT_WIDGET_LANGUAGE,
  type: constants.FILE_HASHER_WIDGET_TYPE
};

class ConfigurationService {
  constructor() {
    this.configuration = [];
  }
  
  getFileHasherDefaults() {
    return fileHasherWidgetConfiguration;
  }
  
  getDefaultLanguage() {
    return constants.DEFAULT_WIDGET_LANGUAGE;
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

let configurator = new ConfigurationService();

export default configurator;
