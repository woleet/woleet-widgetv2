import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

import ProgressBarBody from "./progress-bar-body";
import ProgressBarTitle from "./progress-bar-title";

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
      classes: utils.extractClasses(styles, styleCodes.progress.container.code)
    });
    this.element.progressBarBody = (new ProgressBarBody(this.widget)).get();
    this.element.progressBarTitle = (new ProgressBarTitle(this.widget)).get();
    this.element.hide();
  
    // Initialize the observers
    this.widget.observers.dropContainerHashingStartedObserver.subscribe((data) => {
      this.hashingStartedObserver(data)
    });
    this.widget.observers.dropContainerHashingFinishedObserver.subscribe((data) => {
      this.hashingFinishedObserver(data)
    });
    this.widget.observers.dropContainerHashingCanceledObserver.subscribe((data) => {
      this.hashingFinishedObserver(data)
    });
  }
  
  hashingStartedObserver() {
    this.element.show();
  }
  
  hashingFinishedObserver() {
    this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarContainer;
