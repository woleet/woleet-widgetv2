import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import constants from "Common/constants";

/**
 * BannerContainer
 *
 * The container presents the banner mode
 */
class BannerContainer {
  constructor(widget, iconStyles) {
    this.element = null;
    this.widget = widget;
    this.iconStyles = iconStyles;
    this.mode = this.widget.configuration.mode;
    this.lang = this.widget.configurator.getLanguage();
    // Get the class for cursor-pointer style
    this.cursorPointerClass = utils.extractClasses(styles, ['cursor-pointer'])[0];
    this.expanded = false;
  
    this.init();
    this.bannerClickCallbackBinded = utils.bind(this.bannerClickCallback, this);
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.code)
    });
    this.element.style({height: `${this.iconStyles.height}`});
    
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.wrapper.code)
    });

    this.element.hide();
    
    this.initializeObservers();
    // Initialize the selected mode
    this.initializeView(this.mode);
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    /**
     * If icon was clicked
     */
    self.widget.observers.iconClickedObserver.subscribe((data) => {
      self.onIconClicked(data);
    });

    /**
     * If the receipt was verified
     */
    self.widget.observers.receiptVerifiedObserver.subscribe((data) => {
      self.receiptParsed(data);
    });

    self.widget.observers.receiptDownloadingFailedObserver.subscribe((data) => {
      self.receiptFileFailed(data)
    });
  }
  
  /**
   * Initialize events for the BANNER mode
   */
  initializeEvents() {
    this.element.on('click', () => {
      this.widget.observers.bannerClickedObserver.broadcast()
    });
  }

  /**
   * The callback to click on banner
   */
  bannerClickCallback() {
    this.widget.observers.bannerClickedObserver.broadcast();
  }

  /**
   * If the receipt was verified display the banner part of the verification
   */
  receiptParsed(message) {
    const self = this;
    const sig = message.receipt.signature;
    const idStatus = message.identityVerificationStatus;
    const identity = idStatus ? idStatus.identity : false;
    const pubKey = sig ? sig.pubKey : null;
    const { banner: { width: bannerWidth } } = self.widget.configurator.getStyles();

    self.element.show();

    // If the result has the confirmations than parse it and display the info
    if (message.confirmations) {
      let date = utils.formatDate(message.timestamp, self.lang);
      let transParams = {date: date};
      let transCode = pubKey ? 'signed' : 'timestamped';

      if (identity) {
        transParams.organization = identity.organization;
        transParams.context = 'by';
      }

      const translatedText = utils.translate(transCode, self.lang, transParams);
      const translatedTextClasses = utils.extractClasses(styles, styleCodes.bannerContainer.wrapper.title.code);
      const titleElement = VirtualDOMService.createResponsiveText(translatedText, bannerWidth, translatedTextClasses);

      self.element.wrapper.target().append(titleElement);
    }
  }

  /**
   * If icon was clicked show/hide the banner
   */
  onIconClicked() {
    const self = this;
    const widgetStyles = this.widget.configurator.getStyles();
    // To expand the banner just change the style width
    if (self.expanded) {
      self.element.target().style.setProperty('--proof-verifier-banner-width', 0);
    } else {
      self.element.target().style.setProperty('--proof-verifier-banner-width', widgetStyles.banner.width);
    }
    self.expanded = !self.expanded;
  }

  /**
   * Initialize the selected mode
   */
  initializeView(mode) {
    const self = this;
    const widgetStyles = self.widget.configurator.getStyles();
    
    switch(mode) {
      // If the mode is PANEL show the banner and don't allow it to be hidden
      case constants.PROOF_VERIFIER_MODE_PANEL:
        self.element.style({width: `${widgetStyles.banner.width}`});
        break;
      // If the mode is PANEL show the banner and don't allow it to be hidden but make it clickable to open th panel
      case constants.PROOF_VERIFIER_MODE_BANNER:
        self.element.addClass(self.cursorPointerClass);
        self.element.style({width: `${widgetStyles.banner.width}`});
        
        this.initializeEvents();
        break;
      // If the mode is PANEL hide the banner and allow it to be shown
      case constants.PROOF_VERIFIER_MODE_ICON:
      default:
        break;
    }

    this.element.target().style
      .setProperty('--proof-verifier-banner-color', widgetStyles.banner.color);
    this.element.target().style
      .setProperty('--proof-verifier-banner-background-color', widgetStyles.banner.background);
  }

  /**
   * If the receipt file is broken or wasn't loaded hide the banner
   */
  receiptFileFailed() {
    this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default BannerContainer;
