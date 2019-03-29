import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'ProofVerifierComponents/style-codes';
import styles from './index.scss';
import BannerContainer from "ProofVerifierWidget/components/banner-container";

const Icon = require('svg-inline-loader?classPrefix!Resources/images/icon_logo.svg');

/**
 * IconContainer
 */
class IconContainer {
  constructor(widget) {
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();

    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.iconContainer.code)
    });

    this.element.iconWrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.iconContainer.wrapper.code)
    });

    this.element.iconWrapper.style({width: `${widgetStyles.icon.width}`, height: `${widgetStyles.icon.height}`});
    this.element.iconWrapper.html(Icon);

    this.element.pannelContainer = (new BannerContainer(this.widget)).get();
    this.element.pannelContainer.hide();

    this.initializeObservers();
    this.initializeEvents();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;

    self.element.iconWrapper.on('click', function () {
      console.log('click on icon');
    });
  }

  get() {
    return this.element;
  }
}

export default IconContainer;
