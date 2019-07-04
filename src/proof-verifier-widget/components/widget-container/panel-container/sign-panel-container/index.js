import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import ValuePanelContainer from "ProofVerifierComponents/widget-container/panel-container/value-panel-container";

/**
 * SignPanelContainer
 *
 * The container shows the signed hash section
 */
class SignPanelContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.sign.code)
    });
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.sign.wrapper.code)
    });
    this.element.hide();
    
    this.initializeObservers();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    // If the receipt was verified
    self.widget.observers.receiptVerifiedObserver.subscribe((result, receipt) => {
      self.receiptParsed(result, receipt);
    });
  }

  /**
   * If the receipt was verified
   */
  receiptParsed(verificationResult, receipt) {
    const self = this;

    const {signature = null } = receipt;

    if (signature !== null) {
      this.element.show();

      // Display all the titles
      if (signature.signedHash) {
        const signedHashLabel = utils.translate('signed_hash', self.lang);
        const signedHashTitle = new ValuePanelContainer(self.widget, { style: 'signedHash', split: true, fontRatio: {item: 0.052}});
        signedHashTitle.set(signedHashLabel, signature.signedHash);
        this.element.wrapper.append(signedHashTitle.get().render());
      }

      if (signature.pubKey) {
        const pubKeyLabel = utils.translate('signee', self.lang);
        const pubKeyTitle = new ValuePanelContainer(self.widget, { style: 'signedHash', fontRatio: {item: 0.0455} });
        pubKeyTitle.set(pubKeyLabel, signature.pubKey);
        this.element.wrapper.append(pubKeyTitle.get().render());
      }

      if (signature.signature) {
        const signatureLabel = utils.translate('signature', self.lang);
        const signatureTitle = new ValuePanelContainer(self.widget, { split: true, fontRatio: {item: 0.039} });
        signatureTitle.set(signatureLabel, signature.signature);
        this.element.wrapper.append(signatureTitle.get().render());
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default SignPanelContainer;
