import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * HashContainer
 * It displays the calculated hash
 */
class HashContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
  
    this.init();
  }

  /**
   * Create all container elements and initialize them
   */
  init() {
    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.hash.container.code)
    });

    this.element.hide();

    this.initializeObservers();
    this.stylize();
  }

  /**
   * Initialize the observers
   */
  initializeObservers() {
    this.widget.observers.hashingFinishedObserver.subscribe((data) => {
      this.hashingFinished(data)
    });
    this.widget.observers.widgetResetObserver.subscribe((data) => {
      this.widgetReset(data)
    });
  }

  /**
   * Stylize the container
   */
  stylize() {
    const {hash: { color: hashColor, background: hashBackgroundColor }} = this.widget.configurator.getStyles();

    this.element.target().style
      .setProperty('--file-hasher-widget-hash-color', hashColor);

    this.element.target().style
      .setProperty('--file-hasher-widget-hash-background-color', hashBackgroundColor);
  }

  /**
   * Clear the hash zone if widget was reset.
   */
  widgetReset() {
    while (this.element.target().firstChild) {
      this.element.target().removeChild(this.element.target().firstChild);
    }

    this.element.hide();
  }

  /**
   * If hash is ready, split it into 2 parts and display them
   * @param data
   */
  hashingFinished(data) {
    const {properties: { px: { widgetWidth }}} = this.widget.configurator.get();
    const {hash, file} = data;
    const halfHashLength = Math.ceil(hash.length / 2);
    // Split the hash into 2 parts
    const splitHash = [hash.substr(0, halfHashLength), hash.substr(halfHashLength)];

    this.widgetReset();

    // Display each of hash parts
    splitHash.forEach((hashPart) => {
      const hashPartElement = VirtualDOMService.createElement('span', {
        classes: utils.extractClasses(styles, styleCodes.hash.code)
      });
      hashPartElement.text(hashPart);

      console.log('widgetWidth', widgetWidth);

      // And recalculate the font size of the text zone to make it responsive
      const relFontsize = widgetWidth * 0.04;
      hashPartElement.attr('style', `font-size: ${relFontsize}px;`);

      this.element.target().append(hashPartElement.render());
    });

    this.element.show();
  }
  
  get() {
    return this.element;
  }
}

export default HashContainer;
