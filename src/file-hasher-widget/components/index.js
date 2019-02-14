import virtualDOMService from '../../common/services/virtualDOM';
import utils from '../../common/services/utils';
import styles from './index.scss';

/**
 * Define a class of the widget
 */
class FileHasherWidget {
  constructor(configuration) {
    this.classCodes = ['woleet_file-hasher-widget__wrapper'];
    this.lang = configuration.lang;
  }
  
  render() {
    const element = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes)});
    element.text(window.i18n.t('select_file_to_hash', { lng: this.lang }));
    return element.render();
  }
}

export default FileHasherWidget;
