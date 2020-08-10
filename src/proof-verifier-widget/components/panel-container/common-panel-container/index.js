import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import ValuePanelContainer from 'ProofVerifierComponents/panel-container/value-panel-container';
import HeaderPanelContainer from 'ProofVerifierComponents/panel-container/header-panel-container';
import constants from 'ProofVerifierWidget/constants';

/**
 * CommonPanelContainer
 *
 * The container displays all info of the common section
 */
class CommonPanelContainer {
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
      classes: utils.extractClasses(styles, styleCodes.panelContainer.common.code)
    });
    this.element.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.common.wrapper.code)
    });

    // There are two parts: left and right
    this.element.wrapper.leftSide = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.common.item.code)
    });
    this.element.wrapper.rightSide = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.common.item.code)
    });

    this.element.hide();
    this.initializeObservers();
    this.stylize();
  }

  // Initialize the observers
  initializeObservers() {
    const self = this;

    // If the receipt was verified
    self.widget.observers.receiptVerifiedObserver.subscribe((data, receipt) => {
      self.receiptParsed(data, receipt);
    });

    self.widget.observers.windowResizedObserver.subscribe(() => {
      self.makeResponsive();
    });
  }

  /**
   * Stylize the element: responsive, customization and etc.
   */
  stylize() {
    setTimeout(() => {
      this.makeResponsive();
    }, 0);
  }

  /**
   * Make it responsive
   */
  makeResponsive() {
    const cssProperties = getComputedStyle(this.widget.panel.target());
    const { 'width': panelWidth } = cssProperties;

    if (parseFloat(panelWidth) < 540) {
      this.element.wrapper.leftSide.addClass(utils.extractClasses(styles, styleCodes.panelContainer.common.item['responsive-small'].code));
      this.element.wrapper.rightSide.addClass(utils.extractClasses(styles, styleCodes.panelContainer.common.item['responsive-small'].code));
    } else {
      this.element.wrapper.leftSide.removeClass(utils.extractClasses(styles, styleCodes.panelContainer.common.item['responsive-small'].code));
      this.element.wrapper.rightSide.removeClass(utils.extractClasses(styles, styleCodes.panelContainer.common.item['responsive-small'].code));
    }
  }

  /**
   * If the receipt was verified
   */
  receiptParsed(verificationResult, receipt) {
    const self = this;
    if (verificationResult && verificationResult.identityVerificationStatus) {
      const { identityVerificationStatus: { identity, code, certificates = [] } } = verificationResult;

      if (identity || code || certificates) {
        this.element.show();
        // Set the content of both section blocks
        if (identity) {
          self.renderLeftSide(identity);
          self.renderRightSide(code, certificates);
        }
      }
    }
  }

  /**
   * Render the content of the right block
   * @param identity
   */
  renderLeftSide(identity) {
    const self = this;
    /**
     * Set block label
     */
    let label = utils.translate('claimed_identity', self.lang);
    let labelObject = new HeaderPanelContainer(self.widget);
    labelObject.set(label);
    this.element.wrapper.leftSide.append(labelObject.get().render());

    if (identity.commonName) {
      let label = utils.translate('common_name', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.commonName);
      this.element.wrapper.leftSide.append(titleObject.get().render());
    }

    if (identity.organization) {
      let label = utils.translate('organization', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.organization);
      this.element.wrapper.leftSide.append(titleObject.get().render());
    }

    if (identity.organizationalUnit) {
      let label = utils.translate('organizational_unit', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.organizationalUnit);
      this.element.wrapper.leftSide.append(titleObject.get().render());
    }

    if (identity.locality) {
      let label = utils.translate('locality', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.locality);
      this.element.wrapper.leftSide.append(titleObject.get().render());
    }

    if (identity.country) {
      let label = utils.translate('country', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.country);
      this.element.wrapper.leftSide.append(titleObject.get().render());
    }
  }

  /**
   * Render the content of the left block
   * @param status
   * @param certificates
   */
  renderRightSide(status, certificates) {
    const self = this;
    let { endpoints: { identification: identificationUrl } } = this.widget.configurator.get();

    if (status) {
      if (!identificationUrl) {
        identificationUrl = constants.RECEIPT_IDENTITY_URL;
      }

      let label = utils.translate('identity_server', self.lang);
      let labelObject = new HeaderPanelContainer(self.widget);
      labelObject.set(label);
      this.element.wrapper.rightSide.append(labelObject.get().render());

      let urlLabel = utils.translate('identity_url', self.lang);
      let urlObject = new ValuePanelContainer(self.widget, { wordBreak: true });
      urlObject.set(urlLabel, identificationUrl);
      this.element.wrapper.rightSide.append(urlObject.get().render());

      let statusLabel = utils.translate('status', self.lang);
      let statusObject = new ValuePanelContainer(self.widget);
      statusObject.set(statusLabel, status);
      this.element.wrapper.rightSide.append(statusObject.get().render());
    }

    if (certificates && certificates.length > 0) {
      let label = utils.translate('server_certificates', self.lang);
      let labelObject = new HeaderPanelContainer(self.widget);
      labelObject.set(label);
      this.element.wrapper.rightSide.append(labelObject.get().render());

      certificates.forEach((certificate) => {
        const { issuer, subject } = certificate;
        const subjectLabel = utils.translate('identity', self.lang);
        const subjectTitle = new ValuePanelContainer(self.widget);
        const subjectValue = `${subject.CN || ''} : ${subject.O || ''} ${subject.OU || ''} ${subject.L || ''} ${subject.ST || ''} ${subject.C || ''}`;
        subjectTitle.set(subjectLabel, subjectValue);
        this.element.wrapper.rightSide.append(subjectTitle.get().render());

        const issuerLabel = utils.translate('certified_by', self.lang);
        const issuerTitle = new ValuePanelContainer(self.widget);
        const issuerValue = `${issuer.CN || ''} : ${issuer.O || ''} ${subject.OU || ''} ${issuer.L || ''} ${issuer.ST || ''} ${issuer.C || ''}`;
        issuerTitle.set(issuerLabel, issuerValue);
        this.element.wrapper.rightSide.append(issuerTitle.get().render());
      });
    }
  }

  get() {
    return this.element;
  }
}

export default CommonPanelContainer;
