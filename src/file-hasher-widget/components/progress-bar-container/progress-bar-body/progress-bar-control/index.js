import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * ProgressBarControl
 */
class ProgressBarControl {
  constructor(widget, observerMapper) {
    this.element = null;
    this.widget = widget;
    this.observerMapper = observerMapper;
    this.init();
  }
  
  init() {
    const self = this;
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.code)
    });

    this.element.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.icon.code)
    });

    this.element.icon.html(utils.getSolidIconSVG('faTimes'));

    this.initializeEvents();
  }

  /**
   * Events
   */
  initializeEvents() {
    const self = this;
    if (this.observerMapper['processCanceledObserver']) {
      let processCanceledObserver = this.observerMapper['processCanceledObserver'];

      this.element.icon.on('click', function () {
        self.widget.observers[processCanceledObserver].broadcast();
      });
    }
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarControl;
