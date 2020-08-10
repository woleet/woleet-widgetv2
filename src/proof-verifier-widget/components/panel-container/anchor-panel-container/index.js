import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import ValuePanelContainer from 'ProofVerifierComponents/panel-container/value-panel-container';
import HeaderPanelContainer from 'ProofVerifierComponents/panel-container/header-panel-container';
import constants from 'ProofVerifierWidget/services/constants';

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
      const { targetHash, merkleRoot, type } = receipt;

      if (confirmations || timestamp || targetHash) {
        this.element.show();
        let label = utils.translate('bitcoin_proof', self.lang);
        let labelObject = new HeaderPanelContainer(self.widget);
        labelObject.set(label);
        this.element.wrapper.append(labelObject.get().render());

        // Display all the titles
        if (confirmations) {
          const timestampLabel = utils.translate('timestamp', self.lang);
          const formattedTimestamp = utils.formatDate(timestamp, self.lang);
          const targetHashTitle = new ValuePanelContainer(self.widget, { style: 'signedHash', fontRatio: { item: 0.0455 } });
          targetHashTitle.set(timestampLabel, formattedTimestamp);
          this.element.wrapper.append(targetHashTitle.get().render());
        }

        let { endpoints: { transaction: transactionUrl } } = this.widget.configurator.get();

        if (!transactionUrl) {
          transactionUrl = constants.TRANSACTION_URL;
        }
        if (receipt) {
          // Build and display the transaction link
          self.receipt = receipt;
          const { anchors = [] } = receipt;
          if (anchors.length > 0) {
            const transaction = anchors[0];
            const transactionLabel = utils.translate('transaction', self.lang);
            const transactionTitle = new ValuePanelContainer(self.widget, { fontRatio: { item: 0.0455 } });
            transactionTitle.set(transactionLabel, '<a target="blank" href="' +
              transactionUrl.replace('$sourceId', transaction.sourceId) + '">' + transaction.sourceId
              + '</a>');
            this.element.wrapper.append(transactionTitle.get().render());
          }
        }
        if (confirmations) {
          const proofTypeLabel = utils.translate('proofType', self.lang);
          const proofTypeTitle = new ValuePanelContainer(self.widget, { fontRatio: { item: 0.0455 } });
          proofTypeTitle.set(proofTypeLabel, type);
          this.element.wrapper.append(proofTypeTitle.get().render());
        }

        if (targetHash) {
          const targetHashLabel = utils.translate('anchored_hash', self.lang);
          const targetHashTitle = new ValuePanelContainer(self.widget, { style: 'anchoredHash', split: true, fontRatio: { item: 0.052 } });
          targetHashTitle.set(targetHashLabel, targetHash);
          this.element.wrapper.append(targetHashTitle.get().render());
        }

        /*         if (confirmations) {
          const confirmationLabel = utils.translate('confirmations', self.lang);
          const confirmationTitle = new ValuePanelContainer(self.widget, { fontRatio: {item: 0.0455} });
          confirmationTitle.set(confirmationLabel, confirmations);
          this.element.wrapper.append(confirmationTitle.get().render());
        } */

        if (confirmations) {
          const merkleRootLabel = utils.translate('merkleRoot', self.lang);
          const merkleRootTitle = new ValuePanelContainer(self.widget, { style: 'anchoredHash', split: true, fontRatio: { item: 0.0455 } });
          merkleRootTitle.set(merkleRootLabel, merkleRoot);
          this.element.wrapper.append(merkleRootTitle.get().render());
        }
      }
    }
  }

  get() {
    return this.element;
  }
}

export default AnchorPanelContainer;
