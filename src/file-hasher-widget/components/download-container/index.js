import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import {getFileHasherObserverMappers} from 'Common/services/configurator';
import ProgressBarContainer from 'FileHasherWidget/components/progress-bar-container';

/**
 * DownloadContainer
 */
class DownloadContainer {
  constructor(widget) {
    const {url: provenFileUrl} = widget.configuration.proven_file;

    this.element = null;
    this.request = null;
    this.widget = widget;
    this.url = provenFileUrl || null;
    this.lang = this.widget.configurator.getLanguage();
    
    this.observerMapper = {
      'downloadingProgress': 'downloadingProgressObserver',
      'downloadingStarted': 'downloadingStartedObserver',
      'downloadingFinished': 'downloadingFinishedObserver'
    };
    
    if (this.url !== null) {
      const downloadFilename = utils.getUrlToDownload(this.url);
      this.request = utils.getHttpRequest(downloadFilename, this.widget, this.observerMapper);
    }
  
    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();
    const widgetObserverMappers = getFileHasherObserverMappers();

    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.code)
    });
    this.element.style({'min-height': `${widgetStyles.width}px`});
    
    this.element.body = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.body.code)
    });
  
    this.element.body.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.download.body.icon.code)
    });
  
    this.element.body.icon.html(utils.getSolidIconSVG('faDownload'));
    this.element.body.icon.attr('title', utils.translate('click_to_download', this.lang));

    this.element.body.downloadProgressBarConteinerWrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.body.progressBarWrapper.code)
    });

    this.element.body.downloadProgressBarConteinerWrapper.downloadProgressBarContainer = (new ProgressBarContainer(
      this.widget,
      widgetObserverMappers.downloadProgressBar
    )).get();

    this.initializeObservers();
    this.initializeEvents();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    this.widget.observers.downloadModeInitiatedObserver.subscribe((data) => {
      this.downloadModeInitiated(data)
    });
    this.widget.observers.downloadingFinishedObserver.subscribe((data) => {
      this.downloadingFinished(data)
    });
    this.widget.observers.downloadingCanceledObserver.subscribe((data) => {
      this.downloadingCanceled(data);
      this.downloadingFinished(data);
    });
    this.widget.observers.errorCaughtObserver.subscribe(() => {
      this.downloadingCanceled();
      this.downloadingFinished();
    });
    this.widget.observers.downloadingFinishedObserver.subscribe(() => {
      this.downloadingFinished();
    });
    this.widget.observers.fileSelectedObserver.subscribe(() => {
      this.downloadingFinished();
    });
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.element.body.icon.on('click', function () {
      self.downloadFile();
    });
  }
  
  download() {
    if (this.request !== null) {
      this.request.start();
    }
  }

  downloadFile() {
    this.element.body.icon.hide();
    this.element.body.downloadProgressBarConteinerWrapper.downloadProgressBarContainer.show();

    this.download(this.url);
  }

  downloadModeInitiated(fileConfiguration) {
    if (fileConfiguration.fast_download) {
     this.downloadFile();
    }
  }

  downloadingCanceled() {
    if (this.request !== null) {
      this.request.abort();
    }
  }

  downloadingFinished() {
    this.element.hide();
  }

  get() {
    return this.element;
  }
}

export default DownloadContainer;
