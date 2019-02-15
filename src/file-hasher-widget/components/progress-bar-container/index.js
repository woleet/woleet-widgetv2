import virtualDOMService from '../../../common/services/virtual-dom';
import utils from '../../../common/services/utils';
import styleCodes from '../style-codes';
import styles from './index.scss';

import ProgressBarWrapper from "./progress-bar-wrapper";
import ProgressTitle from "./progress-title";

/**
 * ProgressBarContainer
 */
class ProgressBarContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.container.code),
      hidden: utils.extractClasses(styles, styleCodes.widget.hidden)
    });
    this.element.progressBarWrapper = (new ProgressBarWrapper(this.widget)).get();
    this.element.progressTitle = (new ProgressTitle(this.widget)).get();
    this.element.hide();
  
    // Initialize the observers
    this.widget.observers.dropZoneHashingStartedObserver.subscribe((data) => {
      this.hashingStartedObserver(data)
    });
    this.widget.observers.dropZoneHashingFinishedObserver.subscribe((data) => {
      this.hashingFinishedObserver(data)
    })
  }
  
  hashingStartedObserver() {
    this.element.show();
  }
  
  hashingFinishedObserver() {
    // this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarContainer;
