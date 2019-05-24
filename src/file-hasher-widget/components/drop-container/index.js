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
    this.delayedFile = null;
  
    if (!window.woleet) {
      loader.getWoleetLibs()
        .then((woleet) => {
          window.woleet = woleet;
          self.hasher = new woleet.file.Hasher;

          self.hashDelayedFile();
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
      this.startHashing(data).then(result => {
        if (result) {
          self.widget.observers.hashingFinishedObserver.broadcast(result);
        }
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
          if (result) {
            self.widget.observers.hashingFinishedObserver.broadcast(result);
          }
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
  
  startHashing(file) {
    if (!this.hasher) {
      this.delayedFile = file;

      return new Promise((resolve, reject) => {
        resolve(false)
      });
    } else {
      return this.hash(file);
    }
  }

  hashDelayedFile() {
    const self = this;
    if (this.delayedFile) {
      return this.hash(this.delayedFile).then(result => {
        if (result) {
          self.widget.observers.hashingFinishedObserver.broadcast(result);
        }
      });
    }
  }

  hash(file) {
    const self = this;

    self.updateProgress({progress: 0});
    self.widget.observers.hashingStartedObserver.broadcast(file);
    self.element.hide();
    self.delayedFile = null;

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
    
    return self.startHashing(file);
  }

  downloadModeInitiated(fileConfiguration) {
    if (!fileConfiguration.fast_download) {
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
