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
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.mode = this.widget.configuration.mode;
    this.lang = this.widget.configurator.getLanguage();
    // Get the class for cursor-pointer style
    this.cursorPointerClass = utils.extractClasses(styles, ['cursor-pointer'])[0];
    this.expanded = false;
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.code)
    });
    
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.wrapper.code)
    });

    this.element.wrapper.title = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.wrapper.title.code)
    });

    this.element.hide();
    
    this.initializeObservers();
    // Initialize the selected mode
    this.initializeView(this.mode);
    this.stylize()
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
    self.widget.observers.receiptVerifiedObserver.subscribe((data, receipt) => {
      self.receiptParsed(data, receipt);
    });

    self.widget.observers.receiptDownloadingFailedObserver.subscribe((data) => {
      self.receiptFileFailed(data)
    });

    self.widget.observers.windowResizedObserver.subscribe(() => {
      // self.changeTitleFont()
    });
  }

  /**
   * Stylize the element: responsive, customization and etc.
   */
  stylize() {
    const { banner: bannerOptions } = this.widget.configurator.getStyles();
    this.element.style({height: `${bannerOptions.height}`});
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
   * @param message
   * @param receipt
   */
  receiptParsed(message, receipt) {
    const self = this;
    const { icon: iconStyles } = this.widget.configurator.getStyles();

    if (message) {
      const sig = receipt.signature;
      const idStatus = message.identityVerificationStatus;
      const identity = idStatus ? idStatus.identity : false;
      const pubKey = sig ? sig.pubKey : null;

      self.element.show();

      // If the result has the confirmations, then parse it and display the info
      if (message.confirmations) {
        let date = utils.formatDate(message.timestamp, self.lang);
        let transParams = {date: date};
        let transCode = pubKey ? 'signed' : 'timestamped';

        if (identity) {
          transParams.organization = identity.organization;
          transParams.context = 'by';
        }

        const bannerWidth = utils.getWidthDifference(this.element.target().parentElement.offsetWidth, iconStyles.width);
        const translatedText = utils.translate(transCode, self.lang, transParams);
        self.element.wrapper.title.text(translatedText);
        // self.changeTitleFont(bannerWidth);
      }
    }
  }

  /**
   * Change the title font size
   */
  changeTitleFont(width) {
    if (!width) {
      width = this.element.wrapper.target().offsetWidth;
    }

    const fontSize = utils.calculateResponsiveFontSize(width, 0.04, 14);
    this.element.wrapper.title.attr('style', `font-size: ${fontSize}px;`);
  }

  /**
   * If icon was clicked show/hide the banner
   */
  onIconClicked() {
    const self = this;
    const { icon: iconStyles, width } = this.widget.configurator.getStyles();

    // To expand the banner just change the style width
    if (self.expanded) {
      self.element.target().style.setProperty('--proof-verifier-banner-width', 0);
    } else {
      self.element.target().style.setProperty('--proof-verifier-banner-width', `calc(${width} - ${iconStyles.width})`);
    }
    self.expanded = !self.expanded;
  }

  /**
   * Initialize the selected mode
   */
  initializeView(mode) {
    const self = this;
    const { icon: iconStyles, width, banner } = self.widget.configurator.getStyles();
    
    switch(mode) {
      // If the mode is PANEL show the banner and does not allow it to be hidden
      case constants.PROOF_VERIFIER_MODE_PANEL:
        self.element.style({width: `calc(${width} - ${iconStyles.width})`});
        break;
      // If the mode is PANEL show the banner and does not allow it to be hidden but make it clickable to open th panel
      case constants.PROOF_VERIFIER_MODE_BANNER:
        self.element.addClass(self.cursorPointerClass);
        self.element.style({width: `calc(${width} - ${iconStyles.width})`});

        this.initializeEvents();
        break;
      // If the mode is PANEL hide the banner and allow it to be showned
      case constants.PROOF_VERIFIER_MODE_ICON:
      default:
        break;
    }

    this.element.target().style
      .setProperty('--proof-verifier-banner-color', banner.color);
    this.element.target().style
      .setProperty('--proof-verifier-banner-background-color', banner.background);
  }

  /**
   * If the receipt file is broken or wasn't loaded, hide the banner
   */
  receiptFileFailed() {
    this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default BannerContainer;
