import ConfigurationService from '../../common/services/configurator';
import virtualDOMService from '../../common/services/virtual-dom';
import EventObserver from "../../common/patterns/event-observer";
import utils from '../../common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';

import DropZone from './drop-zone';
import TitleContainer from './title-container';
import ProgressBarContainer from "./progress-bar-container";

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
    this.initializeApplicationObservers(configuration);
  }
  
  initializeObservers() {
    /**
     * Initialize the widget observers
     * @type {EventObserver}
     */
    this.observers = {
      dropZoneHashingProgressObserver: new EventObserver(),
      dropZoneHashingStartedObserver: new EventObserver(),
      dropZoneHashingFinishedObserver: new EventObserver()
    };
  }
  
  initializeApplicationObservers(configuration) {
    const self = this;
    if (configuration.observers) {
      const observerNames = Object.keys(configuration.observers);
      
      observerNames.forEach(observerName => {
        const observer = configuration.observers[observerName];
        switch (observerName) {
          case 'hashCalculated':
            this.observers.dropZoneHashingFinishedObserver.subscribe(hash => observer(self.widgetId, hash));
            break;
          default:
            break;
        }
      });
    }
  }
  
  render() {
    const element = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, styleCodes.code)});
    
    element.dropZone = (new DropZone(this)).get();
    element.progressBarContainer = (new ProgressBarContainer(this)).get();
    element.titleContainer = (new TitleContainer(this)).get();
    
    return element.render();
  }
}

export default FileHasherWidget;
