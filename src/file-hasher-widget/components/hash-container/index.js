import VirtualDOMService from 'Common/services/virtual-dom';
import utils from 'Common/services/utils';
import styleCodes from 'FileHasherComponents/style-codes';
import styles from './index.scss';

/**
 * HashContainer
 */
class HashContainer {
  constructor(widget) {
    this.element = null;
    this.widget = widget;
    this.lang = this.widget.configurator.getLanguage();
  
    this.init();
  }
  
  init() {
    const {hash: { color: hashColor, background_color: hashBackgroundColor }} = this.widget.configurator.getStyles();

    this.element = VirtualDOMService.createElement('div', {
      classes: utils.extractClasses(styles, styleCodes.hash.container.code)
    });

    this.element.target().style
      .setProperty('--file-hasher-widget-hash-color', hashColor);

    this.element.target().style
      .setProperty('--file-hasher-widget-hash-background-color', hashBackgroundColor);

    this.element.hide();

    this.initializeObservers();
  }

  // Initialize the observers
  initializeObservers() {
    this.widget.observers.hashingFinishedObserver.subscribe((data) => {
      this.hashingFinished(data)
    });
    this.widget.observers.widgetResetObserver.subscribe((data) => {
      this.widgetReset(data)
    });
  }

  widgetReset() {
    while (this.element.target().firstChild) {
      this.element.target().removeChild(this.element.target().firstChild);
    }

    this.element.hide();
  }

  hashingFinished(data) {
    const {hash, file} = data;
    const halfHashLength = Math.ceil(hash.length / 2);
    const splitHash = [hash.substr(0, halfHashLength), hash.substr(halfHashLength)];

    this.widgetReset();

    splitHash.forEach((hashPart) => {
      const hashPartElement = VirtualDOMService.createElement('span', {
        classes: utils.extractClasses(styles, styleCodes.hash.code)
      });
      hashPartElement.text(hashPart);
      this.element.target().append(hashPartElement.render());
    });

    this.element.show();
  }
  
  get() {
    return this.element;
  }
}

export default HashContainer;
