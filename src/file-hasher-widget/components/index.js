import ConfigurationService from 'Common/services/configurator';
import VirtualDOMService from 'Common/services/virtual-dom';
import EventObserver from 'Common/patterns/event-observer';
import utils from 'Common/services/utils';
import styleCodes from './style-codes';
import styles from './index.scss';

import DropContainer from 'FileHasherWidget/components/drop-container';
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
    this.provenFileConfiguration = configuration.file;
    this.observers = {};
    this.element = null;
    this.previewContainer = null;

    this.configurator.init(configuration);

    this.initializeObservers();
    this.initializeExternalObservers(configuration);
    this.init();
  }

  /**
   * Initialize the widget observers
   */
  initializeObservers() {
    this.observers = {

      // Events: widget
      widgetResetObserver: new EventObserver(),

      // Events: modes
      downloadModeInitiatedObserver: new EventObserver(),
      uploadModeInitiatedObserver: new EventObserver(),

      // Events: file downloading
      downloadingProgressObserver: new EventObserver(),
      downloadingStartedObserver: new EventObserver(),
      downloadingFinishedObserver: new EventObserver(),
      downloadingCanceledObserver: new EventObserver(),
      downloadingFailedObserver: new EventObserver(),

      // Events: file hashing
      fileSelectedObserver: new EventObserver(),
      hashingProgressObserver: new EventObserver(),
      hashingStartedObserver: new EventObserver(),
      hashingFinishedObserver: new EventObserver(),
      hashingCanceledObserver: new EventObserver(),

      // Events: errors
      errorCaughtObserver: new EventObserver()
    };

    // Reinitialize the widget if hashing process was canceled
    this.observers.hashingCanceledObserver.subscribe(() => {
      this.observers.uploadModeInitiatedObserver.broadcast();
    });

    // Reinitialize the widget if reset button was clicked
    this.observers.widgetResetObserver.subscribe(() => {
      this.observers.uploadModeInitiatedObserver.broadcast();
    });

    // If downloading is failed, raise an error
    this.observers.downloadingFailedObserver.subscribe((error) => {
      this.observers.errorCaughtObserver.broadcast(error);
    });
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
          case 'downloadingstarted':
            this.observers.downloadingStartedObserver.subscribe((filename) => observer(self.widgetId, filename));
            break;
          case 'downloadingcanceled':
            this.observers.downloadingCanceledObserver.subscribe(() => observer(self.widgetId));
            break;
          case 'downloadingprogress':
            this.observers.downloadingProgressObserver.subscribe((progress) => observer(self.widgetId, progress));
            break;
          case 'downloadingfinished':
            this.observers.downloadingFinishedObserver.subscribe(file => observer(self.widgetId, file));
            this.observers.fileSelectedObserver.subscribe(file => observer(self.widgetId, file));
            break;
          case 'downloadingfailed':
            this.observers.downloadingFailedObserver.subscribe((error, code, message) => observer(self.widgetId, error, code, message));
            break;
          case 'hashingfinished':
            this.observers.hashingFinishedObserver.subscribe(({
              hash,
              file
            }) => observer(self.widgetId, hash, file));
            break;
          case 'hashingstarted':
            this.observers.hashingStartedObserver.subscribe((file, isPreviewable) => observer(self.widgetId, file, isPreviewable));
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
          case 'errorcaught':
            this.observers.errorCaughtObserver.subscribe((error) => observer(self.widgetId, error));
            break;
          default:
            break;
        }
      });
    }
  }

  /**
   * Create and initialize all container elements
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden),
      disabled: utils.extractClasses(styles, styleCodes.widget.disabled)
    });

    // Container to drop and select user files
    this.element.dropContainer = (new DropContainer(this)).get();

    // Container to preview all allowed files
    this.previewContainer = new PreviewContainer(this);
    this.element.previewContainer = this.previewContainer.get();

    // Container to download file if it was listed in the configuration
    if (!!(this.provenFileConfiguration.url)) {
      this.element.downloadContainer = (new DownloadContainer(this)).get();
    }

    // If the proven file was set, initialize the download mode
    if (!!(this.provenFileConfiguration.url)) {
      this.observers.downloadModeInitiatedObserver.broadcast(this.provenFileConfiguration);
    }

    this.element.attr('id', this.widgetId);
  }

  reset() {
    this.previewContainer.resetFile();
    this.observers.widgetResetObserver.broadcast();
  }

  render() {
    return this.element.render();
  }
}

export default FileHasherWidget;
