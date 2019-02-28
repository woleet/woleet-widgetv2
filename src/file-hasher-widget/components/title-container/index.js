import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponets/style-codes';
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
    this.widget.observers.downloadModeInitiatedObserver.subscribe((data) => {
      this.downloadModeInitiated(data)
    });
    this.widget.observers.dropContainerHashingStartedObserver.subscribe((data) => {
      this.hashingStarted(data)
    });
    this.widget.observers.dropContainerHashingFinishedObserver.subscribe((data) => {
      this.hashingFinished(data)
    });
    this.widget.observers.dropContainerHashingCanceledObserver.subscribe((data) => {
      this.hashingFinished(data)
    });
    this.widget.observers.titleShownObserver.subscribe((data) => {
      this.titleShown(data)
    });
    this.widget.observers.titleHiddenObserver.subscribe((data) => {
      this.titleHidden(data)
    });
  }
  
  hashingStarted() {
    this.element.title.text(utils.translate('file_hashing_in_progress', this.lang));
  }
  
  hashingFinished() {
    this.element.title.text(utils.translate('file_hashing_done', this.lang));
  }

  downloadModeInitiated(fileConfiguration) {
    if (fileConfiguration.fast_download) {
      this.element.title.text(utils.translate('file_downloading_in_progress', this.lang));
    } else {
      this.element.title.text(utils.translate('click_to_download', this.lang));
    }
  }

  titleShown() {
    this.element.show();
  }

  titleHidden() {
    this.element.hide();
  }
  
  get() {
    return this.element;
  }
}

export default TitleContainer;
