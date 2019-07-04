import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import faDownload from 'Resources/images/file-download.svg';
import constants from 'Common/constants';

/**
 * DownloadContainer
 * It downloads a file from the configuration if it was listed
 */
class DownloadContainer {
  constructor(widget) {
    const { url: provenFileUrl } = widget.configuration.file;

    this.element = null;
    this.request = null;
    this.widget = widget;
    this.url = provenFileUrl || null;
    this.lang = this.widget.configurator.getLanguage();

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
      let { proxy: { url: proxyUrl, enabled: proxyEnabled } } = widget.configuration;

      if (window.dev) {
        proxyEnabled = true;
        proxyUrl = constants.PROXY_URL;
      }

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
   * Create all container elements and initialize them
   */
  init() {
    const { icon: { width: iconWidth, color: iconColor } } = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.code)
    });

    this.element.body = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.body.code)
    });

    if (!!(iconWidth)) {
      this.element.body.style({ 'width': `${iconWidth}` });
    }

    this.element.body.icon = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.download.body.icon.code)
    });

    this.element.body.icon.setSvg(faDownload, iconColor);
    this.element.body.icon.attr('title', utils.translate('click_to_download', this.lang));

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
    this.widget.observers.downloadingCanceledObserver.subscribe((data) => {
      this.downloadingCanceled(data);
    });
    this.widget.observers.errorCaughtObserver.subscribe(() => {
      this.downloadingCanceled();
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      this.uploadModeInitiated(data)
    });
    this.widget.observers.widgetResetObserver.subscribe(() => {
      this.downloadingCanceled();
    });
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;

    // Start the file downloading if the user click on the download button
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
    this.element.hide();
    this.download(this.url);
  }

  downloadModeInitiated(fileConfiguration) {
    if (fileConfiguration.fastDownload) {
      this.downloadFile();
    }
  }

  uploadModeInitiated() {
    this.element.hide();
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
