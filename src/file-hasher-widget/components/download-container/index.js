import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import constants from "Common/constants";
import styles from './index.scss';
import {getFileHasherObserverMappers} from "Common/services/configurator";
import ProgressBarContainer from "FileHasherWidget/components/progress-bar-container";

/**
 * DownloadContainer
 */
class DownloadContainer {
  constructor(widget) {
    const {url: provenFileUrl, fast_download: fastDownload} = widget.configuration.proven_file;

    this.element = null;
    this.widget = widget;
    this.url = provenFileUrl || null;
    this.request = null;
    this.fastDownload = fastDownload || false;
    this.lang = this.widget.configurator.getLanguage();

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
  
  download(url) {
    const self = this;
    const proxyFileUrl = constants.PROXY_URL + url;
    console.log('download proxy url', proxyFileUrl);

    this.request = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      this.request.addEventListener('readystatechange', () => {
        if(this.request.readyState === 2 && this.request.status === 200) {
          // Download is being started
        } else if(this.request.readyState === 3) {
          // Download is under progress
        } else if(this.request.readyState === 4) {
          // Downloading has finished
          if (this.request.response) {
            const file = utils.blobToFile(this.request.response, 'loaded_file');
            self.widget.observers.downloadingFinishedObserver.broadcast(file);
          }
        }
      });

      this.request.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          const percentComplete = parseInt((evt.loaded / evt.total) * 100, 10);
          self.widget.observers.downloadingProgressObserver.broadcast(percentComplete);
        }
      }, false);

      this.request.responseType = 'blob';
      this.request.open("GET", proxyFileUrl, true);
      this.request.send();

      self.widget.observers.downloadingStartedObserver.broadcast();

      this.request.onerror = function () {
        reject({code: 0});
      };
    }).catch((err) => {
      console.log('error', err);
    });
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
    this.request.abort();
  }

  downloadingFinished() {
    this.element.hide();
  }

  get() {
    return this.element;
  }
}

export default DownloadContainer;
