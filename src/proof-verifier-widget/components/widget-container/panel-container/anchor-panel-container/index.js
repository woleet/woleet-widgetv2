import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import TitlePanelContainer from "ProofVerifierComponents/widget-container/panel-container/title-panel-container";

/**
 * AnchorPanelContainer
 */
class AnchorPanelContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.anchor.code)
    });
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.anchor.wrapper.code)
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
    const {confirmations, timestamp, receipt: { targetHash }} = receiptObj;
    
    if (confirmations || timestamp || targetHash) {
      this.element.show();
      
      if (targetHash) {
        const targetHashLabel = utils.translate('anchored_hash', self.lang);
        const targetHashTitle = new TitlePanelContainer(self.widget, { filled: 'light', split: true, small: true });
        targetHashTitle.set(targetHashLabel, targetHash);
        this.element.wrapper.append(targetHashTitle.get().render());
      }
      
      if (confirmations) {
        const timestampLabel = utils.translate('timestamp', self.lang);
        const formattedTimestamp = utils.formatDate(timestamp, self.lang);
        const targetHashTitle = new TitlePanelContainer(self.widget, { filled: 'dark', small: true });
        targetHashTitle.set(timestampLabel, formattedTimestamp);
        this.element.wrapper.append(targetHashTitle.get().render());
      }
      
      if (confirmations) {
        const confirmationLabel = utils.translate('confirmations', self.lang);
        const confirmationTitle = new TitlePanelContainer(self.widget, { small: true });
        confirmationTitle.set(confirmationLabel, confirmations);
        this.element.wrapper.append(confirmationTitle.get().render());
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default AnchorPanelContainer;
