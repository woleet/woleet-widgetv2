import constants from 'Common/constants';

// Default configuration of the widget. For more information check the README file
function getFileHasherDefaults() {
  return {
    file: {
      url: null,
      fastDownload: true
    },
    styles: {
      width: '100%',
      height: '100%',
      align: 'center',
      preview: {
        icon: {
          color: '#000'
        }
      },
      progress: {
        icon: {
          color: '#FF9494'
        }
      },
      hash: {
        color: '#FFF',
        background: '#00A2FF'
      }
    },
    icons: {
      import: null,
      download: null
    },
    proxy: {
      url: null,
      enabled: false
    },
    lang: constants.DEFAULT_WIDGET_LANGUAGE,
    type: constants.FILE_HASHER_WIDGET_TYPE
  };
}

/**
 * Define the observer mappers for progress container
 */
function getFileHasherObserverMappers() {
  return {
    downloadProgressBar: {
      processProgressObserver: 'downloadingProgressObserver',
      processStartedObserver: 'downloadingStartedObserver',
      processFinishedObserver: 'downloadingFinishedObserver',
      processCanceledObserver: 'downloadingCanceledObserver'
    },
    hashProgressBar: {
      processProgressObserver: 'hashingProgressObserver',
      processStartedObserver: 'hashingStartedObserver',
      processFinishedObserver: 'hashingFinishedObserver',
      processCanceledObserver: 'hashingCanceledObserver'
    }
  };
}

export {
  getFileHasherDefaults,
  getFileHasherObserverMappers
};
