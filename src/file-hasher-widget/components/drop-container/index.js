import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

/**
 * DropContainer area
 */
class DropContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.hasher = window.woleet ? new window.woleet.file.Hasher : null;
    
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.code)
    });
    this.element.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.drop.icon.code)
    });
    this.element.input = virtualDOMService.createFileInput({
      classes: utils.extractClasses(styles, styleCodes.drop.input.code)
    });
    this.element.icon.html(utils.getSolidIconSVG('faFileDownload'));

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
    this.widget.observers.hashingCanceledObserver.subscribe((data) => {
      this.hashingCanceled(data)
    });
    this.widget.observers.downloadingCanceledObserver.subscribe((data) => {
      this.downloadingCanceled(data)
    });
    this.widget.observers.downloadingFinishedObserver.subscribe((data) => {
      this.downloadingCanceled();
      this.hash(data).then((hash) => {
        self.widget.observers.hashingFinishedObserver.broadcast(hash);
      });
    });
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.element.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then((hash) => {
          self.widget.observers.hashingFinishedObserver.broadcast(hash);
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
    
    if (!self.hasher || self.hasher === null)
      widgetLogger.error(`${self.widget.widgetId}: Woleet Hasher isn't found`);
  
    self.updateProgress({progress: 0});
    self.widget.observers.hashingStartedObserver.broadcast();
  
    return new Promise((resolve) => {
      self.hasher.start(file);
      self.hasher.on('progress', (r) => {
        self.updateProgress(r);
      });
      self.hasher.on('error', (r) => {
        self.handleError(r);
      });
      self.hasher.on('result', (r) => {
        resolve(r.result);
      })
    })
  }
  
  onInputFileChanged(self) {
    let file = this.files[0];
  
    if (!file)
      widgetLogger.error(`${this.widget.widgetId}: File isn't found`);
  
    // Reset input value
    this.value = null;
    
    return self.hash(file);
  }

  downloadModeInitiated() {
    this.element.hide();
  }

  downloadingCanceled() {
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
