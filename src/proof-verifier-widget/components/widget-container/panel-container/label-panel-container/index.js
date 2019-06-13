import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * LabelPanelContainer
 *
 * The containers displays the label of each section
 */
class LabelPanelContainer {
  constructor() {
    this.element = null;
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.label.code)
    });
  }
  
  set(label) {
    this.element.html(`<span>${label}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default LabelPanelContainer;
