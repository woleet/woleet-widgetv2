import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import loader from 'Common/services/loader'
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import faCaretLeft from 'Resources/images/caret-left.svg';
import faCaretRight from 'Resources/images/caret-right.svg';

/**
 * PdfPreview
 */
class PdfPreview {
  constructor(widget) {
    const self = this;
    this.element = null;
    this.pdfjsLib = null;
    this.widget = widget;
    this.delayedFile = null;
    this.fileReader = new FileReader();
    
    this.styles = this.widget.configurator.getStyles();
  
    if (!window.pdfJs) {
      loader.getPdfJs()
        .then((pdfJs) => {
          window.pdfJs = pdfJs;
          self.pdfjsLib = pdfJs;

          if (this.delayedFile) {
            self.displayPdfFile(this.delayedFile);
          } else {
            self.loaded();
          }
        });
    } else {
      self.pdfjsLib = window.pdfJs;
      self.loaded();
    }
  
    this.init();
  }
  
  loaded() {
    if (window['file-hasher-widget-source']) {
      this.pdfjsLib.GlobalWorkerOptions.workerSrc = window['file-hasher-widget-source'] + '/pdf.worker.min.js';
    }
    this.reset();
  }
  
  init() {
    const {
      preview: { icon: { color: previewIconColor} }
    } = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.code)
    });
    
    this.element.canvasWrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.wrapper.code)
    });
    
    this.element.canvasWrapper.canvas = VirtualDOMService.createElement('canvas', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.code)
    });
    
    this.element.canvasWrapper.canvas.style({width: `${this.styles.width}`});
    
    this.element.control = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.code)
    });
    
    this.element.control.prev = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.icon.prev.code)
    });
  
    this.element.control.prev.setSvg(faCaretLeft, previewIconColor);
    
    this.element.control.next = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.icon.next.code)
    });
  
    this.element.control.next.setSvg(faCaretRight, previewIconColor);
    
    this.element.hide();
    this.element.control.hide();

    this.initializeEvents();
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.fileReader.onload = function() {
      const typedArray = new Uint8Array(this.result);

      delete this.result;

      self.pdfjsLib.getDocument(typedArray)
        .then((pdf) => {
          console.log('this.pdfjsLib.GlobalWorkerOptions', this.pdfjsLib.GlobalWorkerOptions, pdf)

          self.pdfDoc = pdf;
          self.pageCount = self.pdfDoc.numPages;
          self.renderPage(self.pageNum);
        });
    };
  
    this.element.control.prev.on('click', function (event) {
      event.stopPropagation();
      self.onPrevPage(event);
      return false;
    });
  
    this.element.control.next.on('click', function (event) {
      event.stopPropagation();
      self.onNextPage(event);
      return false;
    });
  
    this.element.on('mouseenter', function () {
      self.element.control.show();
    });
  
    this.element.on('mouseleave', function () {
      self.element.control.hide();
    });
  }
  
  renderPage(num) {
    const self = this;
    self.pageRendering = true;
    // Using promise to fetch the page
    self.pdfDoc.getPage(num)
      .then((page) => {
        let styleWidth = parseInt(self.styles.width);
        const [x, y, pageWidth, pageHeight] = page.view;

        if (self.styles.width.indexOf('%') !== -1) {
          styleWidth = (styleWidth * pageWidth) / 100;
        }

        const ratio = pageHeight / pageWidth;
        const scale = styleWidth / pageWidth;
        const viewport = page.getViewport(scale, 0);
        
        self.element.canvasWrapper.canvas.height(styleWidth * ratio);
        self.element.canvasWrapper.canvas.width(styleWidth);
        
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: this.ctx,
          viewport: viewport
        };
        
        const renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          self.pageRendering = false;
          if (self.pageNumPending !== null) {
            // New page rendering is pending
            self.renderPage(self.pageNumPending);
            self.pageNumPending = null;
          }
        });
      });
  }
  
  setPdfFile(file) {
    const self = this;

    if (!self.pdfjsLib) {
      this.delayedFile = file;
    } else {
      this.displayPdfFile(file);
    }
  }

  displayPdfFile(file) {
    this.reset();
    let canvasElement = this.element.canvasWrapper.canvas.target();
    this.ctx = canvasElement.getContext('2d');
    this.fileReader.readAsArrayBuffer(file);
    this.element.show();

    console.log('display delayed pdf file', file);

    if (this.ctx) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  hide() {
    this.reset();
    this.element.hide();
  }
  
  /**
   * If another page rendering in progress, waits until the rendering is
   * finished. Otherwise, executes rendering immediately.
   */
  queueRenderPage(num) {
    const self = this;
    if (self.pageRendering) {
      self.pageNumPending = num;
    } else {
      self.renderPage(num);
    }
  }
  
  /**
   * Displays previous page.
   */
  onPrevPage(event) {
    const self = this;
    if (self.pageNum <= 1) {
      return;
    }
    self.pageNum--;
    self.queueRenderPage(self.pageNum);
  }
  
  /**
   * Displays next page.
   */
  onNextPage(event) {
    event.stopPropagation();
    
    const self = this;
    if (self.pageNum >= self.pdfDoc.numPages) {
      return;
    }
    self.pageNum++;
    self.queueRenderPage(self.pageNum);
  }

  reset() {
    this.pdfDoc = null;
    this.delayedFile = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageCount = null;
    this.pageNumPending = null;
  }
  
  get() {
    return this.element;
  }
}

export default PdfPreview;
