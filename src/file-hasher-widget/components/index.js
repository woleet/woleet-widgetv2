import virtualDOMService from '../../common/services/virtualDOM';
import utils from '../../common/services/utils';
import widgetLogger from '../../common/services/logger';
import configurator from '../../common/services/configurator';
import styles from './index.scss';

/**
 * Define a class of the widget
 */
class FileHasherWidget {
  constructor(configuration) {
    // this.classCodes = ['woleet_file-hasher-widget__wrapper'];
    this.classCodes = {
      main: ['woleet_file-hasher-widget__wrapper'],
      dropZone: ['drop_zone'],
      dropZoneIcon: ['drop_zone-icon'],
      dropZoneFileInput: ['drop_zone-file_input'],
      titleWrapper: ['title_wrapper'],
      title: ['title']
    };
    this.widgetId = configuration.widgetId;
    
    console.log('style', styles);
    
    configurator.init(configuration);
  
    /**
     * Bindings
     */
    this.onInputFileChanged.bind(this);
  }
  
  setProgress(event) {
    let progress = (event.progress * 100);
    
    if (progress !== progress) {
      progress = 0;
    }
    
    progress = progress.toFixed(0);
    console.log(`Progress: ${progress}`);
  };
  
  onInputFileChanged(self) {
    const hasher = window.woleet ? new window.woleet.file.Hasher : null;
    
    let file = this.files[0];
    if (!hasher)
      widgetLogger.error(`Woleet Hasher isn't found`);
    
    if (!file)
      widgetLogger.error(`File isn't found`);
  
    // Reset input value
    this.value = null;
  
    return new Promise((resolve, reject) => {
      hasher.start(file);
      hasher.on('progress', self.setProgress);
      hasher.on('result', (r) => {
        self.setProgress({progress: 0});
        resolve(r.result);
      })
    })
  }
  
  render() {
    const self = this;
    const observers = configurator.getObservers();
    /**
     * TODO: split into several components
     */
    const element = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes.main)});
    
    element.dropZone = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes.dropZone)});
    element.dropZone.icon = virtualDOMService.createElement('i', {classes: utils.extractClasses(styles, this.classCodes.dropZoneIcon)});
    element.dropZone.input = virtualDOMService.createFileInput({classes: utils.extractClasses(styles, this.classCodes.dropZoneFileInput)});
    element.dropZone.icon.html(utils.getSolidIconSVG('faFileDownload'));
  
    element.titleWrapper = virtualDOMService.createElement('div', {classes: utils.extractClasses(styles, this.classCodes.titleWrapper)});
    element.titleWrapper.title = virtualDOMService.createElement('span', {classes: utils.extractClasses(styles, this.classCodes.title)});
    element.titleWrapper.title.text(utils.translate('select_file_to_hash', configurator.getLanguage()));
  
    /**
     * Events
     */
    element.dropZone.input.on('change', function () {
      self.onInputFileChanged.call(this, self)
        .then((hash) => {
          if (observers && observers.hashUpdated) {
            observers.hashUpdated(self.widgetId, hash)
          }
        });
    });
    
    return element.render();
  }
}

export default FileHasherWidget;
