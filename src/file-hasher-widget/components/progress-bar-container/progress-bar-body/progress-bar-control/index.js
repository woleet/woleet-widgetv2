import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import faTimes from 'Resources/images/times.svg';
import styles from './index.scss';

/**
 * ProgressBarControl
 * The container displays a cross to close the progress
 */
class ProgressBarControl {
  constructor(widget, observerMapper) {
    this.element = null;
    this.widget = widget;
    this.observerMapper = observerMapper;
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.code)
    });

    this.element.icon = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.progress.control.icon.code)
    });

    this.initializeEvents();
    this.stylize();
  }

  /**
   * Events
   */
  initializeEvents() {
    const self = this;
    if (this.observerMapper.processCanceledObserver) {
      // If the cross icon was clicked, broadcast the event to all containers
      this.element.icon.on('click', function () {
        // Notify and make the same behaviour on click reset widget button
        self.widget.observers.widgetResetObserver.broadcast();
      });
    }
  }

  /**
   * Stylize the container
   */
  stylize() {
    const {
      progress: { icon: { color: progressIconColor } }
    } = this.widget.configurator.getStyles();

    this.element.icon.setSvg(faTimes, progressIconColor);
  }

  get() {
    return this.element;
  }
}

export default ProgressBarControl;
