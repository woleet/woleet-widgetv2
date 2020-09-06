import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import widgetLogger from 'Common/services/logger';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import woleet from '@woleet/woleet-weblibs';

/**
 * DropContainer area: a container to drop and select user files and hash them
 */
class DropContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.hasher = new woleet.file.Hasher('../dist/woleet-hashfile-worker.min.js');
    this.init();
  }

  /**
   * Create and initialize all container elements
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.code)
    });

    this.element.body = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.drop.body.code)
    });
    this.element.body.input = VirtualDOMService.createFileInput({
      classes: utils.extractClasses(styles, styleCodes.drop.body.input.code)
    });

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
    this.widget.observers.downloadingFailedObserver.subscribe((data) => {
      this.downloadingFailed(data);
    });
    this.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      this.uploadModeInitiated(data);
      this.hashingCanceled(data);
    });
    this.widget.observers.widgetResetObserver.subscribe(() => {
      this.hashingCanceled();
    });
    this.widget.observers.downloadingFinishedObserver.subscribe((data) => {
      this.startHashing(data)
        .then(result => {
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

    // If the user select a file, start the hasher process
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
   * Update the progress periodically
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
    return this.hash(file);
  }

  /**
   * Hash a file
   * @param file
   * @return {Promise}
   */
  hash(file) {
    const self = this;

    self.updateProgress({ progress: 0 });

    const isPreviewable = utils.isPreviewable(file);
    self.widget.observers.hashingStartedObserver.broadcast(file, isPreviewable);
    self.element.hide();

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
    // Get the first file
    let file = this.files[0];
    if (!file) {
      widgetLogger.error(`${this.widget.widgetId}: File not found`);
    }

    // Reset file input value to ensure the 'onchange' event is triggered even if the next file is the same
    this.value = null;

    // Broadcast the file selected event
    self.widget.observers.fileSelectedObserver.broadcast(file);

    // Start hasing
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
    this.hasher.cancel();
  }

  get() {
    return this.element;
  }
}

export default DropContainer;
