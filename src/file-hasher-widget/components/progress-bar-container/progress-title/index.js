import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

/**
 * ProgressTitle
 */
class ProgressTitle {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.title.code)
    });
  
    this.element.span = virtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.progress.title.span.code)
    });
  
    // Initialize the observers
    this.widget.observers.dropContainerHashingProgressObserver.subscribe((data) => {
      this.hashingProgressObserver(data)
    });
  
    this.widget.observers.dropContainerHashingStartedObserver.subscribe((data) => {
      this.hashingStartedObserver(data)
    });
    
    this.reset();
  }
  
  hashingProgressObserver(progress) {
    this.element.span.text(`${progress}%`);
  }
  
  hashingStartedObserver() {
    this.reset();
  }
  
  reset() {
    this.element.span.text(`${0}%`);
  }
  
  get() {
    return this.element;
  }
}

export default ProgressTitle;
