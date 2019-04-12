import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * ControlPanelContainer
 */
class ControlPanelContainer {
  constructor(widget, iconStyles) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
    this.receipt = null;
  
    this.init();
  }
  
  init() {
    //https://blockstream.info/tx/27af9af30b8792be8746f1a44db6a827b5b68760319214138fdc2f544942737b
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

    this.element.wrapper.viewTransactionEl = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.item.code)
    });
    this.element.wrapper.viewTransactionEl.linkEl = VirtualDOMService.createElement('a');
    this.element.wrapper.viewTransactionEl.hide();

    this.element.wrapper.downloadReceiptEl = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.control.item.code)
    });
    this.element.wrapper.downloadReceiptEl.linkEl = VirtualDOMService.createElement('a');
    this.element.wrapper.downloadReceiptEl.linkEl.html(utils.getSolidIconSVG('faDownload') + utils.translate('click_to_download_proof_receipt', this.lang));
    this.element.wrapper.downloadReceiptEl.hide();

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

    if (receiptObj && receiptObj !== null) {
      this.element.show();
      this.element.wrapper.downloadReceiptEl.show();
      const anchors = receiptObj.receipt.anchors || [];
      if (anchors.length > 0) {
        this.element.show();
        const transaction = anchors[0];

        console.log('transaction', transaction.sourceId);
      }
    }
  }
  
  get() {
    return this.element;
  }
}

export default ControlPanelContainer;
