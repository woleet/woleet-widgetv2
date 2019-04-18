import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import constants from "Common/constants";
import AnchorPanelContainer from "ProofVerifierWidget/components/widget-container/panel-container/anchor-panel-container";
import ControlPanelContainer from "ProofVerifierWidget/components/widget-container/panel-container/control-panel-container";

/**
 * PanelContainer
 */
class PanelContainer {
  constructor(widget, iconStyles) {
    this.element = null;
    this.expanded = false;
    this.widget = widget;
    this.iconStyles = iconStyles;
    this.mode = this.widget.configuration.mode;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    if (this.styles.panel.width === null) {
      this.styles.panel.width = parseInt(this.iconStyles.width, 10) + parseInt(this.styles.banner.width, 10) + 'px';
    }
  
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.code)
    });

    this.element.anchor = (new AnchorPanelContainer(this.widget)).get();
    this.element.control = (new ControlPanelContainer(this.widget)).get();
    
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
      self.element.target().style.setProperty('--proof-verifier-panel-height', 0);
    } else {
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
        self.element.target().style.setProperty('--proof-verifier-panel-height', self.styles.panel.height);
        self.element.target().style.setProperty('--proof-verifier-panel-width', self.styles.panel.width);
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
      case constants.PROOF_VERIFIER_MODE_BANNER:
      default:
        self.element.target().style.setProperty('--proof-verifier-panel-width', self.styles.panel.width);
        break;
    }
  }
  
  get() {
    return this.element;
  }
}

export default PanelContainer;
