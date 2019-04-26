import {getFileHasherObserverMappers} from 'FileHasherWidget/defaults';
import ConfigurationService from 'Common/services/configurator';
import VirtualDOMService from 'Common/services/virtual-dom';
import EventObserver from 'Common/patterns/event-observer';
import utils from 'Common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';

import DropContainer from 'FileHasherWidget/components/drop-container';
import TitleContainer from 'FileHasherWidget/components/title-container';
import ProgressBarContainer from 'FileHasherWidget/components/progress-bar-container';
import ErrorContainer from 'FileHasherWidget/components/error-container';
import DownloadContainer from 'FileHasherWidget/components/download-container';
import PreviewContainer from 'FileHasherWidget/components/preview-container';

/**
 * Define a class of the widget
 */
class FileHasherWidget {
  constructor(configuration) {
    this.widgetId = configuration.widgetId;
    this.configurator = new ConfigurationService();
    this.configuration = configuration;
    this.provenFileConfiguration = utils.getObjectProperty(configuration, 'provenFile');
    this.observers = {};
    this.element = null;
  
    this.configurator.init(configuration);
    
    this.initializeObservers();
    this.initializeExternalObservers(configuration);
    this.init();
  }
  
  initializeObservers() {
    /**
     * Initialize the widget observers
     * @type {EventObserver}
     */
    this.observers = {
      /*Events: widget*/
      widgetResetObserver: new EventObserver(),

      /*Events: modes*/
      downloadModeInitiatedObserver: new EventObserver(),
      uploadModeInitiatedObserver: new EventObserver(),

      /*Events: file downloading*/
      downloadingProgressObserver: new EventObserver(),
      downloadingStartedObserver: new EventObserver(),
      downloadingFinishedObserver: new EventObserver(),
      downloadingCanceledObserver: new EventObserver(),

      /*Events: file hashing*/
      fileSelectedObserver: new EventObserver(),
      hashingProgressObserver: new EventObserver(),
      hashingStartedObserver: new EventObserver(),
      hashingFinishedObserver: new EventObserver(),
      hashingCanceledObserver: new EventObserver(),

      /*Events: errors*/
      errorCaughtObserver: new EventObserver(),
      errorHiddenObserver: new EventObserver()
    };

    this.observers.hashingCanceledObserver.subscribe(() => {
      this.observers.uploadModeInitiatedObserver.broadcast();
    });

    this.observers.widgetResetObserver.subscribe(() => {
      this.observers.uploadModeInitiatedObserver.broadcast();
    });
  }
  
  initializeExternalObservers(configuration) {
    const self = this;
    if (configuration.observers) {
      const observerNames = Object.keys(configuration.observers);
      
      observerNames.forEach(observerName => {
        const observer = configuration.observers[observerName];
        switch (observerName.toLowerCase()) {
          case 'hashcalculated':
            this.observers.hashingFinishedObserver.subscribe(({hash, file}) => observer(self.widgetId, hash, file));
            break;
          case 'hashingstarted':
            this.observers.hashingStartedObserver.subscribe(file => observer(self.widgetId, file));
            break;
          case 'hashingprogress':
            this.observers.hashingProgressObserver.subscribe((progress) => observer(self.widgetId, progress));
            break;
          case 'hashingcanceled':
            this.observers.hashingCanceledObserver.subscribe(() => observer(self.widgetId));
            break;
          case 'widgetreset':
            this.observers.widgetResetObserver.subscribe(() => observer(self.widgetId));
            break;
          case 'filedownloaded':
            this.observers.downloadingFinishedObserver.subscribe(file => observer(self.widgetId, file));
            this.observers.fileSelectedObserver.subscribe(file => observer(self.widgetId, file));
            break;
          default:
            break;
        }
      });
    }
  }
  
  init() {
    const widgetObserverMappers = getFileHasherObserverMappers();
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    this.element.attr('id', this.widgetId);
    this.element.style({width: `${this.configuration.styles.width}`});
  
    this.element.dropContainer = (new DropContainer(this)).get();
    this.element.previewContainer = (new PreviewContainer(this)).get();
  
    if (!!(this.provenFileConfiguration)) {
      this.element.downloadContainer = (new DownloadContainer(this)).get();
    }
  
    if (this.configuration.title.visible) {
      this.element.titleContainer = (new TitleContainer(this)).get();
    }
  
    this.element.hashProgressBar = (new ProgressBarContainer(this, widgetObserverMappers.hashProgressBar)).get();
    this.element.downloadProgressBar = (new ProgressBarContainer(this, widgetObserverMappers.downloadProgressBar)).get();
  
    this.element.errorContainer = (new ErrorContainer(this)).get();
  
    if (!!(this.provenFileConfiguration)) {
      this.observers.downloadModeInitiatedObserver.broadcast(this.provenFileConfiguration);
    }
  }
  
  render() {
    return this.element.render();
  }
}

export default FileHasherWidget;
