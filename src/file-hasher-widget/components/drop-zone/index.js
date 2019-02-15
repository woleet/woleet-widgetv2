import virtualDOMService from '../../../common/services/virtual-dom';
import utils from '../../../common/services/utils';
import widgetLogger from '../../../common/services/logger';
import styleCodes from '../style-codes';
import styles from './index.scss';

/**
 * DropZone area
 */
class DropZone {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.hasher = window.woleet ? new window.woleet.file.Hasher : null;
  
    /**
     * Bindings
     */
    this.onInputFileChanged.bind(this);
    
    this.init();
  }
  
  init() {
    const self = this;
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.dropZone.code)
    });
    this.element.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.dropZone.icon.code)
    });
    this.element.input = virtualDOMService.createFileInput({
      classes: utils.extractClasses(styles, styleCodes.dropZone.input.code)
    });
    this.element.icon.html(utils.getSolidIconSVG('faFileDownload'));
  
    /**
     * Events
     */
    this.element.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then((hash) => {
          self.widget.observers.dropZoneHashingFinishedObserver.broadcast(hash);
        });
    });
  }
  
  updateProgress(event) {
    let progress = (event.progress * 100);
  
    if (progress !== progress) {
      progress = 0;
    }
  
    progress = progress.toFixed(0);
    this.widget.observers.dropZoneHashingProgressObserver.broadcast(progress);
  }
  
  onInputFileChanged(self) {
    let file = this.files[0];
    if (!self.hasher || self.hasher === null)
      widgetLogger.error(`${this.widget.widgetId}: Woleet Hasher isn't found`);
    
    if (!file)
      widgetLogger.error(`${this.widget.widgetId}: File isn't found`);
  
    // Reset input value
    this.value = null;
  
    self.updateProgress({progress: 0});
    self.widget.observers.dropZoneHashingStartedObserver.broadcast();
  
    return new Promise((resolve) => {
      self.hasher.start(file);
      self.hasher.on('progress', (r) => {
        self.updateProgress(r);
      });
      self.hasher.on('result', (r) => {
        resolve(r.result);
      })
    })
  }
  
  get() {
    return this.element;
  }
}

export default DropZone;
