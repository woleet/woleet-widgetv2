import virtualDOMService from '../../../common/services/virtual-dom';
import utils from '../../../common/services/utils';
import constants from '../../../common/constants';
import styleCodes from '../style-codes';
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
    self.element.title.text(utils.translate('errors.common', this.lang, {error_message: message}));

    self.widget.observers.titleHiddenObserver.broadcast();

    utils.setTimer(() => {
      self.hideErrorElement();
    }, constants.TIMINGS.error_displaying)
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
