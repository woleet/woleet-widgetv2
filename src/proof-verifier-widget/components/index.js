import ConfigurationService from 'Common/services/configurator';
import VirtualDOMService from 'Common/services/virtual-dom';
import EventObserver from 'Common/patterns/event-observer';
import utils from 'Common/services/utils';
import constants from "Common/constants";
import styleCodes from './style-codes';
import styles from './index.scss';
import IconContainer from './icon-container';
import BannerContainer from './banner-container';
import PanelContainer from './panel-container';

/**
 * Define a class of the widget
 */
class ProofVerifierWidget {
  constructor(configuration) {
    this.widgetId = configuration.widgetId;
    this.configurator = new ConfigurationService();
    this.configuration = configuration;
    this.observers = {};
  
    this.configurator.init(configuration);
    
    this.initializeObservers();
    this.initializeExternalObservers(configuration);
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
  
  render() {
    const element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    element.attr('id', this.widgetId);
    element.style({width: `${this.configuration.styles.width}`});

    console.log('this.configuration', this.configuration);

    switch (this.configuration.mode) {
      case constants.PROOF_VERIFIER_MODE_BANNER:
        element.container = (new BannerContainer(this)).get();
        break;
      case constants.PROOF_VERIFIER_MODE_PANEL:
        element.container = (new PanelContainer(this)).get();
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
      default:
        element.container = (new IconContainer(this)).get();
        break;
    }
    
    return element.render();
  }
}

export default ProofVerifierWidget;
