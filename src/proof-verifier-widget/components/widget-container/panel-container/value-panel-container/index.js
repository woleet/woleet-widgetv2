import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * ValuePanelContainer
 *
 * The container displays customized title of the PANEL container
 */
class ValuePanelContainer {
  constructor(widget, options) {
    const defaultOptions = {split: false, style: false, wordBreak: false, fontRatio: {label: 0.1, item: 0.1}};
    const mergedOptions = Object.assign({}, defaultOptions, options);

    this.element = null;
    this.widget = widget;
    this.options = mergedOptions;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.value.code)
    });
    this.element.label = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.value.label.code)
    });
    
    const valueClassCode = this.options.style ?
      styleCodes.panelContainer.value.style : styleCodes.panelContainer.value.default;
    this.element.item = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, valueClassCode.code)
    });

    this.stylize();
  }

  /**
   * Stylize the element: responsive, customization and etc.
   */
  stylize() {
    const self = this;
    const {panel} = this.widget.configurator.getStyles();
    const { value: valueOptions, width: panelWidth } = panel;

    // And the color text
    const colorOptions = valueOptions.style && valueOptions.style[this.options.style] ?
      valueOptions.style[this.options.style] : valueOptions;

    // Define element properties
    if (this.options.wordBreak) {
      this.element.item.target().style.setProperty('word-break', 'break-word');
      //MS Edge fix
      this.element.item.target().style.setProperty('word-wrap', 'break-word');
    }

    this.element.target().style
      .setProperty('--proof-verifier-panel-value-color', colorOptions.color);
    this.element.target().style
      .setProperty('--proof-verifier-panel-value-background-color', colorOptions.background);

    setTimeout(() => {
      const cssProperties = getComputedStyle(this.element.target());
      const {'width': elementItemWidth} = cssProperties;
      // Adapt the font size
      const labelFontSize = utils.calculateResponsiveFontSize(elementItemWidth, self.options.fontRatio.label);
      const itemFontSize = utils.calculateResponsiveFontSize(elementItemWidth, self.options.fontRatio.item);
      self.element.label.target().style.setProperty('font-size', `${labelFontSize}px`);
      self.element.item.target().style.setProperty('font-size', `${itemFontSize}px`);
    }, 0);

    // TODO: refactor
    if (parseFloat(panelWidth) < 400) {
      this.element.label.addClass(utils.extractClasses(styles, styleCodes.panelContainer.value['responsive-small'].label.code));
      this.element.item.addClass(utils.extractClasses(styles, styleCodes.panelContainer.value['responsive-small'].code));
    }
  }

  /**
   * Set the label according with the options
   * @param label
   * @param value
   */
  set(label, value) {
    let oValue = value;
    this.element.label.html(`<span>${label}</span>`);

    // Display split hash
    if (this.options.split) {
      const halfValueLength = Math.ceil(value.length / 2);
      oValue = `${value.substr(0, halfValueLength)}<br>${value.substr(halfValueLength)}`
    }
    
    this.element.item.html(`<span>${oValue}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default ValuePanelContainer;
