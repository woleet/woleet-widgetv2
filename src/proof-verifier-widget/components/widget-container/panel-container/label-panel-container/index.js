import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';

/**
 * TitlePanelContainer
 */
class TitlePanelContainer {
  constructor(widget, options = {filled: false, split: false}) {
    this.element = null;
    this.widget = widget;
    this.options = options;
    this.lang = this.widget.configurator.getLanguage();
    this.styles = this.widget.configurator.getStyles();
  
    this.init();
  }
  
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.title.code)
    });
    this.element.label = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.panelContainer.title.label.code)
    });
    
    const valueClassCode = this.options.filled ?
      styleCodes.panelContainer.title.valueFilled : styleCodes.panelContainer.title.value;
    this.element.value = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, valueClassCode.code)
    });
  }
  
  set(label, value) {
    let oValue = value;
    this.element.label.html(`<span>${label}</span>`);
    
    if (this.options.split) {
      const halfValueLength = Math.ceil(value.length / 2);
      oValue = `${value.substr(0, halfValueLength)}<br>${value.substr(halfValueLength + 1)}`
    }
    
    this.element.value.html(`<span>${oValue}</span>`);
  }
  
  get() {
    return this.element;
  }
}

export default TitlePanelContainer;
