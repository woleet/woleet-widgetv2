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
    return null;
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
