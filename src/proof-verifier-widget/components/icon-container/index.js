import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import woleetApi from 'ProofVerifierWidget/services/api';
import constants from 'ProofVerifierWidget/constants';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import Icon from 'Resources/images/icon.svg';
import loader from 'Common/services/loader';

/**
 * IconContainer
 *
 * The container presents the icon mode
 */
class IconContainer {
  constructor(widget) {
    const self = this;
    this.widget = widget;
    this.delayedReceiptJson = null;
    this.fileReader = new FileReader();
    this.iconAttributes = utils.svgToHTML(Icon);
    this.receipt = this.widget.configuration.receipt;
    this.styles = this.widget.configurator.getStyles();
    this.lang = this.widget.configurator.getLanguage();
    this.cursorPointerClass = utils.extractClasses(styles, ['cursor-pointer'])[0];

    const { verification: { client: clientVerificated } } = this.widget.configuration;

    // If the receipt is verified by client side, initialize the library
    if (clientVerificated) {
      if (!window.woleet) {
        // If Woleet library wasn't initialized, initialize it
        loader.getWoleetLibs()
          .then((woleet) => {
            window.woleet = woleet;
            self.verifier = woleet ? woleet.verify : null;

            if (this.delayedReceiptJson) {
              self.verifyReceiptFile(this.delayedReceiptJson);
            }
          });
      } else {
        self.verifier = window.woleet ? window.woleet.verify : null;
      }
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
    let { mode } = this.widget.configuration;
    let { el: logoElement, attributes: { width: iconWidth, height: iconHeight } } = this.iconAttributes;

    if (this.styles.icon.width !== null) {
      iconWidth = this.styles.icon.width;
    }

    if (this.styles.icon.height !== null) {
      iconHeight = this.styles.icon.height;
    }

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.iconContainer.code)
    });

    this.element.iconContainer = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.iconContainer.icon.code)
    });
    this.element.iconContainer.style({ width: iconWidth, height: iconHeight });
    const xml = new XMLSerializer().serializeToString(logoElement);
    const image = `data:image/svg+xml;base64,${btoa(xml)}`;
    this.element.iconContainer.attr('src', image);

    this.initializeObservers();
    this.stylize();
    this.initializeContainerView(mode);
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    this.widget.observers.widgetInitializedObserver.subscribe((data) => {
      // If the receipt file wasn't defined broadcast an error
      if (!self.receipt || (!self.receipt.url && !self.receipt.payload)) {
        self.widget.observers.errorCaughtObserver.broadcast({ message: 'need_receipt' });
      } else if (self.receipt) {
        if (!self.receipt.url && self.receipt.payload) {
          if (utils.isObject(self.receipt.payload)) {
            self.prepareFileVerification(self.receipt.payload);
          } else {
            self.widget.observers.errorCaughtObserver.broadcast('receipt_json_broken');
          }
        } else if (self.receipt.url && !self.receipt.payload) {
          self.downloadFile(self.receipt.url, self.observerMappers.receipt);
        }
      }
    });
    this.widget.observers.receiptDownloadingFinishedObserver.subscribe((data) => {
      self.receiptFileDownloaded(data);
    });
    this.widget.observers.receiptDownloadingFailedObserver.subscribe((data) => {
      self.receiptFileFailed(data);
    });
    this.fileReader.onload = function () {
      try {
        let parsedResult = JSON.parse(this.result);
        self.widget.observers.receiptParsedObserver.broadcast(parsedResult);
        self.prepareFileVerification(parsedResult);
      } catch (err) {}
    };
  }

  /**
   * Initialize the widget styles
   */
  stylize() {
    const { banner: bannerStyles, zindex: zIndex } = this.widget.configurator.getStyles();

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

  /**
   * Prepare the file verification
   * @param receiptJson
   * @return {*}
   */
  prepareFileVerification(receiptJson) {
    const self = this;
    const { verification: { client: clientVerificated } } = this.widget.configuration;

    // If the receipt is verified by client side, check the verifier is loaded
    if (clientVerificated) {
      // If the verifier is ready, verify the receipt
      if (self.verifier) {
        this.verifyReceiptFile(receiptJson);
      } else {
        // Mark the file as delayed
        self.delayedReceiptJson = receiptJson;
      }
    } else {
      // Otherwise verify the receipt by the Woleet API
      this.verifyReceiptFile(receiptJson);
    }
  }

  verifyReceiptFile(receiptJson) {
    const self = this;
    const promises = [];
    const { verification: { client: clientVerificated }, endpoints: { verification: verificationUrl } } = this.widget.configuration;

    // If the receipt is verified by client side, verify by the Woleet weblibs
    if (clientVerificated) {
      promises.push(self.verifier.receipt(receiptJson));
    } else {
      // Otherwise verify the receipt by the Woleet API
      promises.push(woleetApi.receipt.verify(receiptJson, verificationUrl));
    }
    return Promise.all(promises)
      .then(([verification]) => {
        self.widget.observers.receiptVerifiedObserver.broadcast(verification, receiptJson);

        if (self.delayedReceiptJson) {
          self.delayedReceiptJson = null;
        }
      });
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
      this.widget.observers.iconClickedObserver.broadcast();
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

    switch (mode) {
      case constants.PROOF_VERIFIER_MODE_ICON:
        self.element.iconContainer.addClass(self.cursorPointerClass);
        self.initializeEvents();
        break;
      default:
        break;
    }
  }

  get() {
    return this.element;
  }
}

export default IconContainer;
