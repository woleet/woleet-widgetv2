import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

/**
 * ProgressBarTitle
 */
class ProgressBarTitle {
  constructor(widget, observerMapper) {
    this.element = null;
    this.widget = widget;
    this.observerMapper = observerMapper;
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.title.code)
    });
  
    this.element.span = virtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.progress.title.span.code)
    });
    
    this.reset();
    this.initializeObservers();
  }

  // Initialize the observers
  initializeObservers() {
    if (this.observerMapper['processProgressObserver']) {
      let processProgressObserver = this.observerMapper['processProgressObserver'];
      this.widget.observers[processProgressObserver].subscribe((data) => {
        this.processProgress(data)
      });
    }
    if (this.observerMapper['processStartedObserver']) {
      let processStartedObserver = this.observerMapper['processStartedObserver'];
      this.widget.observers[processStartedObserver].subscribe((data) => {
        this.processStarted(data)
      });
    }
  }

  processProgress(progress) {
    this.element.span.text(`${progress}%`);
  }

  processStarted() {
    this.reset();
  }
  
  reset() {
    this.element.span.text(`${0}%`);
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarTitle;
