import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

import ProgressBarControl from './progress-bar-control';
import ProgressBar from './progress-bar';

/**
 * ProgressBarBody
 * It's a wrapper for progress body
 */
class ProgressBarBody {
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
      classes: utils.extractClasses(styles, styleCodes.progress.body.code)
    });
    this.element.progressBarWrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.wrapper.code)
    });
    this.element.progressBarControl = (new ProgressBarControl(this.widget, this.observerMapper)).get();
    this.element.progressBarWrapper.progressBar = (new ProgressBar(this.widget, this.observerMapper)).get();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarBody;
