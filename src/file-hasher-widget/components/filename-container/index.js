import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * FilenameContainer
 */
class FilenameContainer {
  constructor(widget) {
    this.widget = widget;
    
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.filename.wrapper.code)
    });

    this.element.title = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.filename.code)
    });

    this.element.hide();
    
    this.initializeObservers();
    this.initializeEvents();
  }
  
  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;
  
    self.widget.observers.downloadingFinishedObserver.subscribe((file) => {
      self.downloadingFinished(file)
    });
  
    self.widget.observers.fileSelectedObserver.subscribe((file) => {
      self.downloadingFinished(file)
    });

    self.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      self.uploadModeInitiated(data)
    });
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
  }

  downloadingFinished(file) {
    this.element.show();
    this.element.title.text(file.name);
  }

  uploadModeInitiated() {
    this.element.hide();
    this.resetFile();
  }

  resetFile() {
    this.element.title.text('');
  }

  get() {
    return this.element;
  }
}

export default FilenameContainer;
