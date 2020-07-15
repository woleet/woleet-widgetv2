import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';
import faFileImport from 'Resources/images/file-import.svg';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import loader from 'Common/services/loader';

/**
 * DropContainer area
 * It's a container to drop and select user files and hash them
 */
class DropContainer {
  constructor(widget, parent) {
    const self = this;

    this.element = null;
    this.widget = widget;
    this.parent = parent;
    this.delayedFile = null;
    this.importIcon = null;

    if (!window.woleet) {
      // Woleet library wasn't initialized do it
      loader.getWoleetLibs()
        .then((woleet) => {
          window.woleet = woleet;
          self.hasher = new woleet.file.Hasher();
          self.hashDelayedFile();
        });
    } else {
      self.hasher = new window.woleet.file.Hasher();
    }

    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.code)
    });

    this.element.body = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.body.code)
    });

    this.element.body.icon = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.drop.body.icon.code)
    });
    this.element.body.input = VirtualDOMService.createFileInput({
      classes: utils.extractClasses(styles, styleCodes.drop.body.input.code)
    });

    this.stylize();
    this.initializeObservers();
    this.initializeEvents();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;
    this.widget.observers.downloadModeInitiatedObserver.subscribe((data) => {
      this.downloadModeInitiated(data);
    });
    this.widget.observers.downloadingFailedObserver.subscribe((data, code, message) => {
      this.downloadingFailed(data);
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      this.uploadModeInitiated(data);
      this.hashingCanceled(data);
    });
    this.widget.observers.downloadingFinishedObserver.subscribe((data) => {
      this.startHashing(data).then(result => {
        if (result) {
          self.widget.observers.hashingFinishedObserver.broadcast(result);
        }
      });
    });
    this.widget.observers.errorCaughtObserver.subscribe(() => {
      this.downloadingStarted();
      this.hashingCanceled();
    });
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    // if the user select a file, start the hash process
    this.element.body.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then(result => {
          if (result) {
            self.widget.observers.hashingFinishedObserver.broadcast(result);
          }
        });
    });
  }

  /**
   * Stylize the container
   */
  stylize() {
    const self = this;
    const {
      icon: {
        width: iconWidth,
        color: iconColor
      },
      width: widgetWidth,
      height: widgetHeight
    } = this.widget.configurator.getStyles();
    const {
      icons: {
        import: importIcon
      }
    } = this.widget.configurator.get();

    if (importIcon) {
      this.importIcon = true;
      utils.toDataUrl(importIcon, (response) => {
        self.element.body.icon.setSrc(response);
      });
    }

    this.element.body.style({
      'width': `${widgetWidth}`
    });
    this.element.body.style({
      'height': `${widgetHeight}`
    });

    if (!this.widget.configurator.get().visibility.icon) {
      this.element.body.icon.style({
        'display': 'none'
      });
    }

    if (!!(iconWidth)) {
      this.element.body.icon.style({
        'width': `${iconWidth}`
      });
    }

    // If download icon wasn't customized, display the default one
    if (!this.importIcon) {
      this.element.body.icon.setSvg(faFileImport, iconColor);
    }
  }

  /**
   * And update the progress periodically
   * @param event
   */
  updateProgress(event) {
    let progress = (event.progress * 100);

    if (!progress) {
      progress = 0;
    }

    progress = progress.toFixed(0);
    this.widget.observers.hashingProgressObserver.broadcast(progress);
  }

  handleError(event) {
    this.widget.observers.errorCaughtObserver.broadcast(event.error);
  }

  startHashing(file) {
    if (!this.hasher) {
      this.delayedFile = file;

      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
    return this.hash(file);
  }

  /**
   * If there is a delayed file, start its hashing
   * @return {Promise<T | never>}
   */
  hashDelayedFile() {
    const self = this;
    if (this.delayedFile) {
      return this.hash(this.delayedFile).then(result => {
        if (result) {
          self.widget.observers.hashingFinishedObserver.broadcast(result);
        }
      });
    }
    return null;
  }

  /**
   * Hash the file
   * @param file
   * @return {Promise}
   */
  hash(file) {
    const self = this;

    self.updateProgress({
      progress: 0
    });

    const isPreviewable = utils.isPreviewable(file);
    self.widget.observers.hashingStartedObserver.broadcast(file, isPreviewable);
    self.element.hide();
    self.delayedFile = null;

    return new Promise((resolve) => {
      self.hasher.start(file);
      self.hasher.on('progress', (r) => {
        self.updateProgress(r);
      });
      self.hasher.on('error', (r) => {
        self.handleError(r);
      });
      self.hasher.on('result', (r) => {
        resolve({
          hash: r.result,
          file
        });
      });
    });
  }

  onInputFileChanged(self) {
    let file = this.files[0];

    if (!file) {
      widgetLogger.error(`${this.widget.widgetId}: File isn't found`);
    }

    // Reset input value
    this.value = null;

    self.widget.observers.fileSelectedObserver.broadcast(file);

    return self.startHashing(file);
  }

  downloadModeInitiated() {
    this.element.hide();
  }

  downloadingFailed() {
    this.element.hide();
  }

  uploadModeInitiated() {
    this.element.show();
  }

  downloadingStarted() {
    this.element.show();
  }

  hashingCanceled() {
    if (this.hasher) {
      this.hasher.cancel();
    }
  }

  get() {
    return this.element;
  }
}

export default DropContainer;
