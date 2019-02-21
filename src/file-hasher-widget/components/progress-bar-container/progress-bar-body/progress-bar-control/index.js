import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
import styles from './index.scss';

/**
 * ProgressBarControl
 */
class ProgressBarControl {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.init();
  }
  
  init() {
    const self = this;
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.code)
    });

    this.element.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.icon.code)
    });

    this.element.icon.html(utils.getSolidIconSVG('faTimes'));

    /**
     * Events
     */
    this.element.icon.on('click', function () {
      self.widget.observers.dropContainerHashingCanceledObserver.broadcast();
    });
  }
  
  get() {
    return this.element;
  }
}

export default ProgressBarControl;
