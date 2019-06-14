import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * HeaderPanelContainer
 *
 * The container display headers of sub-sections
 */
class HeaderPanelContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    const { panel: { header: headerOptions } } = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.label.code)
    });

    this.element.target().style
      .setProperty('--proof-verifier-panel-header-color', headerOptions.color);
  }
  
  set(label) {
    this.element.html(`<span>${label}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default HeaderPanelContainer;
