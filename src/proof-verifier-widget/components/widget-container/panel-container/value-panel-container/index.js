import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * ValuePanelContainer
 *
 * The container display customized title of the PANEL container
 */
class ValuePanelContainer {
  constructor(widget, options = {split: false, theme: false, small: false}) {
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
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.value.code)
    });
    this.element.label = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.value.label.code)
    });
    
    const valueClassCode = this.options.theme ?
      styleCodes.panelContainer.value.theme : styleCodes.panelContainer.value.default;
    this.element.item = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, valueClassCode.code)
    });
  }

  /**
   * Set the label according with the options
   * @param label
   * @param value
   */
  set(label, value) {
    const {panel: { value: valueOptions }} = this.widget.configurator.getStyles();
    let oValue = value;
    this.element.label.html(`<span>${label}</span>`);

    // Display split hash
    if (this.options.split) {
      const halfValueLength = Math.ceil(value.length / 2);
      oValue = `${value.substr(0, halfValueLength)}<br>${value.substr(halfValueLength)}`
    }

    // Display the smaller text
    if (this.options.small) {
      this.element.target().style
        .setProperty('--proof-verifier-panel-value-font-size', '75%');
    }

    // And the color text
    const colorOptions = valueOptions.theme && valueOptions.theme[this.options.theme] ?
      valueOptions.theme[this.options.theme] : valueOptions;
  
    this.element.target().style
      .setProperty('--proof-verifier-panel-value-color', colorOptions.color);
    this.element.target().style
      .setProperty('--proof-verifier-panel-value-background-color', colorOptions.background);
    
    this.element.item.html(`<span>${oValue}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default ValuePanelContainer;
