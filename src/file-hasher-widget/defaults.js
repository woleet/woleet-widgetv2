import constants from "Common/constants";

function getFileHasherDefaults() {
  return {
    proven_file: null,
    styles: {
      width: '130px',
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
        background_color: '#00A2FF'
      }
    },
    title: {
      visible: true
    },
    progress: {
      visible: true
    },
    hash: {
      visible: true
    },
    lang: constants.DEFAULT_WIDGET_LANGUAGE,
    type: constants.FILE_HASHER_WIDGET_TYPE
  };
}

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
