import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * BannerContainer
 */
class BannerContainer {
  constructor(widget) {
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();

    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.code)
    });

    this.initializeObservers();
    this.initializeEvents();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
  }

  get() {
    return this.element;
  }
}

export default BannerContainer;
