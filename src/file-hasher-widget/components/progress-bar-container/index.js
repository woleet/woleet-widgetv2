import VirtualDOMService from 'Common/services/virtual-dom';
import styleCodes from 'FileHasherComponents/style-codes';
import utils from 'Common/services/utils';
import styles from './index.scss';

import ProgressBarBody from './progress-bar-body';
import ProgressBarTitle from './progress-bar-title';

/**
 * ProgressBarContainer
 * It's responsible for all widget progress bars
 */
class ProgressBarContainer {
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
      classes: utils.extractClasses(styles, styleCodes.progress.container.code)
    });
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.container.wrapper.code)
    });

    // The progress body
    this.element.wrapper.progressBarBody = (new ProgressBarBody(this.widget, this.observerMapper)).get();
    // The progress title
    this.element.wrapper.progressBarTitle = (new ProgressBarTitle(this.widget, this.observerMapper)).get();

    this.element.hide();

    this.initializeObservers();
  }

  // Initialize the observers
  initializeObservers() {
    if (this.observerMapper['processStartedObserver']) {
      let processStartedObserver = this.observerMapper['processStartedObserver'];
      this.widget.observers[processStartedObserver].subscribe((data) => {
        this.processStarted(data)
      });
    }
    if (this.observerMapper['processFinishedObserver']) {
      let processFinishedObserver = this.observerMapper['processFinishedObserver'];
      this.widget.observers[processFinishedObserver].subscribe((data) => {
        this.processFinished(data)
      });
    }
    if (this.observerMapper['processCanceledObserver']) {
      let processCanceledObserver = this.observerMapper['processCanceledObserver'];
      this.widget.observers[processCanceledObserver].subscribe((data) => {
        this.processFinished(data)
      });
    }
    this.widget.observers.errorCaughtObserver.subscribe((data) => {
      this.processFinished(data)
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      this.uploadModeInitiated(data)
    });
  }

  processStarted() {
    this.element.show();
  }

  uploadModeInitiated() {
    this.element.hide();
  }

  processFinished() {
    this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarContainer;
