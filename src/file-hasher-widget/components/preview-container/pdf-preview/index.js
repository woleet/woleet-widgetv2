import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import loader from 'Common/services/loader';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';
import faCaretLeft from 'Resources/images/caret-left.svg';
import faCaretRight from 'Resources/images/caret-right.svg';
import pdfjsWorker from 'pdfjs-dist';

/**
 * PdfPreview
 * The element to display PDF files with controls
 */
class PdfPreview {
  constructor(widget) {
    const self = this;
    this.element = null;
    // An instance of the library pdf.js
    this.pdfjsLib = null;
    this.widget = widget;
    // To save the file if it was loaded before the library is initialized
    this.delayedFile = null;
    this.typedArray = null;
    this.fileReader = new FileReader();

    if (!window.pdfJs) {
      // If the library pdf.js isn't available, do the lazy loading
      loader.getPdfJs()
        .then((pdfJs) => {
          window.pdfJs = pdfJs;
          self.pdfjsLib = pdfJs;

          /**
           * And display a delayed file if it exists
           */
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
    /**
     * TODO: optimize the initialization
     * initialize the worker for pdf.js
     */
    this.pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    this.reset();
  }

  // Create all container elements and initialize them
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

    this.initializeEvents();
    this.stylize();
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;
    this.fileReader.onload = function () {
      self.typedArray = new Uint8Array(this.result);

      delete this.result;

      // Initialize the instance of pdf.js once the file is available
      self.pdfjsLib.getDocument(self.typedArray)
        .promise
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

  /**
   * Stylize the container
   */
  stylize() {
    // Select all needful options
    const {
      icons: {
        color: iconColor
      }
    } = this.widget.configurator.getStyles();

    this.element.control.prev.setSvg(faCaretLeft, iconColor);

    this.element.control.next.setSvg(faCaretRight, iconColor);
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
    const self = this;

    if (!self.pdfjsLib) {
      this.delayedFile = file;
    } else {
      this.displayPdfFile(file);
    }
  }

  /**
   * Prepare the canvas to display a PDF file
   * @param file
   */
  displayPdfFile(file) {
    this.reset();
    let canvasElement = this.element.canvasWrapper.canvas.target();
    this.ctx = canvasElement.getContext('2d');
    this.fileReader.readAsArrayBuffer(file);
    this.element.show();

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
  }

  /**
   * Reset the container state to default
   */
  reset() {
    if (this.pdfDoc) {
      // And free the widget memory to avoid memory leaks
      delete this.typedArray;
      delete this.pdfDoc;
    }
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
