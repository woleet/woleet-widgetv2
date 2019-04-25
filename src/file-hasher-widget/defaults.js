import constants from "Common/constants";

function getFileHasherDefaults() {
  return {
    provenfile: null,
    styles: {
      width: '130px',
      icon: {
        width: null
      }
    },
    title: {
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
