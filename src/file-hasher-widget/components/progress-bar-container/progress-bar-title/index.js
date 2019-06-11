import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * ProgressBarTitle
 * The title container displays the progress of an action in percent
 */
class ProgressBarTitle {
  constructor(widget, observerMapper) {
    this.element = null;
    this.widget = widget;
    this.observerMapper = observerMapper;
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.title.code)
    });
  
    this.element.span = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.progress.title.span.code)
    });
    
    this.reset();
    this.initializeObservers();
  }

  /**
   * Initialize the observers
   */
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

  /**
   * Catch the event and update the title by progress value
   * @param progress
   */
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
