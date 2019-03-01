import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * PreviewContainer
 */
class PreviewContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    
    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();
    
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.code)
    });
    this.element.style({'min-height': `${widgetStyles.width}px`});
    this.element.hide();
    
    this.initializeObservers();
    this.initializeEvents();
  }
  
  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;
  
    // this.widget.observers.downloadingFinishedObserver.subscribe(file);
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
  }

  get() {
    return this.element;
  }
}

export default PreviewContainer;
