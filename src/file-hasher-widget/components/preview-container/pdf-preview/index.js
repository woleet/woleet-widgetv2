import virtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import pdf from 'pdfjs-dist'

/**
 * PdfPreview
 */
class PdfPreview {
  constructor(widget) {
    this.element = null;
    this.pdfjsLib = pdf;
    this.widget = widget;
    this.fileReader = new FileReader();
    
    this.styles = this.widget.configurator.getStyles();
    
    if (window['file-hasher-widget-source']) {
      this.pdfjsLib.GlobalWorkerOptions.workerSrc = window['file-hasher-widget-source'] + '/pdf.worker.min.js';
    }
    
    this.init();
    this.reset();
  }
  
  init() {
    const widgetStyles = this.widget.configurator.getStyles();
    
    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.code)
    });
    
    this.element.canvasWrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.wrapper.code)
    });
    
    this.element.canvasWrapper.canvas = virtualDOMService.createElement('canvas', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.code)
    });
    
    this.element.canvasWrapper.canvas.style({width: `${this.styles.width}px`});
    
    this.element.control = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.code)
    });
    
    this.element.control.prev = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.icon.prev.code)
    });
  
    this.element.control.prev.html(utils.getSolidIconSVG('faCaretLeft'));
    
    this.element.control.next = virtualDOMService.createElement('i', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.icon.next.code)
    });
  
    this.element.control.next.html(utils.getSolidIconSVG('faCaretRight'));
    
    this.element.titleWrapper = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.title.wrapper.code)
    });
    
    this.element.titleWrapper.title = virtualDOMService.createElement('span', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.title.code)
    });
    
    this.element.hide();
    this.element.control.hide();
    this.element.titleWrapper.hide();
    
    this.initializeObservers();
    this.initializeEvents();
  }
  
  /**
   * Initialize the observers
   */
  initializeObservers() {
  }
  
  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.fileReader.onload = function() {
      const typedArray = new Uint8Array(this.result);
      console.log('test');
      self.pdfjsLib.getDocument(typedArray)
        .then((pdf) => {
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
        const [x, y, pageWidth, pageHeight] = page.view;
        const ratio = pageHeight / pageWidth;
        const scale = self.styles.width / pageWidth;
        const viewport = page.getViewport(scale, 0);
        
        self.element.canvasWrapper.canvas.height(self.styles.width * ratio);
        self.element.canvasWrapper.canvas.width(self.styles.width);
        
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: this.ctx,
          viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        self.element.titleWrapper.show();
        
        // Wait for rendering to finish
        renderTask.promise.then(function() {
          self.pageRendering = false;
          if (self.pageNumPending !== null) {
            console.log('render queue');
            // New page rendering is pending
            self.renderPage(self.pageNumPending);
            self.pageNumPending = null;
          }
        });
      });
  }
  
  setPdfFile(file) {
    this.reset();
    console.log('laoded');
    let canvasElement = this.element.canvasWrapper.canvas.target();
    this.ctx = canvasElement.getContext('2d');
    this.fileName = file.name;
    this.fileReader.readAsArrayBuffer(file);
    this.element.titleWrapper.title.text(this.fileName);
    this.element.show();

    if (this.ctx) {
      console.log('this.ctx.width', this.ctx);
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  hide() {
    this.reset();
    this.element.titleWrapper.title.text('');
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
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageCount = null;
    this.pageNumPending = null;
    this.fileName = null;
  }
  
  get() {
    return this.element;
  }
}

export default PdfPreview;
