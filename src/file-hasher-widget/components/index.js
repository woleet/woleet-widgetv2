import ConfigurationService from '../../common/services/configurator';
import virtualDOMService from '../../common/services/virtual-dom';
import EventObserver from "../../common/patterns/event-observer";
import utils from '../../common/services/utils';
import styles from './index.scss';

import DropZone from './drop-zone';
import TitleZone from './title-zone';

/**
 * Define a class of the widget
 */
class FileHasherWidget {
  constructor(configuration) {
    this.classCodes = ['woleet_file-hasher-widget__wrapper'];
    this.widgetId = configuration.widgetId;
  
    this.dropZoneProgressObserver = new EventObserver();
    this.dropZoneHashCalculatedObserver = new EventObserver();
    this.configurator = new ConfigurationService();
    
    this.initializeObservers(configuration);
    this.configurator.init(configuration);
  }
  
  initializeObservers(configuration) {
    const self = this;
    if (configuration.observers) {
      const observerNames = Object.keys(configuration.observers);
      
      observerNames.forEach(observerName => {
        const observer = configuration.observers[observerName];
        switch (observerName) {
          case 'hashCalculated':
            this.dropZoneHashCalculatedObserver.subscribe(hash => observer(self.widgetId, hash));
            break;
          default:
            break;
        }
      });
    }
  }
  
  render() {
    const element = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes)});
    
    element.dropZone = (new DropZone(this)).get();
    element.titleZone = (new TitleZone(this)).get();
    
    return element.render();
  }
}

export default FileHasherWidget;
