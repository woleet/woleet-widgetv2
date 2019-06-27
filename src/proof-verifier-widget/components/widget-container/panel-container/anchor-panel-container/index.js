import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import ValuePanelContainer from "ProofVerifierComponents/widget-container/panel-container/value-panel-container";

/**
 * AnchorPanelContainer
 *
 * The container shows the anchored hash section
 */
class AnchorPanelContainer {
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
      classes: utils.extractClasses(styles, styleCodes.panelContainer.anchor.code)
    });
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.anchor.wrapper.code)
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
   * @param verificationResult
   * @param receipt
   */
  receiptParsed(verificationResult, receipt) {
    const self = this;
    if (verificationResult) {
      const { confirmations, timestamp } = verificationResult;
      const { targetHash } = receipt;

      if (confirmations || timestamp || targetHash) {
        this.element.show();

        // Display all the titles
        if (targetHash) {
          const targetHashLabel = utils.translate('anchored_hash', self.lang);
          const targetHashTitle = new ValuePanelContainer(self.widget, { style: 'anchoredHash', split: true });
          targetHashTitle.set(targetHashLabel, targetHash);
          this.element.wrapper.append(targetHashTitle.get().render());
        }

        if (confirmations) {
          const timestampLabel = utils.translate('timestamp', self.lang);
          const formattedTimestamp = utils.formatDate(timestamp, self.lang);
          const targetHashTitle = new ValuePanelContainer(self.widget, { style: 'signedHash' });
          targetHashTitle.set(timestampLabel, formattedTimestamp);
          this.element.wrapper.append(targetHashTitle.get().render());
        }

        if (confirmations) {
          const confirmationLabel = utils.translate('confirmations', self.lang);
          const confirmationTitle = new ValuePanelContainer(self.widget);
          confirmationTitle.set(confirmationLabel, confirmations);
          this.element.wrapper.append(confirmationTitle.get().render());
        }
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default AnchorPanelContainer;
