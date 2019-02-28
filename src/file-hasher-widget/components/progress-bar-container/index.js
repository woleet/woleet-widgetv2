import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

import ProgressBarBody from "./progress-bar-body";
import ProgressBarTitle from "./progress-bar-title";
import EventObserver from "Common/patterns/event-observer";

/**
 * ProgressBarContainer
 */
class ProgressBarContainer {
  constructor(widget, observerMapper) {
    this.element = null;
    this.widget = widget;
    this.observerMapper = observerMapper;
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.container.code)
    });
    this.element.progressBarBody = (new ProgressBarBody(this.widget, this.observerMapper)).get();
    this.element.progressBarTitle = (new ProgressBarTitle(this.widget, this.observerMapper)).get();
    this.element.hide();

    this.initializeObservers();
  }

  // Initialize the observers
  initializeObservers() {
    if (this.observerMapper['processStartedObserver']) {
      let processStartedObserver = this.observerMapper['processStartedObserver'];
      this.widget.observers[processStartedObserver].subscribe((data) => {
        this.hashingStartedObserver(data)
      });
    }
    if (this.observerMapper['processFinishedObserver']) {
      let processFinishedObserver = this.observerMapper['processFinishedObserver'];
      this.widget.observers[processFinishedObserver].subscribe((data) => {
        this.hashingFinishedObserver(data)
      });
    }
    if (this.observerMapper['processCanceledObserver']) {
      let processCanceledObserver = this.observerMapper['processCanceledObserver'];
      this.widget.observers[processCanceledObserver].subscribe((data) => {
        this.hashingFinishedObserver(data)
      });
    }
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
