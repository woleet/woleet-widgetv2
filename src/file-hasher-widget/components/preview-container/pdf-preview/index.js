import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import faCaretLeft from 'Resources/images/caret-left.svg';
import faCaretRight from 'Resources/images/caret-right.svg';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * PdfPreview
 * The element to display PDF files with controls
 */
class PdfPreview {
  constructor(widget) {
    this.element = null;
    this.widget = widget;

    // Used to save the file if it was loaded before the library is initialized
    this.typedArray = null;
    this.fileReader = new FileReader();

    // Set PDF.js library worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = (window.hasher && window.hasher.pdfjsLibWorkerScriptPath) || 'pdf.worker.min.js';
    this.reset();

    this.init();
  }

  /**
   * Create and initialize all container elements
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.code)
    });

    this.element.canvasWrapper = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.wrapper.code)
    });

    this.element.canvasWrapper.canvas = VirtualDOMService.createElement('canvas', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.code)
    });

    this.element.control = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.code)
    });

    this.element.control.prev = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.icon.prev.code)
    });

    this.element.control.next = VirtualDOMService.createElement('img', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.control.icon.next.code)
    });

    this.element.hide();
    this.element.control.hide();

    this.element.control.prev.setSvg(faCaretLeft);
    this.element.control.next.setSvg(faCaretRight);

    this.initializeEvents();
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.fileReader.onload = function () {
      self.element.control.prev.disable();
      self.element.control.next.disable();

      self.typedArray = new Uint8Array(this.result);

      delete this.result;

      // Initialize the instance of pdf.js once the file is available
      pdfjsLib.getDocument(self.typedArray)
        .promise
        .then((pdf) => {
          self.pdfDoc = pdf;
          self.pageCount = self.pdfDoc.numPages;
          self.renderPage(self.pageNum);

          if (self.pageCount > 1) {
            self.element.control.next.enable();
          }
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

    this.element.control.show();
  }

  /**
   * Render the PDF file
   * @param num
   */
  renderPage(num) {
    const self = this;
    self.pageRendering = true;
    // Using promise to fetch the page
    self.pdfDoc.getPage(num)
      .then((page) => {
        // Calculate the final size parameters
        const [, , pageWidth, pageHeight] = page.view;

        // Calculate the ratio
        const ratio = pageHeight / pageWidth;
        const scale = 1;
        const viewport = page.getViewport({
          scale
        });

        // The final preview size shouldn't be wider than the widget
        self.element.canvasWrapper.canvas.height(pageWidth * ratio);
        self.element.canvasWrapper.canvas.width(pageWidth);

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: this.ctx,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {
          self.pageRendering = false;
          if (self.pageNumPending !== null) {
            // New page rendering is pending
            self.renderPage(self.pageNumPending);
            self.pageNumPending = null;
          }
        });
      });
  }

  /**
   * Initialize the pdf file once it was loaded in the PreviewContainer
   * @param file
   */
  setPdfFile(file) {
    this.displayPdfFile(file);
  }

  /**
   * Prepare the canvas to display a PDF file
   * @param file
   */
  displayPdfFile(file) {
    this.reset();
    let canvasElement = this.element.canvasWrapper.canvas.target();
    this.fileReader.readAsArrayBuffer(file);
    this.element.show();

    this.ctx = canvasElement.getContext('2d');
    if (this.ctx) {
      // Clear the canvas background
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }

  hide() {
    this.reset();
    this.element.hide();
  }

  /**
   * If another page rendering in progress, wait until the rendering is
   * finished. Otherwise, execute rendering immediately.
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
   * Display previous page.
   */
  onPrevPage(event) {
    event.stopPropagation();

    const self = this;
    if (self.pageNum <= 1) {
      return;
    }
    self.pageNum--;
    self.queueRenderPage(self.pageNum);

    if (self.pageNum <= 1) {
      this.element.control.prev.disable();
    }

    if (self.pageNum < self.pdfDoc.numPages) {
      this.element.control.next.enable();
    }
  }

  /**
   * Display next page.
   */
  onNextPage(event) {
    event.stopPropagation();

    const self = this;

    if (self.pageNum >= self.pdfDoc.numPages) {
      return;
    }
    self.pageNum++;
    self.queueRenderPage(self.pageNum);

    if (self.pageNum > 1) {
      this.element.control.prev.enable();
    }

    if (self.pageNum >= self.pdfDoc.numPages) {
      this.element.control.next.disable();
    }
  }

  /**
   * Reset the container state to default
   */
  reset() {
    // Free the widget memory to avoid memory leaks
    if (this.pdfDoc) {
      delete this.typedArray;
      delete this.pdfDoc;
    }
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
