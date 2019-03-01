import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * PreviewContainer
 */
class PreviewContainer {
  constructor(widget) {
    const self = this;
    
    this.element = null;
    this.widget = widget;
    this.fileReader = new FileReader();
    
    this.fileReader.onload = function (file) {
      self.showFilePreview(file);
    };
    
    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();
    
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.code)
    });
    this.element.style({'min-height': `${widgetStyles.width}px`});
    
    this.element.body = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.code)
    });
    
    this.element.body.wrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.wrapper.code)
    });
    
    this.element.body.wrapper.image = virtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.code)
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
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
  }

  downloadingFinished(file) {
    this.element.show();
    this.fileReader.readAsDataURL(file);
  }

  showFilePreview(event) {
    const {result: filePreview} = event.target;
    this.element.body.wrapper.image.attr('src', filePreview);
  }

  get() {
    return this.element;
  }
}

export default PreviewContainer;
