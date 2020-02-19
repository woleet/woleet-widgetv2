import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import PdfPreview from 'FileHasherWidget/components/preview-container/pdf-preview';
import faFile from 'Resources/images/file.svg';
import faRedo from 'Resources/images/redo.svg';

/**
 * PreviewContainer
 * The container displays the file preview
 */
class PreviewContainer {
  constructor(widget) {
    const {
      icons: { preview: { common: commonIcon } }
    } = widget.configurator.get();
    const self = this;
    this.element = null;
    this.url = null;
    this.widget = widget;
    this.fileReader = new FileReader();
    this.file = null;
    this.commomPreviewIcon = null;
    this.pdfPreview = null;
    this.previewFileExtensions = ['png', 'jpeg', 'jpg', 'svg'];
    this.textFileExtensions = ['pdf'];
    // Merge the extensions to get an array of allowed files
    this.allowedExtensions = this.previewFileExtensions.concat(this.textFileExtensions);

    if (commonIcon) {
      utils.toDataUrl(commonIcon, (response) => {
        self.commomPreviewIcon = response;
      });
    }
    this.init();
  }

  // Create all container elements and initialize them
  init() {
    const {
      visibility: { controls: controlVisibility }
    } = this.widget.configurator.get();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.code)
    });

    this.element.body = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.code)
    });

    this.element.body.icon = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.icon.code)
    });

    this.element.body.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.wrapper.code)
    });

    this.element.body.wrapper.image = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.code)
    });

    // create an element to display PDF files
    this.pdfPreview = new PdfPreview(this.widget);
    this.element.pdf = (this.pdfPreview).get();

    // the control to reset the preview
    this.element.control = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.control.code)
    });

    if (controlVisibility && controlVisibility.reset) {
      this.element.control.redo = VirtualDOMService.createElement('img', {
        classes: utils.extractClasses(styles, styleCodes.preview.control.icon.redo.code)
      });
    }

    this.element.hide();

    this.initializeObservers();
    this.initializeEvents();
    this.stylize();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;

    self.widget.observers.downloadingStartedObserver.subscribe((data) => {
      self.downloadingStarted(data);
    });

    self.widget.observers.downloadModeInitiatedObserver.subscribe((data) => {
      self.downloadModeInitiated(data);
    });

    self.widget.observers.downloadingFinishedObserver.subscribe((file) => {
      self.downloadingFinished(file);
    });

    self.widget.observers.fileSelectedObserver.subscribe((file) => {
      self.displayDefaultIcon();
      self.downloadingFinished(file);
    });

    self.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      self.uploadModeInitiated(data);
    });
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;

    // Display or not the document in new tab when the user click in the widget
    const enablePreview = self.widget.configurator.get().visibility.preview;

    // If a parameter is define to true or by default, it displays the document in new tab
    if (enablePreview === undefined || enablePreview) {
      self.element.on('click', () => {
        if (self.file) {
          const { name: filename } = self.file;
          const fileExtension = utils.getFileExtension(filename);

          if (self.url !== null) {
            window.open(self.url, '_blank');
          } else if (this.allowedExtensions.indexOf(fileExtension) !== -1) {
            // Check if it's possible to open popup windows
            !utils.adsBlocked((blocked) => {
              if (!blocked) {
                // The solution for both IE and Edge
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                  window.navigator.msSaveOrOpenBlob(self.file, self.file.name);
                } else {
                  // For all other normal browsers
                  const objUrl = window.URL.createObjectURL(self.file, { oneTimeOnly: true });
                  const tab = window.open();
                  tab.location.href = objUrl;
                }
              } else {
                console.log('Disable ads blockers, please!');
              }
            });
          }
        }
      });
    } else {
      // If a parameter is define to false
      // then change cursor  on hover on the widget to make not clickable/cannot display preview of the file in a tab
      this.element.attr('style', 'cursor: unset;');
    }


    // If the reset button was clicked
    if (this.element.control.redo) {
      this.element.control.redo.on('click', function (event) {
        event.stopPropagation();
        self.widget.observers.widgetResetObserver.broadcast();
        self.resetFile();
        return false;
      });
    }

    // If the file was loaded display an image
    self.fileReader.onload = function (file) {
      self.showFilePreview(file);
    };
  }

  /**
   * Stylize the container
   */
  stylize() {
    // Select all needful options
    const {
      icon: { width: iconWidth, color: iconColor },
      preview: { icon: { color: previewIconColor } }
    } = this.widget.configurator.getStyles();

    this.iconColor = iconColor;

    if (!!(iconWidth)) {
      this.element.body.icon.style({ 'width': `${iconWidth}` });
    }

    if (this.element.control && this.element.control.redo) {
      this.element.control.redo.setSvg(faRedo, previewIconColor);
    }

    // Change the button color
    this.element.target().style.setProperty('--file-hasher-widget-control-border-color', previewIconColor);
  }

  /**
   * Reset to upload mode
   */
  uploadModeInitiated() {
    this.pdfPreview.hide();
    this.element.hide();
    this.resetFile();
  }

  /**
   * If downloading is started, show the default preview
   */
  downloadModeInitiated(fileConfiguration) {
    if (fileConfiguration.fastDownload) {
      this.displayDefaultIcon();
    }
  }

  /**
   * If the downloading started, show the default icon
   */
  downloadingStarted() {
    this.displayDefaultIcon();
  }

  /**
   * Display a file if it's allowed
   * @param file
   */
  downloadingFinished(file) {
    const { name: filename } = file;
    const fileExtension = utils.getFileExtension(filename);

    // Save the file link to use it once the preview is clicked
    if (file && file.url) {
      this.url = file.url;
    } else {
      this.url = null;
    }

    this.file = file;

    if (this.previewFileExtensions.indexOf(fileExtension) !== -1) { // Display an image
      this.element.body.wrapper.show();
      this.element.body.icon.hide();
      this.fileReader.readAsDataURL(file);
    } else if (this.textFileExtensions.indexOf(fileExtension) !== -1) { // Or a PDF file
      this.element.body.hide();
      // Initialize the PDF viewer
      this.pdfPreview.setPdfFile(file);
    }
  }

  /**
   * Show the default icon
   */
  displayDefaultIcon() {
    this.element.show();
    this.element.body.show();
    this.showPlaceholderIcon();
  }

  /**
   * Display an image
   * @param event
   */
  showFilePreview(event) {
    const { result: filePreview } = event.target;
    this.element.body.wrapper.image.attr('src', filePreview);
  }

  /**
   * Define the icon instead of preview element if extension is not allowed
   */
  showPlaceholderIcon() {
    this.element.body.wrapper.hide();
    this.element.body.icon.show();

    // If user common icon was defined, display it
    if (this.commomPreviewIcon) {
      this.element.body.icon.setSrc(this.commomPreviewIcon);
    } else {
      // otherwise display the default one
      this.element.body.icon.setSvg(faFile, this.iconColor);
    }
  }

  /**
   * Reset the file
   */
  resetFile() {
    this.file = null;
  }

  get() {
    return this.element;
  }
}

export default PreviewContainer;
