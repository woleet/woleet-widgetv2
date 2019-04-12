import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import constants from 'Common/constants'
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import Logo from 'Resources/images/icon_logo.svg';
import BannerContainer from "./banner-container";
import PanelContainer from "./panel-container";

/**
 * WidgetContainer
 */
class WidgetContainer {
  constructor(widget) {
    this.widget = widget;
    this.fileReader = new FileReader();
    this.iconAttributes = utils.svgToHTML(Logo);
    this.receipt = this.widget.configuration.receipt;
    this.styles = this.widget.configurator.getStyles();
    this.lang = this.widget.configurator.getLanguage();
    this.verifier = window.woleet ? window.woleet.verify : null;
    this.cursorPointerClass = utils.extractClasses(styles, ['cursor-pointer'])[0];

    this.observerMappers = {
      receipt: {
        'downloadingFinished': 'receiptDownloadingFinishedObserver',
        'downloadingFailed': 'receiptDownloadingFailedObserver'
      }
    };

    this.init();
  }
  
  init() {
    let {mode} = this.widget.configuration;
    let {el: logoElement, attributes: {width: iconWidth, height: iconHeight}} = this.iconAttributes;

    if (this.styles.icon.width !== null) {
      iconWidth = this.styles.icon.width;
    }

    if (this.styles.icon.height !== null) {
      iconHeight = this.styles.icon.height;
    }
    
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.containers.code)
    });
  
    this.element.iconContainer = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.iconContainer.code)
    });
    this.element.iconContainer.style({width: iconWidth, height: iconHeight});
    const xml = new XMLSerializer().serializeToString(logoElement);
    const image = `data:image/svg+xml;base64,${btoa(xml)}`;
    this.element.iconContainer.attr('src', image);
  
    this.element.bannerContainer = (new BannerContainer(this.widget, {height: iconHeight, width: iconWidth})).get();
    this.element.panelContainer = (new PanelContainer(this.widget, {height: iconHeight, width: iconWidth})).get();

    this.initializeObservers();
    this.initializeContainerView(mode);
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    this.widget.observers.widgetInitializedObserver.subscribe((data) => {
      if (self.receipt && self.receipt.url) {
        self.downloadFile(self.receipt.url, self.observerMappers.receipt)
      }
    });
    this.widget.observers.receiptDownloadingFinishedObserver.subscribe((data) => {
      self.receiptFileDownloaded(data)
    });
    this.widget.observers.receiptDownloadingFailedObserver.subscribe((data) => {
      self.receiptFileFailed(data)
    });
    this.fileReader.onload = function() {
      try {
        let parsedResult = JSON.parse(this.result);
        self.widget.observers.receiptParsedObserver.broadcast(parsedResult);
        self.verifyReceiptFile(parsedResult);
      } catch(err) {}
    };
  }

  downloadFile(url, observerMapper) {
    const downloadFilename = utils.getUrlToDownload(url);
    const request = utils.getHttpRequest(downloadFilename, this.widget, observerMapper, url, true);
    request.start();
  }

  verifyReceiptFile(receiptJson) {
    const self = this;
    /*TODO: add hash*/
    self.verifier.receipt(receiptJson)
      .then((result) => {
        self.widget.observers.receiptVerifiedObserver.broadcast(result);
      });
  }

  receiptFileDownloaded(blob) {
    this.fileReader.readAsText(blob);
  }

  receiptFileFailed(error) {
    this.widget.observers.errorCaughtObserver.broadcast(error);
  }

  /**
   * Initialize events for the ICON mode
   */
  initializeEvents() {
    const self = this;

    self.element.iconContainer.on('click', () => {
      self.widget.observers.iconClickedObserver.broadcast();
    });
  }

  /**
   * Initialize the containers view according with the widget mode
   */
  initializeContainerView(mode) {
    const self = this;
    
    switch(mode) {
      case constants.PROOF_VERIFIER_MODE_ICON:
        self.element.iconContainer.addClass(self.cursorPointerClass);
        self.initializeEvents();
        break;
      default:
        break
    }
  }

  get() {
    return this.element;
  }
}

export default WidgetContainer;
