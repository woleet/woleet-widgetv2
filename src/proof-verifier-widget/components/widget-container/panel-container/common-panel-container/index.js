import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import ValuePanelContainer from "ProofVerifierComponents/widget-container/panel-container/value-panel-container";
import HeaderPanelContainer from "ProofVerifierComponents/widget-container/panel-container/header-panel-container";
import constants from "Common/constants";

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
  }
  
  // Initialize the observers
  initializeObservers() {
    const self = this;

    // If the receipt was verified
    self.widget.observers.receiptVerifiedObserver.subscribe((data, receipt) => {
      self.receiptParsed(data, receipt);
    });
  }

  /**
   * If the receipt was verified
   */
  receiptParsed(verificationResult, receipt) {
    const self = this;
    if (verificationResult) {
      const {identityVerificationStatus: { identity, code, certificates = [] } } = verificationResult;

      if (identity || code || certificates) {
        this.element.show();
        // Set the content of both section blocks
        if (identity) {
          self.renderLeftSide(code, certificates);
          self.renderRightSide(identity)
        }
      }
    }
  }

  /**
   * Render the content of the right block
   * @param identity
   */
  renderRightSide(identity) {
    const self = this;
    /**
     * Set block label
     */
    let label = utils.translate('claimed_identity', self.lang);
    let labelObject = new HeaderPanelContainer(self.widget);
    labelObject.set(label);
    this.element.wrapper.rightSide.append(labelObject.get().render());
    
    if (identity.commonName) {
      let label = utils.translate('common_name', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.commonName);
      this.element.wrapper.rightSide.append(titleObject.get().render());
    }
  
    if (identity.organization) {
      let label = utils.translate('organization', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.organization);
      this.element.wrapper.rightSide.append(titleObject.get().render());
    }
  
    if (identity.organizationalUnit) {
      let label = utils.translate('organizational_unit', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.organizationalUnit);
      this.element.wrapper.rightSide.append(titleObject.get().render());
    }
  
    if (identity.locality) {
      let label = utils.translate('locality', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.locality);
      this.element.wrapper.rightSide.append(titleObject.get().render());
    }
  
    if (identity.country) {
      let label = utils.translate('country', self.lang);
      let titleObject = new ValuePanelContainer(self.widget);
      titleObject.set(label, identity.country);
      this.element.wrapper.rightSide.append(titleObject.get().render());
    }
  }

  /**
   * Render the content of the left block
   * @param status
   * @param certificates
   */
  renderLeftSide(status, certificates) {
    const self = this;
    
    if (status) {
      let label = utils.translate('identity_server', self.lang);
      let labelObject = new HeaderPanelContainer(self.widget);
      labelObject.set(label);
      this.element.wrapper.leftSide.append(labelObject.get().render());
  
      let urlLabel = utils.translate('identity_url', self.lang);
      let urlObject = new ValuePanelContainer(self.widget);
      urlObject.set(urlLabel, constants.RECEIPT_IDENTITY_URL);
      this.element.wrapper.leftSide.append(urlObject.get().render());
  
      let statusLabel = utils.translate('status', self.lang);
      let statusObject = new ValuePanelContainer(self.widget);
      statusObject.set(statusLabel, status);
      this.element.wrapper.leftSide.append(statusObject.get().render());
    }
    
    if (certificates && certificates.length > 0) {
      let label = utils.translate('server_certificates', self.lang);
      let labelObject = new HeaderPanelContainer(self.widget);
      labelObject.set(label);
      this.element.wrapper.leftSide.append(labelObject.get().render());
      
      certificates.forEach((certificate) => {
        const {issuer, subject} = certificate;
        const subjectLabel = utils.translate('identity', self.lang);
        const subjectTitle = new ValuePanelContainer(self.widget, { small: true });
        const subjectValue = `${subject.CN || ''} : ${subject.O || ''} ${subject.OU || ''} ${subject.L || ''} ${subject.ST || ''} ${subject.C || ''}`;
        subjectTitle.set(subjectLabel, subjectValue);
        this.element.wrapper.leftSide.append(subjectTitle.get().render());
        
        const issuerLabel = utils.translate('certified_by', self.lang);
        const issuerTitle = new ValuePanelContainer(self.widget, { small: true });
        const issuerValue = `${issuer.CN || ''} : ${issuer.O || ''} ${subject.OU || ''} ${issuer.L || ''} ${issuer.ST || ''} ${issuer.C || ''}`;
        issuerTitle.set(issuerLabel, issuerValue);
        this.element.wrapper.leftSide.append(issuerTitle.get().render());
      });
    }
  }
  
  get() {
    return this.element;
  }
}

export default CommonPanelContainer;
