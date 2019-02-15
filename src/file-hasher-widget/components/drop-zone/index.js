import virtualDOMService from '../../../common/services/virtual-dom';
import utils from '../../../common/services/utils';
import widgetLogger from '../../../common/services/logger';
import styles from './index.scss';

/**
 * DropZone area
 */
class DropZone {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.classCodes = {
      dropZone: ['drop_zone'],
      dropZoneIcon: ['drop_zone-icon'],
      dropZoneFileInput: ['drop_zone-file_input']
    };
  
    /**
     * Bindings
     */
    this.onInputFileChanged.bind(this);
    
    this.init();
  }
  
  init() {
    const self = this;
    this.element = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes.dropZone)});
    this.element.icon = virtualDOMService.createElement('i', {classes: utils.extractClasses(styles, this.classCodes.dropZoneIcon)});
    this.element.input = virtualDOMService.createFileInput({classes: utils.extractClasses(styles, this.classCodes.dropZoneFileInput)});
    this.element.icon.html(utils.getSolidIconSVG('faFileDownload'));
  
    /**
     * Events
     */
    this.element.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then((hash) => {
          self.widget.dropZoneHashCalculatedObserver.broadcast(hash);
        });
    });
  }
  
  updateProgress(event) {
    let progress = (event.progress * 100);
  
    if (progress !== progress) {
      progress = 0;
    }
  
    progress = progress.toFixed(0);
    this.widget.dropZoneProgressObserver.broadcast(progress);
  }
  
  onInputFileChanged(self) {
    const hasher = window.woleet ? new window.woleet.file.Hasher : null;
    
    let file = this.files[0];
    if (!hasher)
      widgetLogger.error(`Woleet Hasher isn't found`);
    
    if (!file)
      widgetLogger.error(`File isn't found`);
  
    // Reset input value
    this.value = null;
  
    return new Promise((resolve, reject) => {
      hasher.start(file);
      hasher.on('progress', (r) => {
        self.updateProgress(r);
      });
      hasher.on('result', (r) => {
        self.updateProgress({progress: 0});
        resolve(r.result);
      })
    })
  }
  
  get() {
    return this.element;
  }
}

export default DropZone;
