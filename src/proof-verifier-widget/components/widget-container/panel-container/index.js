import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import constants from "Common/constants";
import AnchorPanelContainer from "ProofVerifierWidget/components/widget-container/panel-container/anchor-panel-container";
import ControlPanelContainer from "ProofVerifierWidget/components/widget-container/panel-container/control-panel-container";
import SignPanelContainer from "ProofVerifierComponents/widget-container/panel-container/sign-panel-container";
import CommonPanelContainer from "ProofVerifierComponents/widget-container/panel-container/common-panel-container";

/**
 * PanelContainer
 *
 * This is the common container for all PANEL sub-containers
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

    /**
     * If the panel width wasn't define calculate it as icon width + banner width
     */
    if (this.styles.panel.width === null) {
      this.styles.panel.width = parseInt(this.iconStyles.width, 10) + parseInt(this.styles.banner.width, 10) + 'px';
    }
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.code)
    });

    // There are three different sections: common
    this.element.common = (new CommonPanelContainer(this.widget)).get();
    // The section that contains signed hash info
    this.element.sign = (new SignPanelContainer(this.widget)).get();
    // The section that contains anchored hash info
    this.element.anchor = (new AnchorPanelContainer(this.widget)).get();
    // The section that contains controls and links
    this.element.control = (new ControlPanelContainer(this.widget)).get();
    
    this.initializeObservers();
    // Initialize the selected mode
    this.initializeView(this.mode);
  }
  
  // Initialize the observers
  initializeObservers() {
    const self = this;

    /**
     * If the banner element was clicked
     */
    this.widget.observers.bannerClickedObserver.subscribe((data) => {
      self.onBannerClicked(data);
    });
  }

  /**
   * If the banner element was clicked show/hide the panel
   */
  onBannerClicked() {
    const self = this;

    // To expand the panel just change the style width
    if (self.expanded) {
      self.element.target().style.setProperty('--proof-verifier-panel-height', 0);
    } else {
      self.element.target().style.setProperty('--proof-verifier-panel-height', '700px'); //self.styles.panel.height
    }
    self.expanded = !self.expanded;
  }

  /**
   * Initialize the selected mode
   */
  initializeView(mode) {
    const self = this;

    switch(mode) {
      // If the mode is PANEL show the panel and don't allow it to be hidden
      case constants.PROOF_VERIFIER_MODE_PANEL:
        self.element.target().style.setProperty('--proof-verifier-panel-height', '700px');
        self.element.target().style.setProperty('--proof-verifier-panel-width', self.styles.panel.width);
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
      // If the mode is BANNER hide the panel and allow it to be shown
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
