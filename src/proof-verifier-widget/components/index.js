import ConfigurationService from 'Common/services/configurator';
import VirtualDOMService from 'Common/services/virtual-dom';
import EventObserver from 'Common/patterns/event-observer';
import utils from 'Common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';
import WidgetContainer from "ProofVerifierComponents/widget-container";

/**
 * Define a class of the widget
 */
class ProofVerifierWidget {
  constructor(configuration) {
    this.widgetId = configuration.widgetId;
    this.configurator = new ConfigurationService();
    this.configuration = configuration;
    this.observers = {};
    this.element = null;
  
    const declaration = document.styleSheets[0].rules[0];
  
    console.log('constructor configuration', this.configuration, declaration);
  
    this.configurator.init(configuration);
    
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    this.element.attr('id', this.widgetId);
  
    this.element.container = (new WidgetContainer(this)).get();
  
    this.initializeObservers();
    this.initializeExternalObservers(this.configuration);
  }
  
  initializeObservers() {
    /**
     * Initialize the widget observers
     * @type {EventObserver}
     */
    this.observers = {
    };
  }
  
  initializeExternalObservers(configuration) {
    const self = this;
    if (configuration.observers) {
      const observerNames = Object.keys(configuration.observers);
      
      observerNames.forEach(observerName => {
        const observer = configuration.observers[observerName];
        switch (observerName.toLowerCase()) {
          default:
            break;
        }
      });
    }
  }
  
  get() {
    return this.element;
  }
  
  render() {
    return this.element.render();
  }
}

export default ProofVerifierWidget;
