import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * AnchorPanelContainer
 */
class AnchorPanelContainer {
  constructor(widget, iconStyles) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }
  
  init() {
    const {banner: bannerStyles} = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.code)
    });
    this.initializeObservers();

    if (bannerStyles.title && bannerStyles.title.color) {
      this.styles.panel.target().style
        .setProperty('--proof-verifier-banner-title-color', bannerStyles.title.color);
    }
  }
  
  // Initialize the observers
  initializeObservers() {
    const self = this;

    self.widget.observers.receiptVerifiedObserver.subscribe((data) => {
      self.receiptParsed(data);
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
  
  get() {
    return this.element;
  }
}

export default AnchorPanelContainer;
