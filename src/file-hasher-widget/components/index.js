import {getFileHasherObserverMappers} from 'Common/services/configurator';
import ConfigurationService from "Common/services/configurator";
import virtualDOMService from 'Common/services/virtual-dom';
import EventObserver from "Common/patterns/event-observer";
import utils from 'Common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';

import DropContainer from './drop-container';
import TitleContainer from './title-container';
import ProgressBarContainer from "./progress-bar-container";
import ErrorContainer from "./error-container";
import DownloadContainer from "./download-container";

/**
 * Define a class of the widget
 */
class FileHasherWidget {
  constructor(configuration) {
    this.widgetId = configuration.widgetId;
    this.configurator = new ConfigurationService();
    this.configuration = configuration;
    this.provenFileConfiguration = configuration.proven_file;
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
      /*States*/
      downloadModeInitiatedObserver: new EventObserver(),
      /*Events: file downloading*/
      downloadingProgressObserver: new EventObserver(),
      downloadingStartedObserver: new EventObserver(),
      downloadingFinishedObserver: new EventObserver(),
      downloadingCanceledObserver: new EventObserver(),

      /*Events: file hashing*/
      hashingProgressObserver: new EventObserver(),
      hashingStartedObserver: new EventObserver(),
      hashingFinishedObserver: new EventObserver(),
      hashingCanceledObserver: new EventObserver(),

      /*Events: title*/
      titleShownObserver: new EventObserver(),
      titleHiddenObserver: new EventObserver(),

      /*Events: errors*/
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
            this.observers.hashingFinishedObserver.subscribe(hash => observer(self.widgetId, hash));
            break;
          case 'fileDownloaded':
            this.observers.downloadingFinishedObserver.subscribe(file => observer(self.widgetId, file));
            break;
          default:
            break;
        }
      });
    }
  }
  
  render() {
    const widgetObserverMappers = getFileHasherObserverMappers();
    const element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    element.attr('id', this.widgetId);
    element.style({width: `${this.configuration.styles.width}px`});
    
    element.dropContainer = (new DropContainer(this)).get();

    if (this.provenFileConfiguration && this.provenFileConfiguration !== null) {
      element.downloadContainer = (new DownloadContainer(this)).get();
    }
    
    element.hashProgressBar = (new ProgressBarContainer(this, widgetObserverMappers.hashProgressBar)).get();
    element.titleContainer = (new TitleContainer(this)).get();
    element.errorContainer = (new ErrorContainer(this)).get();

    if (this.provenFileConfiguration && this.provenFileConfiguration !== null) {
      this.observers.downloadModeInitiatedObserver.broadcast(this.provenFileConfiguration);
    }
    
    return element.render();
  }
}

export default FileHasherWidget;
