import VirtualDOMService from 'Common/services/virtual-dom';
import constants from 'Common/constants';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import faDownload from 'Resources/images/file-download.svg';
import faExternalLink from 'Resources/images/external-link-alt.svg';

/**
 * ControlPanelContainer
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
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.code)
    });

    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.wrapper.code)
    });
    
    /**
     * viewTransactionEl
     * */
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

    /**
     * downloadReceiptEl
     * */
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
  };
  
  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    self.widget.observers.receiptVerifiedObserver.subscribe((data) => {
      self.receiptParsed(data);
    });
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
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

  receiptParsed(receiptObj) {
    const self = this;

    if (receiptObj) {
      self.receipt = receiptObj;
      self.element.show();
      self.element.wrapper.downloadReceiptEl.show();
      const {receipt: {anchors = []}} = receiptObj;
      if (anchors.length > 0) {
        self.element.wrapper.viewTransactionEl.show();
        const transaction = anchors[0];
        self.element.wrapper.viewTransactionEl.linkEl
          .attr('target', '_blank')
          .attr('href',constants.TRANSACTION_URL.replace('$sourceId', transaction.sourceId));
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default ControlPanelContainer;
