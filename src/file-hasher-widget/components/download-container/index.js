import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * DownloadContainer
 * It downloads a file from the configuration if it was listed
 */
class DownloadContainer {
  constructor(widget) {
    const {
      file: {
        url: provenFileUrl
      }
    } = widget.configuration;

    this.element = null;
    this.request = null;
    this.widget = widget;
    this.url = provenFileUrl || null;

    /**
     * A mapper for the request object to make the last more flexible and reusable
     * @type {{downloadingFinished: string, downloadingStarted: string, downloadingProgress: string}}
     */
    this.observerMapper = {
      'downloadingProgress': 'downloadingProgressObserver',
      'downloadingStarted': 'downloadingStartedObserver',
      'downloadingFinished': 'downloadingFinishedObserver',
      'downloadingFailed': 'downloadingFailedObserver'
    };

    if (this.url !== null) {
      let {
        proxy: {
          url: proxyUrl,
          enabled: proxyEnabled
        }
      } = widget.configuration;

      /**
       * If the proxy is listed then change the download URL
       * @type {string}
       */
      const downloadFilename = utils.getUrlToDownload(this.url, proxyUrl, proxyEnabled);
      this.request = utils.getHttpRequest(downloadFilename, this.widget, this.observerMapper, this.url);
    }

    this.init();
  }

  /**
   * Create and initialize all container elements
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.code)
    });

    this.initializeObservers();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    this.widget.observers.downloadModeInitiatedObserver.subscribe(() => {
      this.downloadModeInitiated();
    });
    this.widget.observers.downloadingCanceledObserver.subscribe(() => {
      this.downloadingCanceled();
    });
    this.widget.observers.downloadingStartedObserver.subscribe(() => {
      this.element.hide();
    });
    this.widget.observers.errorCaughtObserver.subscribe(() => {
      this.downloadingCanceled();
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe(() => {
      this.element.hide();
    });
    this.widget.observers.widgetResetObserver.subscribe(() => {
      this.downloadingCanceled();
    });
  }

  download() {
    if (this.request !== null) {
      this.request.start();
    }
  }

  downloadFile() {
    this.download(this.url);
  }

  downloadModeInitiated() {
    this.downloadFile();
  }

  /**
   * It the user close the download process, abort the request
   */
  downloadingCanceled() {
    if (this.request !== null) {
      this.request.abort();
    }
  }

  get() {
    return this.element;
  }
}

export default DownloadContainer;
