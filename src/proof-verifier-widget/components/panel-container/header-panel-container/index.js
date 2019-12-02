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

    this.initializeObservers();
    this.stylize();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    self.widget.observers.windowResizedObserver.subscribe(() => {
      // self.changeTitleFont();
      self.makeResponsive();
    });
  }

  /**
   * Stylize the element: responsive, customization and etc.
   */
  stylize() {
    const self = this;
    const { panel } = this.widget.configurator.getStyles();
    const { header: headerOptions, width: panelWidth  } = panel;
    self.element.target().style
      .setProperty('--proof-verifier-panel-header-color', headerOptions.color);

    setTimeout(() => {
      self.makeResponsive();
    }, 0);
  }

  /**
   * Change the title font size
   */
  changeTitleFont() {
    const cssProperties = getComputedStyle(this.element.target());
    const {'width': elementItemWidth} = cssProperties;

    // Adapt the font size
    const fontSize = utils.calculateResponsiveFontSize(elementItemWidth, 0.13, 16);
    this.element.target().style.setProperty('font-size', `${fontSize}px`);
  }

  /**
   * Make it responsive
   */
  makeResponsive() {
    const cssProperties = getComputedStyle(this.widget.panel.target());
    const {'width': panelWidth} = cssProperties;

    // TODO: refactor
    if (parseFloat(panelWidth) < 540) {
      this.element.addClass(utils.extractClasses(styles, styleCodes.panelContainer.header['responsive-small'].code));
    } else {
      this.element.removeClass(utils.extractClasses(styles, styleCodes.panelContainer.header['responsive-small'].code));
    }
  }
  
  set(label,icon) {
    this.element.html(`<span>${label}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default HeaderPanelContainer;
