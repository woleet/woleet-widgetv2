import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';
import constants from "Common/constants";

/**
 * DownloadContainer
 */
class DownloadContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.url = this.widget.configuration.proven_file;
    
    this.init();
  }
  
  init() {
    const self = this;
    const widgetStyles = this.widget.configurator.getStyles();
    
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.code)
    });
    this.element.style({'min-height': `${widgetStyles.width}px`});
    
    this.element.body = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.download.body.code)
    });
  
    this.element.body.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.icon.code)
    });
  
    this.element.body.icon.html(utils.getSolidIconSVG('faDownload'));
  
    /**
     * Events
     */
    this.element.body.icon.on('click', function () {
      self.downloadFile(self.url)
        .then(response => {
          console.log('response', response);
        });
    });
  }
  
  updateProgress(event) {
    /*let progress = (event.progress * 100);
  
    if (progress !== progress) {
      progress = 0;
    }
  
    progress = progress.toFixed(0);
    this.widget.observers.dropContainerHashingProgressObserver.broadcast(progress);*/
  }

  handleError(event) {
    // this.widget.observers.errorCaughtObserver.broadcast(event.error);
  }
  
  downloadFile(url) {
    const self = this;
    const proxyFileUrl = constants.PROXY_URL + url;
    console.log('download url', url, proxyFileUrl);
    
    const request = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      request.addEventListener('readystatechange', () => {
        if(request.readyState === 2 && request.status === 200) {
          // Download is being started
        } else if(request.readyState === 3) {
          // Download is under progress
        } else if(request.readyState === 4) {
          // Downloading has finished
          const file = utils.blobToFile(request.response, 'loaded_file');
          console.log('loaded file', file);
          self.widget.observers.fileLoadingFinishedObserver.broadcast(file);
        }
      });
  
      request.addEventListener("progress", function (evt) {
        console.log('evt', evt);
        
        if (evt.lengthComputable) {
          const percentComplete = evt.loaded / evt.total;
          console.log(percentComplete);
        }
      }, false);
  
      request.responseType = 'blob';
      request.open("GET", proxyFileUrl, true);
      request.send();
  
      request.onerror = function () {
        reject({code: 0});
      };
  
      /*
      
      req.setRequestHeader('Accept', 'application/json');
      req.json = "json";*/
    }).catch((err) => {
      //const error = new Error('http_error');
      /*error.text = err.message;
      error.code = err.code;*/
      
      console.log('error', err);
      //throw error;
    });
  }

  get() {
    return this.element;
  }
}

export default DownloadContainer;
