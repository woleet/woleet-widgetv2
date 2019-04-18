import VirtualDOMService from 'Common/services/virtual-dom';
import constants from 'Common/constants';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

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
    //27af9af30b8792be8746f1a44db6a827b5b68760319214138fdc2f544942737b
    /**
     * var n = new Blob([r],{
            type: "application/json;charset=utf-8"
        });
     e.saveAs(n, t)
     */

    const {banner: bannerStyles} = this.widget.configurator.getStyles();

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
      `<i>${utils.getSolidIconSVG('faExternalLinkAlt')}</i>` + `<span>${utils.translate('view_transaction', this.lang)}</span>`
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
      `<i>${utils.getSolidIconSVG('faDownload')}</i>` + `<span>${utils.translate('click_to_download_proof_receipt', this.lang)}</span>`
    );
    this.element.wrapper.downloadReceiptEl.hide();
    this.element.hide();
  
    if (bannerStyles.title && bannerStyles.title.color) {
      this.element.style
        .setProperty('--proof-verifier-banner-title-color', bannerStyles.title.color);
    }
    
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
          .attr('href',constants.TRANSACTION_URL.replace('$sourseId', transaction.sourceId));
        console.log('transaction', transaction.sourceId);
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default ControlPanelContainer;
