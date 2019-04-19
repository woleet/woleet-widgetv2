import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import TitlePanelContainer from "ProofVerifierComponents/widget-container/panel-container/title-panel-container";

/**
 * SignPanelContainer
 */
class SignPanelContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }
  
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
  
  // Initialize the observers
  initializeObservers() {
    const self = this;

    self.widget.observers.receiptVerifiedObserver.subscribe((data) => {
      self.receiptParsed(data);
    });
  }

  receiptParsed(receiptObj) {
    const self = this;
    const {receipt: { signature = null }} = receiptObj;
    
    if (signature !== null) {
      this.element.show();
    
      if (signature.signedHash) {
        const signedHashLabel = utils.translate('signed_hash', self.lang);
        const signedHashTitle = new TitlePanelContainer(self.widget, { filled: 'dark', split: true, small: true });
        signedHashTitle.set(signedHashLabel, signature.signedHash);
        this.element.wrapper.append(signedHashTitle.get().render());
      }
    
      if (signature.pubKey) {
        const pubKeyLabel = utils.translate('signee', self.lang);
        const pubKeyTitle = new TitlePanelContainer(self.widget, { filled: 'dark', small: true });
        pubKeyTitle.set(pubKeyLabel, signature.pubKey);
        this.element.wrapper.append(pubKeyTitle.get().render());
      }
    
      if (signature.signature) {
        const signatureLabel = utils.translate('signature', self.lang);
        const signatureTitle = new TitlePanelContainer(self.widget, { split: true, small: true });
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
