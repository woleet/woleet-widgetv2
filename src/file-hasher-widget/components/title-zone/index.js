import virtualDOMService from '../../../common/services/virtual-dom';
import utils from '../../../common/services/utils';
import styles from './index.scss';

/**
 * TitleZone
 */
class TitleZone {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.classCodes = {
      titleZone: ['title_zone'],
      title: ['title']
    };
  
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes.titleZone)});
    this.element.title = virtualDOMService.createElement('span', {classes: utils.extractClasses(styles, this.classCodes.title)});
    this.element.title.text(utils.translate('select_file_to_hash', this.widget.configurator.getLanguage()));
  }
  
  get() {
    return this.element;
  }
}

export default TitleZone;
