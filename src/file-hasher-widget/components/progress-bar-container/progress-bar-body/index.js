import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

import ProgressBarControl from "./progress-bar-control";
import ProgressBar from "./progress-bar";

/**
 * ProgressBarBody
 */
class ProgressBarBody {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.body.code)
    });
    this.element.progressBarWrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.wrapper.code)
    });
    this.element.progressBarControl = (new ProgressBarControl(this.widget)).get();
  
    this.element.progressBarWrapper.progressBar = (new ProgressBar(this.widget)).get();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarBody;
