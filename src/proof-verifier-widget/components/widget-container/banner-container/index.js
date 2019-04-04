import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import constants from "Common/constants";

/**
 * BannerContainer
 */
class BannerContainer {
  constructor(widget, styles) {
    this.element = null;
    this.widget = widget;
    this.styles = styles;
    this.animationClass = '';
    this.mode = this.widget.configuration.mode;
    this.lang = this.widget.configurator.getLanguage();
    this.expanded = false;

    console.log('styles', styles);
  
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.code)
    });
    this.element.style({height: `${this.styles.icon.height}`});
    this.initializeObservers();
    this.initializeView(this.mode);
  }
  
  // Initialize the observers
  initializeObservers() {
    const self = this;

    this.widget.observers.iconClickedObserver.subscribe((data) => {
      self.onIconClicked(data);
    });
  }

  onIconClicked() {
    const self = this;
    const styles = this.widget.configurator.getStyles();
    if (self.expanded) {
      self.element.removeClass(self.animationClass);
    } else {
      self.element.addClass(self.animationClass);
      self.element.target().style.setProperty('--proof-verifier-banner-width', styles.banner.width);
    }
    self.expanded = !self.expanded;
  }

  /**
   * Initialize the banner view
   */
  initializeView(mode) {
    const self = this;

    switch(mode) {
      case constants.PROOF_VERIFIER_MODE_PANEL:
        this.expanded = true;
        break;
      case constants.PROOF_VERIFIER_MODE_BANNER:
        self.animationClass = utils.extractClasses(styles, ['panel-expended'])[0];
        this.expanded = true;
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
      default:
        self.animationClass = utils.extractClasses(styles, ['banner-expended'])[0];
        break;
    }
  }
  
  get() {
    return this.element;
  }
}

export default BannerContainer;
