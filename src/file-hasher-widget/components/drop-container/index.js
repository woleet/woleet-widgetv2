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
    const self = this;
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
  
    /**
     * Events
     */
    this.element.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then((hash) => {
          self.widget.observers.dropContainerHashingFinishedObserver.broadcast(hash);
        });
    });

    // Initialize the observers
    this.widget.observers.dropContainerHashingCanceledObserver.subscribe((data) => {
      this.hashingCanceled(data)
    });
    // Initialize the observers
    this.widget.observers.fileLoadingFinishedObserver.subscribe((data) => {
      this.hash(data).then((hash) => {
        self.widget.observers.dropContainerHashingFinishedObserver.broadcast(hash);
      });
    });
  }
  
  updateProgress(event) {
    let progress = (event.progress * 100);
  
    if (progress !== progress) {
      progress = 0;
    }
  
    progress = progress.toFixed(0);
    this.widget.observers.dropContainerHashingProgressObserver.broadcast(progress);
  }

  handleError(event) {
    this.widget.observers.errorCaughtObserver.broadcast(event.error);
  }
  
  hash(file) {
    const self = this;
    
    if (!self.hasher || self.hasher === null)
      widgetLogger.error(`${self.widget.widgetId}: Woleet Hasher isn't found`);
  
    self.updateProgress({progress: 0});
    self.widget.observers.dropContainerHashingStartedObserver.broadcast();
  
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

  hashingCanceled() {
    this.hasher.cancel();
  }

  get() {
    return this.element;
  }
}

export default DropContainer;
