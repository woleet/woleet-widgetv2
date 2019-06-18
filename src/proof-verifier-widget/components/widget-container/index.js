import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import woleetApi from 'Common/services/api';
import constants from 'Common/constants'
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import Icon from 'Resources/images/icon.svg';
import BannerContainer from "./banner-container";
import PanelContainer from "./panel-container";
import loader from "Common/services/loader";

/**
 * WidgetContainer
 *
 * This is the common widget container
 */
class WidgetContainer {
  constructor(widget) {
    this.widget = widget;
    this.fileReader = new FileReader();
    this.iconAttributes = utils.svgToHTML(Icon);
    this.receipt = this.widget.configuration.receipt;
    this.styles = this.widget.configurator.getStyles();
    this.lang = this.widget.configurator.getLanguage();
    this.cursorPointerClass = utils.extractClasses(styles, ['cursor-pointer'])[0];

    if (!window.woleet) {
      // If Woleet library wasn't initialized, initialize it
      loader.getWoleetLibs()
        .then((woleet) => {
          window.woleet = woleet;
          this.verifier = window.woleet ? window.woleet.verify : null;
          this.receiptService = window.woleet ? window.woleet.receipt : null;
        });
    } else {
      this.verifier = window.woleet ? window.woleet.verify : null;
      this.receiptService = window.woleet ? window.woleet.receipt : null;
    }

    this.observerMappers = {
      receipt: {
        'downloadingFinished': 'receiptDownloadingFinishedObserver',
        'downloadingFailed': 'receiptDownloadingFailedObserver'
      }
    };

    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
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
    this.initializeStyles();
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

  /**
   * Initialize the widget styles
   */
  initializeStyles() {
    const {banner: bannerStyles, zindex: zIndex} = this.widget.configurator.getStyles();

    if (bannerStyles.title && bannerStyles.title.color) {
      this.element.target().style
        .setProperty('--proof-verifier-title-color', bannerStyles.title.color);
    }

    if (zIndex) {
      this.element.target().style
        .setProperty('--z-index', zIndex);
    }
  }

  downloadFile(url, observerMapper) {
    const downloadFilename = utils.getUrlToDownload(url, window.dev);
    const request = utils.getHttpRequest(downloadFilename, this.widget, observerMapper, url, true);
    request.start();
  }

  verifyReceiptFile(receiptJson) {
    const self = this;
    const promises = [];

    promises.push(self.verifier.receipt(receiptJson));
    promises.push(woleetApi.receipt.verify(receiptJson));

    return Promise.all(promises)
      .then(([verification, identityVerification]) => {
        verification.identityVerificationStatus = utils.extendObject(
          verification.identityVerificationStatus,
          identityVerification.identityVerificationStatus);
        self.widget.observers.receiptVerifiedObserver.broadcast(verification);
      });
    /**
     * TODO: client side verification. This methods returns boolean value
     * const verified = self.receiptService.validate(receiptJson);
     */
  }

  receiptFileDownloaded(blob) {
    this.fileReader.readAsText(blob);
  }

  receiptFileFailed(error) {
    this.widget.observers.errorCaughtObserver.broadcast(error);
    // this.element.iconContainer.off('click', this.iconClickCallback);
  }

  /**
   * Initialize events for the ICON mode
   */
  initializeEvents() {
    this.element.iconContainer.on('click', () => {
      this.widget.observers.iconClickedObserver.broadcast()
    });
  }

  /**
   * The callback to click on icon
   */
  iconClickCallback() {
    this.widget.observers.iconClickedObserver.broadcast();
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
