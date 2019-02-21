import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

import ProgressBar from "./progress-bar";

/**
 * ProgressBarWrapper
 */
class ProgressBarWrapper {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.wrapper.code)
    });
    this.element.progressBar = (new ProgressBar(this.widget)).get();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarWrapper;
