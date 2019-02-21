import ConfigurationService from 'Common//services/configurator';
import virtualDOMService from 'Common/services/virtual-dom';
import EventObserver from "Common/patterns/event-observer";
import utils from 'Common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';

import DropContainer from './drop-container';
import TitleContainer from './title-container';
import ProgressBarContainer from "./progress-bar-container";
import ErrorContainer from "./error-container";

/**
 * Define a class of the widget
 */
class FileHasherWidget {
  constructor(configuration) {
    this.widgetId = configuration.widgetId;
    this.configurator = new ConfigurationService();
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
      dropContainerHashingProgressObserver: new EventObserver(),
      dropContainerHashingStartedObserver: new EventObserver(),
      dropContainerHashingFinishedObserver: new EventObserver(),
      dropContainerHashingCanceledObserver: new EventObserver(),
      titleShownObserver: new EventObserver(),
      titleHiddenObserver: new EventObserver(),
      errorCaughtObserver: new EventObserver()
    };
  }
  
  initializeExternalObservers(configuration) {
    const self = this;
    if (configuration.observers) {
      const observerNames = Object.keys(configuration.observers);
      
      observerNames.forEach(observerName => {
        const observer = configuration.observers[observerName];
        switch (observerName) {
          case 'hashCalculated':
            this.observers.dropContainerHashingFinishedObserver.subscribe(hash => observer(self.widgetId, hash));
            break;
          default:
            break;
        }
      });
    }
  }
  
  render() {
    const element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    
    element.dropContainer = (new DropContainer(this)).get();
    element.progressBarContainer = (new ProgressBarContainer(this)).get();
    element.titleContainer = (new TitleContainer(this)).get();
    element.errorContainer = (new ErrorContainer(this)).get();

    return element.render();
  }
}

export default FileHasherWidget;
