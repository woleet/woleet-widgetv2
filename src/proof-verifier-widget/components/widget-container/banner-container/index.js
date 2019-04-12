import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import constants from "Common/constants";

/**
 * BannerContainer
 */
class BannerContainer {
  constructor(widget, iconStyles) {
    this.element = null;
    this.widget = widget;
    this.iconStyles = iconStyles;
    this.mode = this.widget.configuration.mode;
    this.lang = this.widget.configurator.getLanguage();
    this.cursorPointerClass = utils.extractClasses(styles, ['cursor-pointer'])[0];
    this.expanded = false;
  
    this.init();
  }
  
  init() {
    const {banner: bannerStyles} = this.widget.configurator.getStyles();
    
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.code)
    });
    this.element.style({height: `${this.iconStyles.height}`});
    
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.wrapper.code)
    });
    
    this.element.wrapper.title = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.wrapper.title.code)
    });
    
    this.initializeObservers();
    this.initializeView(this.mode);
    
    if (bannerStyles.title && bannerStyles.title.color) {
      this.element.wrapper.title.target().style
        .setProperty('--proof-verifier-banner-title-color', bannerStyles.title.color);
    }
  }
  
  // Initialize the observers
  initializeObservers() {
    const self = this;
  
    self.widget.observers.iconClickedObserver.subscribe((data) => {
      self.onIconClicked(data);
    });
  
    self.widget.observers.receiptVerifiedObserver.subscribe((data) => {
      self.receiptParsed(data);
    });
  }
  
  /**
   * Initialize events for the BANNER mode
   */
  initializeEvents() {
    const self = this;
    
    self.element.on('click', () => {
      self.widget.observers.bannerClickedObserver.broadcast();
    });
  }
  
  receiptParsed(message) {
    const self = this;
    const sig = message.receipt.signature;
    const idStatus = message.identityVerificationStatus;
    const identity = idStatus ? idStatus.identity : false;
    const pubKey = sig ? sig.pubKey : null;
    if (message.confirmations) {
      let date = utils.formatDate(message.timestamp, this.lang);
      let transParams = {date: date};
      let transCode = pubKey ? 'signed' : 'timestamped';

      if (identity) {
        transParams.organization = identity.organization;
        transParams.context = 'by';
      }

      const translatedText = utils.translate(transCode, this.lang, transParams);
      self.element.wrapper.title.html(translatedText);
    }
  }

  onIconClicked() {
    const self = this;
    const widgetStyles = this.widget.configurator.getStyles();
    if (self.expanded) {
      self.element.target().style.setProperty('--proof-verifier-banner-width', 0);
    } else {
      self.element.target().style.setProperty('--proof-verifier-banner-width', widgetStyles.banner.width);
    }
    self.expanded = !self.expanded;
  }

  /**
   * Initialize the banner view
   */
  initializeView(mode) {
    const self = this;
    const widgetStyles = self.widget.configurator.getStyles();
    
    switch(mode) {
      case constants.PROOF_VERIFIER_MODE_PANEL:
        self.element.style({width: `${widgetStyles.banner.width}`, position: 'relative'});
        break;
      case constants.PROOF_VERIFIER_MODE_BANNER:
        self.element.addClass(self.cursorPointerClass);
        self.element.style({width: `${widgetStyles.banner.width}`, position: 'relative'});
        
        this.initializeEvents();
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
      default:
        break;
    }
  }
  
  get() {
    return this.element;
  }
}

export default BannerContainer;
