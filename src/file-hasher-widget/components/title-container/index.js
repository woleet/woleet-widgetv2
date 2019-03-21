import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
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
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.title.container.code)
    });
    this.element.title = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.title.code)
    });

    this.initializeObservers();
    this.uploadModeInitiated();
  }

  // Initialize the observers
  initializeObservers() {
    this.widget.observers.downloadModeInitiatedObserver.subscribe((data) => {
      this.downloadModeInitiated(data)
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      this.uploadModeInitiated(data)
    });
    this.widget.observers.hashingStartedObserver.subscribe((data) => {
      this.hashingStarted(data)
    });
    this.widget.observers.downloadingStartedObserver.subscribe((data) => {
      this.hashingStarted(data)
    });
    this.widget.observers.downloadingFinishedObserver.subscribe((data) => {
      this.downloadingFinished(data)
    });
    this.widget.observers.downloadingCanceledObserver.subscribe((data) => {
      this.downloadingFinished(data);
    });
    this.widget.observers.hashingFinishedObserver.subscribe((data) => {
      this.hashingFinished(data)
    });
    this.widget.observers.errorHiddenObserver.subscribe((data) => {
      this.titleShown(data)
    });
    this.widget.observers.errorCaughtObserver.subscribe((data) => {
      this.titleHidden(data)
    });
  }
  
  hashingStarted() {
    this.element.show();
    this.element.title.text(utils.translate('file_hashing_in_progress', this.lang));
  }
  
  downloadingStarted() {
    this.element.show();
    this.element.title.text(utils.translate('file_downloading_in_progress', this.lang));
  }
  
  hashingFinished() {
    this.element.title.text(utils.translate('file_hashing_done', this.lang));
  }

  downloadingFinished() {
    this.element.title.text(utils.translate('select_file_to_hash', this.lang));
  }

  downloadModeInitiated(fileConfiguration) {
    if (utils.getObjectProperty(fileConfiguration, 'fastDownload')) {
      this.downloadingStarted();
    } else {
      this.element.title.text(utils.translate('click_to_download', this.lang));
    }
  }

  uploadModeInitiated() {
    this.element.show();
    this.element.title.text(utils.translate('select_file_to_hash', this.lang));
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
