import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';
import faFileImport from 'Resources/images/file-import.svg';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import loader from 'Common/services/loader';

/**
 * DropContainer area
 */
class DropContainer {
  constructor(widget, parent) {
    const self = this;
    
    this.element = null;
    this.widget = widget;
    this.parent = parent;
  
    loader.getWoleetLibs()
    this.hasher = window.woleet ? new window.woleet.file.Hasher : null;
  
    if (!window.woleet) {
      loader.getWoleetLibs()
        .then((woleet) => {
          window.woleet = woleet;
          self.hasher = new woleet.file.Hasher;
        });
    } else {
      self.hasher = new window.woleet.file.Hasher;
    }
    
    this.init();
  }
  
  init() {
    const {icon: { width: iconWidth, color: iconColor }} = this.widget.configurator.getStyles();
    
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.code)
    });
  
    this.element.body = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.body.code)
    });
  
    if (!!(iconWidth)) {
      this.element.body.style({'width': `${iconWidth}`});
    }
    
    this.element.body.icon = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.drop.body.icon.code)
    });
    this.element.body.input = VirtualDOMService.createFileInput({
      classes: utils.extractClasses(styles, styleCodes.drop.body.input.code)
    });
    
    this.element.body.icon.setSvg(faFileImport, iconColor);

    this.initializeObservers();
    this.initializeEvents();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;
    this.widget.observers.downloadModeInitiatedObserver.subscribe((data) => {
      this.downloadModeInitiated(data)
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      this.uploadModeInitiated(data);
      this.hashingCanceled(data)
    });
    this.widget.observers.downloadingFinishedObserver.subscribe((data) => {
      this.hash(data).then(result => {
        self.widget.observers.hashingFinishedObserver.broadcast(result);
      });
    });
    this.widget.observers.errorCaughtObserver.subscribe(() => {
      this.downloadingStarted();
      this.hashingCanceled();
    });
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.element.body.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then(result => {
          self.widget.observers.hashingFinishedObserver.broadcast(result);
        });
    });
  }
  
  updateProgress(event) {
    let progress = (event.progress * 100);
  
    if (progress !== progress) {
      progress = 0;
    }
  
    progress = progress.toFixed(0);
    this.widget.observers.hashingProgressObserver.broadcast(progress);
  }

  handleError(event) {
    this.widget.observers.errorCaughtObserver.broadcast(event.error);
  }
  
  hash(file) {
    const self = this;
    
    if (!self.hasher)
      widgetLogger.error(`${self.widget.widgetId}: Woleet Hasher isn't found`);
  
    self.updateProgress({progress: 0});
    self.widget.observers.hashingStartedObserver.broadcast(file);
    self.element.hide();
  
    return new Promise((resolve) => {
      self.hasher.start(file);
      self.hasher.on('progress', (r) => {
        self.updateProgress(r);
      });
      self.hasher.on('error', (r) => {
        self.handleError(r);
      });
      self.hasher.on('result', (r) => {
        resolve({
          hash: r.result,
          file
        });
      })
    })
  }
  
  onInputFileChanged(self) {
    let file = this.files[0];
  
    if (!file)
      widgetLogger.error(`${this.widget.widgetId}: File isn't found`);
  
    // Reset input value
    this.value = null;
  
    self.widget.observers.fileSelectedObserver.broadcast(file);
    
    return self.hash(file);
  }

  downloadModeInitiated(fileConfiguration) {
    if (!utils.getObjectProperty(fileConfiguration, 'fastDownload')) {
      this.element.hide();
    }
  }

  uploadModeInitiated() {
    this.element.show();
  }
  
  downloadingStarted() {
    this.element.show();
  }

  hashingCanceled() {
    this.hasher.cancel();
  }

  get() {
    return this.element;
  }
}

export default DropContainer;
