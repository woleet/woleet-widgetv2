import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import PdfPreview from "FileHasherWidget/components/preview-container/pdf-preview";
import faFile from 'Resources/images/file.svg';
import faRedo from 'Resources/images/redo.svg';

/**
 * PreviewContainer
 */
class PreviewContainer {
  constructor(widget) {
    this.element = null;
    this.url = null;
    this.widget = widget;
    this.fileReader = new FileReader();
    this.file = null;
    this.pdfPreview = null;
    this.iconColor = null;
    this.previewFileFormats = ['png', 'jpeg', 'jpg', 'svg'];
    
    this.init();
  }
  
  init() {
    const {
      icon: { width: iconWidth, color: iconColor },
      preview: { icon: { color: previewIconColor} }
    } = this.widget.configurator.getStyles();

    const {
      visibility: { controls: controlVisibility }
    } = this.widget.configurator.get();

    this.iconColor = iconColor;

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.code)
    });

    this.element.body = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.code)
    });
    
    this.element.body.icon = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.icon.code)
    });

    if (!!(iconWidth)) {
      this.element.body.icon.style({'width': `${iconWidth}`});
    }
    
    this.element.body.wrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.wrapper.code)
    });
    
    this.element.body.wrapper.image = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.body.image.code)
    });

    this.pdfPreview = new PdfPreview(this.widget);
    this.element.pdf = (this.pdfPreview).get();

    this.element.titleWrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.title.wrapper.code)
    });

    this.element.titleWrapper.title = VirtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.preview.title.code)
    });

    this.element.control = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.control.code)
    });

    if (controlVisibility && controlVisibility.reset) {
      this.element.control.redo = VirtualDOMService.createElement('img', {
        classes: utils.extractClasses(styles, styleCodes.preview.control.icon.redo.code)
      });

      this.element.control.redo.setSvg(faRedo, previewIconColor);
    }

    this.element.target().style.setProperty('--file-hasher-widget-control-border-color', previewIconColor);

    this.element.hide();
    this.element.titleWrapper.hide();
    
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
  
    self.element.on('click', () => {
      if (self.url !== null) {
        window.open(self.url, '_blank');
      } else {
        !utils.adsBlocked((blocked) => {
          if (!blocked) {
            /*The solution for both IE and Edge*/
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(self.file, self.file.name);
            } else {
              const objUrl = window.URL.createObjectURL(self.file, { oneTimeOnly: true });
              const tab = window.open();
              tab.location.href = objUrl;
            }
          } else {
            console.log('Disable ads blockers, please!');
          }
        })
      }
    });

    if (this.element.control.redo) {
      this.element.control.redo.on('click', function (event) {
        event.stopPropagation();
        self.widget.observers.widgetResetObserver.broadcast();
        self.resetFile();
        return false;
      });
    }

    self.fileReader.onload = function (file) {
      self.showFilePreview(file);
    };
  }

  uploadModeInitiated() {
    this.pdfPreview.hide();
    this.element.hide();
    this.resetFile();
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

    this.file = file;

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
      this.showPlaceholderIcon(faFile)
    }

    this.element.titleWrapper.show();
    this.element.titleWrapper.title.text(file.name);
  }

  showFilePreview(event) {
    const {result: filePreview} = event.target;
    this.element.body.wrapper.image.attr('src', filePreview);
  }

  showPlaceholderIcon(file) {
    this.element.body.wrapper.hide();
    this.element.body.icon.show();
    this.element.body.icon.setSvg(file, this.iconColor);
  }

  resetFile() {
    this.file = null;
    this.element.titleWrapper.title.text('');
  }

  get() {
    return this.element;
  }
}

export default PreviewContainer;
