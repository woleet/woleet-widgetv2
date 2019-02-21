import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

import ProgressBarWrapper from "./progress-bar-wrapper";
import ProgressBarControl from "./progress-bar-control";

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
    this.element.progressBarWrapper = (new ProgressBarWrapper(this.widget)).get();
    this.element.progressBarControl = (new ProgressBarControl(this.widget)).get();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarBody;
