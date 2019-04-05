import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import constants from "Common/constants";

/**
 * PanelContainer
 */
class PanelContainer {
  constructor(widget, iconStyles) {
    this.element = null;
    this.expanded = false;
    this.widget = widget;
    this.animationClass = '';
    this.iconStyles = iconStyles;
    this.mode = this.widget.configuration.mode;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    if (this.styles.panel.width === null) {
      this.styles.panel.width = parseInt(this.iconStyles.widget, 10) + parseInt(this.styles.banner.width, 10) + 'px';
    }
  
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.code)
    });
    this.initializeObservers();
    this.initializeView(this.mode);
  }
  
  // Initialize the observers
  initializeObservers() {
    const self = this;
  
    this.widget.observers.bannerClickedObserver.subscribe((data) => {
      self.onBannerClicked(data);
    });
  }
  
  onBannerClicked() {
    const self = this;
  
    if (self.expanded) {
      self.element.removeClass(self.animationClass);
    } else {
      self.element.addClass(self.animationClass);
      self.element.target().style.setProperty('--proof-verifier-panel-height', self.styles.panel.height);
    }
    self.expanded = !self.expanded;
  }

  /**
   * Initialize the panel view
   */
  initializeView(mode) {
    const self = this;

    switch(mode) {
      case constants.PROOF_VERIFIER_MODE_PANEL:
        self.element.style({width: `${self.styles.panel.width}`, height: `${self.styles.panel.height}`});
        break;
      case constants.PROOF_VERIFIER_MODE_BANNER:
        self.animationClass = utils.extractClasses(styles, ['panel-expended'])[0];
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
        this.element.hide();
        break;
      default:
        break;
    }
  }
  
  get() {
    return this.element;
  }
}

export default PanelContainer;
