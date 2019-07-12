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
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.header.code)
    });

    this.stylize();
  }

  /**
   * Stylize the element: responsive, customization and etc.
   */
  stylize() {
    const self = this;
    const { panel } = this.widget.configurator.getStyles();
    const { header: headerOptions, width: panelWidth  } = panel;
    setTimeout(() => {
      const cssProperties = getComputedStyle(this.element.target());
      const {'width': elementItemWidth} = cssProperties;

      // Adapt the font size
      const fontSize = utils.calculateResponsiveFontSize(elementItemWidth, 0.13, 16);
      self.element.target().style.setProperty('font-size', `${fontSize}px`);
    }, 0);
    self.element.target().style
      .setProperty('--proof-verifier-panel-header-color', headerOptions.color);

    // TODO: refactor
    if (parseFloat(panelWidth) < 400) {
      self.element.addClass(utils.extractClasses(styles, styleCodes.panelContainer.header['responsive-small'].code));
    }
  }
  
  set(label) {
    this.element.html(`<span>${label}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default HeaderPanelContainer;
