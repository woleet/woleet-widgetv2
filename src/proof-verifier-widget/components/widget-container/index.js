import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import constants from 'Common/constants'
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import Logo from 'Resources/images/icon_logo.svg';

/**
 * WidgetContainer
 */
class WidgetContainer {
  constructor(widget) {
    this.widget = widget;
    this.expanded = false;
    this.animationClass = null;
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
    const {mode} = this.widget.configuration;
    const {el: logoElement, attributes: {width: iconWidth, height: iconHeight}} = this.iconAttributes;
    
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.containers.code)
    });
  
    this.element.iconContainer = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.iconContainer.code)
    });
    this.element.iconContainer.style({width: `${iconWidth}`, height: `${iconHeight}`});
    this.element.iconContainer.append(logoElement);
  
    this.element.bannerContainer = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.bannerContainer.code)
    });
    this.element.bannerContainer.style({height: `${iconHeight}`});
  
    this.element.panelContainer = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.code)
    });
    
    if (this.styles.panel.width === null) {
      this.styles.panel.width = parseInt(iconWidth, 10) + parseInt(this.styles.banner.width, 10) + 'px';
    }
    
    console.log('this.styles', this.styles);

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
  initializeIconModeEvents() {
    const self = this;

    self.element.iconContainer.on('click', () => {
      if (self.expanded) {
        self.element.bannerContainer.removeClass(self.animationClass);
      } else {
        self.element.bannerContainer.addClass(self.animationClass);
        self.element.bannerContainer.target().style.setProperty('--proof-verifier-banner-width', self.styles.banner.width);
      }
      self.expanded = !self.expanded;
    });
  }

  /**
   * Initialize events for the BANNER mode
   */
  initializeBannerModeEvents() {
    const self = this;
    
    self.element.bannerContainer.on('click', () => {
      if (self.expanded) {
        self.element.panelContainer.removeClass(self.animationClass);
      } else {
        self.element.panelContainer.addClass(self.animationClass);
        self.element.panelContainer.target().style.setProperty('--proof-verifier-panel-height', self.styles.panel.height);
      }
      self.expanded = !self.expanded;
    });
  }

  /**
   * Initialize events for the PANEL mode
   */
  initializePanelModeEvents() {
    const self = this;
  }

  /**
   * Initialize the containers view according with the widget mode
   */
  initializeContainerView(mode) {
    const self = this;
    
    switch(mode) {
      case constants.PROOF_VERIFIER_MODE_PANEL:
        this.expanded = true;
        self.element.bannerContainer.style({width: `${self.styles.banner.width}`});
        self.element.panelContainer.style({width: `${self.styles.panel.width}`, height: `${self.styles.panel.height}`});

        self.initializePanelModeEvents();
        break;
      case constants.PROOF_VERIFIER_MODE_BANNER:
        self.animationClass = utils.extractClasses(styles, ['panel-expended'])[0];
        self.element.bannerContainer.addClass(self.cursorPointerClass);
        self.element.bannerContainer.style({width: `${self.styles.banner.width}`});
  
        self.initializeBannerModeEvents();
        break;
      case constants.PROOF_VERIFIER_MODE_ICON:
      default:
        self.animationClass = utils.extractClasses(styles, ['banner-expended'])[0];
        self.element.iconContainer.addClass(self.cursorPointerClass);
        this.element.panelContainer.hide();
        
        self.initializeIconModeEvents();
        break;
    }
  }

  get() {
    return this.element;
  }
}

export default WidgetContainer;
