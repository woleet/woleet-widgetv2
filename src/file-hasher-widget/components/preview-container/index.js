import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import PdfPreview from "FileHasherWidget/components/preview-container/pdf-preview";

/**
 * PreviewContainer
 */
class PreviewContainer {
  constructor(widget) {
    this.element = null;
    this.url = null;
    this.widget = widget;
    this.fileReader = new FileReader();
    this.pdfPreview = null;
    this.previewFileFormats = ['png', 'jpeg', 'jpg', 'svg'];
    
    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();
    const iconWidth = utils.getObjectProperty(widgetStyles, 'iconWidth');

    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.code)
    });

    this.element.style({'min-height': `${widgetStyles.width}px`});

    this.element.body = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.code)
    });
    
    this.element.body.icon = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.icon.code)
    });

    if (iconWidth) {
      this.element.body.icon.style({'width': `${iconWidth}px`});
    }
    
    this.element.body.wrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.wrapper.code)
    });
    
    this.element.body.wrapper.image = virtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.code)
    });

    this.pdfPreview = new PdfPreview(this.widget);
    this.element.pdf = (this.pdfPreview).get();

    this.element.control = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.control.code)
    });

    this.element.control.redo = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.preview.control.icon.redo.code)
    });

    this.element.control.redo.html(utils.getSolidIconSVG('faRedo'));

    this.element.hide();
    
    this.initializeObservers();
    this.initializeEvents();
  }
  
  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;
  
    self.widget.observers.downloadingFinishedObserver.subscribe((file) => {
      self.downloadingFinished(file)
    });
  
    self.widget.observers.fileSelectedObserver.subscribe((file) => {
      self.downloadingFinished(file)
    });

    self.widget.observers.uploadModeInitiatedObserver.subscribe((data) => {
      self.uploadModeInitiated(data)
    });
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
  
    self.element.on('click', function () {
      if (self.url !== null) {
        window.open(self.url, '_blank');
      } else {
        alert ('The local file can`t be opened');
      }
    });

    this.element.control.redo.on('click', function (event) {
      event.stopPropagation();
      console.log('downloadModeInitiatedObserver');
      self.widget.observers.uploadModeInitiatedObserver.broadcast();
      return false;
    });

    self.fileReader.onload = function (file) {
      self.showFilePreview(file);
    };
  }

  uploadModeInitiated() {
    this.pdfPreview.hide();
    this.element.hide();
  }

  downloadingFinished(file) {
    this.element.show();
    
    const {name: filename} = file;
    const fileExtension = utils.getFileExtension(filename);
    
    if (file && file.url) {
      this.url = file.url;
    } else {
      this.url = null;
    }

    if (this.previewFileFormats.indexOf(fileExtension) !== -1) {
      this.element.body.show();
      this.element.body.wrapper.show();
      this.element.body.icon.hide();
      this.fileReader.readAsDataURL(file);
    } else if (fileExtension === 'pdf') {
      this.element.body.hide();
      this.pdfPreview.setPdfFile(file);
    } else {
      this.element.body.show();
      this.showPlaceholderIcon('faFile')
    }
  }

  showFilePreview(event) {
    const {result: filePreview} = event.target;
    this.element.body.wrapper.image.attr('src', filePreview);
  }

  showPlaceholderIcon(icon) {
    this.element.body.wrapper.hide();
    this.element.body.icon.show();
    this.element.body.icon.html(utils.getSolidIconSVG(icon));
  }

  get() {
    return this.element;
  }
}

export default PreviewContainer;
