import ConfigurationService from 'Common/services/configurator';
import VirtualDOMService from 'Common/services/virtual-dom';
import EventObserver from 'Common/patterns/event-observer';
import utils from 'Common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';
import WidgetContainer from "ProofVerifierComponents/widget-container";
import ErrorContainer from "ProofVerifierWidget/components/error-container";

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
    this.configurator.init(configuration);

    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    const widgetStyles = this.configurator.getStyles();

    this.initializeObservers();
    this.initializeExternalObservers(this.configuration);

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    this.element.attr('id', this.widgetId);
    this.element.style({width: `${widgetStyles.icon.width}`});

    // Create the widget container
    this.element.container = (new WidgetContainer(this)).get();
    // Container to display widget errors
    this.element.errorContainer = (new ErrorContainer(this)).get();

    this.observers.widgetInitializedObserver.broadcast();
  }

  /**
   * Initialize the widget observers
   */
  initializeObservers() {
    this.observers = {
      // Events: errors
      errorCaughtObserver: new EventObserver(),
      errorHiddenObserver: new EventObserver(),
      // Events: widget
      widgetInitializedObserver: new EventObserver(),
      // Events: user actions
      iconClickedObserver: new EventObserver(),
      bannerClickedObserver: new EventObserver(),
      // Events: receipt
      receiptDownloadingFinishedObserver: new EventObserver(),
      receiptDownloadingFailedObserver: new EventObserver(),
      receiptParsedObserver: new EventObserver(),
      receiptVerifiedObserver: new EventObserver(),
    };
  }

  /**
   * Link all external events
   * @param configuration
   */
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
