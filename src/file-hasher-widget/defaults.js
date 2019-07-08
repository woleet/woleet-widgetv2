import constants from "Common/constants";

// Default configuration of the widget. For more information check the README file
function getFileHasherDefaults() {
  return {
    file: {
      url: null,
      fastDownload: false
    },
    styles: {
      width: '130px',
      align: 'center',
      icon: {
        width: null,
        color: '#696969'
      },
      preview: {
        icon: {
          color: '#FF9494'
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
      download: null,
      preview: {
        common: null
      }
    },
    visibility: {
      title: true,
      filename: true,
      progress: true,
      hash: true,
      controls: {
        reset: true
      },
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
}
