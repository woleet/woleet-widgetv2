import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import constants from 'Common/constants';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

/**
 * ErrorContainer
 */
class ErrorContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
  
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.error.container.code)
    });
    this.element.title = virtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.error.code)
    });

    this.hideErrorElement();
    
    // Initialize the observers
    this.widget.observers.errorCaughtObserver.subscribe((data) => {
      this.errorCaughtObserver(data)
    });
  }

  errorCaughtObserver(message) {
    const self = this;
    self.element.show();

    console.log(`errors.${message}.main`);
    self.element.title.text(utils.translate(`errors.${message}.main`, this.lang));

    self.widget.observers.titleHiddenObserver.broadcast();
    self.widget.observers.dropContainerHashingCanceledObserver.broadcast();

    /*utils.setTimer(() => {
      self.hideErrorElement();
    }, constants.TIMINGS.error_displaying)*/
  }

  hideErrorElement() {
    this.element.title.text('');
    this.element.hide();

    this.widget.observers.titleShownObserver.broadcast();
  }
  
  get() {
    return this.element;
  }
}

export default ErrorContainer;
