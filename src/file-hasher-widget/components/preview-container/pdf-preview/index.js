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
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageCount = null;
    this.pageNumPending = null;
    this.scale = 1;

    if (window['file-hasher-widget-source']) {
      this.pdfjsLib.GlobalWorkerOptions.workerSrc = window['file-hasher-widget-source'] + '/pdf.worker.min.js';
    }

    this.init();
  }

  init() {
    const widgetStyles = this.widget.configurator.getStyles();

    this.element = virtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.code)
    });

    this.element.canvas = virtualDOMService.createElement('canvas', {
      classes: utils.extractClasses(styles, styleCodes.preview.pdf.canvas.code)
    });

    this.element.canvas.style({width: `${this.styles.width}px`});

    this.element.hide();

    this.initializeObservers();
    this.initializeEvents();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    const self = this;
  }

  /**
   * Initialize the events
   */
  initializeEvents() {
    const self = this;

    this.fileReader.onload = function() {
      const typedArray = new Uint8Array(this.result);

      self.pdfjsLib.getDocument(typedArray).then((pdf) => {
        self.pdfDoc = pdf;
        this.pageCount = self.pdfDoc.numPages;
        self.renderPage(self.pageNum);
      });
    };
  }

  renderPage(num) {
    const self = this;
    self.pageRendering = true;
    // Using promise to fetch the page
    self.pdfDoc.getPage(num)
      .then((page) => {
        const viewport = page.getViewport(self.scale, 0);
        self.element.canvas.height = viewport.height;
        self.element.canvas.width = viewport.width;

        console.log('viewport', viewport);

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
            console.log('render again');
            // New page rendering is pending
            self.renderPage(self.pageNumPending);
            self.pageNumPending = null;
          }
        });
      });
  }

  setPdfFile(file) {
    let canvasElement = this.element.canvas.target();
    this.ctx = canvasElement.getContext('2d');
    this.fileReader.readAsArrayBuffer(file);
    this.element.show();
  }

  get() {
    return this.element;
  }
}

export default PdfPreview;
