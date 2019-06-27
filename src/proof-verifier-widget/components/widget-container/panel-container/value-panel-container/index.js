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
  constructor(widget, options = {split: false, style: false, wordBreak: false}) {
    this.element = null;
    this.widget = widget;
    this.options = options;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    const self = this;
    const {panel} = this.widget.configurator.getStyles();
    const { value: valueOptions, width: panelWidth } = panel;

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

    // Define element properties
    if (this.options.wordBreak) {
      this.element.item.target().style
        .setProperty('word-break', 'break-word');
    }

    // And the color text
    const colorOptions = valueOptions.style && valueOptions.style[this.options.style] ?
      valueOptions.style[this.options.style] : valueOptions;

    this.element.target().style
      .setProperty('--proof-verifier-panel-value-color', colorOptions.color);
    this.element.target().style
      .setProperty('--proof-verifier-panel-value-background-color', colorOptions.background);

    if (parseFloat(panelWidth) < 400) {
      this.element.label.addClass(utils.extractClasses(styles, styleCodes.panelContainer.value['responsive-small'].label.code));
      this.element.item.addClass(utils.extractClasses(styles, styleCodes.panelContainer.value['responsive-small'].code));
    }

    setTimeout(() => {
      const cssProperties = getComputedStyle(this.element.target());
      const {'width': elementItemWidth} = cssProperties; //cssProperties.getPropertyValue('width');
      const floatElementItemWidth = parseFloat(elementItemWidth);

      // And recalculate the font size of the text zone to make it responsive
      let relFontsize = floatElementItemWidth * 0.08;
      if (relFontsize > 14) {
        relFontsize = 14;
      }

      self.element.item.target().style.setProperty('font-size', `${relFontsize}px`);

      console.log('cssProperties', elementItemWidth, panelWidth, floatElementItemWidth);

    }, 0)
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
