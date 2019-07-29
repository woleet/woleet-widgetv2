import VirtualDOMService from 'Common/services/virtual-dom';
import constants from 'Common/constants';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import faDownload from 'Resources/images/file-download.svg';
import faExternalLink from 'Resources/images/external-link-alt.svg';

/**
 * ControlPanelContainer
 *
 * The container that contains controls and links
 */
class ControlPanelContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
    this.receipt = null;
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.code)
    });

    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.wrapper.code)
    });
    
    // The link to show the transaction
    this.element.wrapper.viewTransactionEl = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.item.code)
    });
    this.element.wrapper.viewTransactionEl.linkEl = VirtualDOMService.createElement('a',{
      classes: utils.extractClasses(styles, styleCodes.widget.cursorPointer)
    });
    this.element.wrapper.viewTransactionEl.linkEl.html(
      `<i>${faExternalLink}</i>` + `<span>${utils.translate('view_transaction', this.lang)}</span>`
    );
    this.element.wrapper.viewTransactionEl.hide();

    // The link to download the receipt
    this.element.wrapper.downloadReceiptEl = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.item.code)
    });
    this.element.wrapper.downloadReceiptEl.linkEl = VirtualDOMService.createElement('a',{
      classes: utils.extractClasses(styles, styleCodes.widget.cursorPointer)
    });
    this.element.wrapper.downloadReceiptEl.linkEl.html(
      `<i>${faDownload}</i>` + `<span>${utils.translate('click_to_download_proof_receipt', this.lang)}</span>`
    );
    this.element.wrapper.downloadReceiptEl.hide();
    this.element.hide();
    
    this.initializeEvents();
    this.initializeObservers();
    this.stylize();
  };
  
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
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    // Download the receipt file if the link was clicked
    this.element.wrapper.downloadReceiptEl.linkEl.on('click', () => {
      if (self.receipt !== null) {
        const {receipt: {targetHash = null}} = self.receipt;
        if (targetHash !== null) {
          const filename = `${targetHash}_receipt.json`;
          utils.saveObjectAs(self.receipt, filename);
        }
      }
    });
  }

  /**
   * Stylize the element: responsive, customization and etc.
   */
  stylize() {
    const { panel: { control: controlOptions } } = this.widget.configurator.getStyles();

    this.element.target().style
      .setProperty('--proof-verifier-control-color', controlOptions.color);
    this.element.target().style
      .setProperty('--proof-verifier-control-background-color', controlOptions.background);
  }

  /**
   * If the receipt was verified
   * @param verificationResult
   * @param receipt
   */
  receiptParsed(verificationResult, receipt) {
    const self = this;
    let { endpoints: { transaction: transactionUrl } } = this.widget.configurator.get();

    if (!transactionUrl) {
      transactionUrl = constants.TRANSACTION_URL;
    }

    if (receipt) {
      // Build and display the transaction link
      self.receipt = receipt;
      self.element.show();
      self.element.wrapper.downloadReceiptEl.show();
      const {anchors = []} = receipt;
      if (anchors.length > 0) {
        self.element.wrapper.viewTransactionEl.show();
        const transaction = anchors[0];
        self.element.wrapper.viewTransactionEl.linkEl
          .attr('target', '_blank')
          .attr('href', transactionUrl.replace('$sourceId', transaction.sourceId));
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default ControlPanelContainer;
