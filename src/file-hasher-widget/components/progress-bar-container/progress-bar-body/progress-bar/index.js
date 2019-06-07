import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * ProgressBar
 * It displays the progress gauge
 */
class ProgressBar {
  constructor(widget, observerMapper) {
    this.element = null;
    this.widget = widget;
    this.observerMapper = observerMapper;
    this.init();
  }

  /**
   * Creates all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.bar.code)
    });

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
  }

  /**
   * Catch the current progress value and display the element width
   * @param progress
   */
  processProgress(progress) {
    this.element.style({width: `${progress}%`});
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBar;
