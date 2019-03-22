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
   * Get the widget configuration
   * @returns {*}
   */
  get() {
    if (this.configuration) {
      return this.configuration;
    }
    return {};
  }
  
  /**
   * Get the widget styles
   * @returns {*}
   */
  getStyles() {
    if (this.configuration && this.configuration.styles) {
      return this.configuration.styles;
    }
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

export default ConfigurationService;
