import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
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
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.error.container.code)
    });
    this.element.title = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.error.code)
    });

    this.hideErrorElement();
    this.initializeObservers();
  }
  
  // Initialize the observers
  initializeObservers() {
    this.widget.observers.errorCaughtObserver.subscribe((data) => {
      this.errorCaught(data)
    });
  }

  errorCaught(error) {
    const self = this;
    self.element.show();
  
    if (error && error.message) {
      self.element.title.text(utils.translate(`errors.${error.message}.main`, this.lang));
    } else {
      self.element.title.text(utils.translate(`errors.${error}`, this.lang));
    }
  }

  hideErrorElement() {
    this.element.title.text('');
    this.element.hide();

    this.widget.observers.errorHiddenObserver.broadcast();
  }
  
  get() {
    return this.element;
  }
}

export default ErrorContainer;
