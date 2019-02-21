import virtualDOMService from '../../../common/services/virtual-dom';
import utils from '../../../common/services/utils';
import styleCodes from '../style-codes';
import styles from './index.scss';

/**
 * TitleContainer
 */
class TitleContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
  
    this.init();
  }
  
  init() {
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.title.container.code)
    });
    this.element.title = virtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.title.code)
    });
    this.element.title.text(utils.translate('select_file_to_hash', this.lang));
    
    // Initialize the observers
    this.widget.observers.dropContainerHashingStartedObserver.subscribe((data) => {
      this.hashingStartedObserver(data)
    });
    this.widget.observers.dropContainerHashingFinishedObserver.subscribe((data) => {
      this.hashingFinishedObserver(data)
    });
    this.widget.observers.titleShownObserver.subscribe((data) => {
      this.titleShownObserver(data)
    });
    this.widget.observers.titleHiddenObserver.subscribe((data) => {
      this.titleHiddenObserver(data)
    });
  }
  
  hashingStartedObserver() {
    this.element.title.text(utils.translate('file_hashing_in_progress', this.lang));
  }
  
  hashingFinishedObserver() {
    this.element.title.text(utils.translate('file_hashing_done', this.lang));
  }

  titleShownObserver() {
    this.element.show();
  }

  titleHiddenObserver() {
    this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default TitleContainer;
