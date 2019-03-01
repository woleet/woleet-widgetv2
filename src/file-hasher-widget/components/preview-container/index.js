import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * PreviewContainer
 */
class PreviewContainer {
  constructor(widget) {
    const self = this;
    
    this.element = null;
    this.url = null;
    this.widget = widget;
    this.fileReader = new FileReader();
    this.previewFileFormats = ['png', 'jpeg', 'jpg', 'svg'];
    
    this.fileReader.onload = function (file) {
      self.showFilePreview(file);
    };
    
    this.init();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();
    
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
    
    this.element.body.wrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.wrapper.code)
    });
    
    this.element.body.wrapper.image = virtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.code)
    });
    
    this.element.hide();
    this.element.body.icon.hide();
    
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
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
  
    self.element.body.on('click', function () {
      if (self.url !== null) {
        window.open(self.url, '_blank');
      } else {
        alert ('The local file can`t be opened');
      }
    });
  }

  downloadingFinished(file) {
    this.element.show();
    
    const {name: filename} = file;
    const fileExtension = utils.getFileExtension(filename);
    
    if (file && file.url) {
      this.url = file.url;
    }
    
    if (this.previewFileFormats.indexOf(fileExtension) !== -1) {
      this.fileReader.readAsDataURL(file);
    } else if (fileExtension === 'pdf') {
      /*TODO: for PDF*/
      this.showPlaceholderIcon('faFilePdf')
    } else {
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
