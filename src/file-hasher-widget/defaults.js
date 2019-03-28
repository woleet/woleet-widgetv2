import constants from "Common/constants";

function getDefaultLanguage() {
  return constants.DEFAULT_WIDGET_LANGUAGE;
}

function getFileHasherDefaults() {
  return {
    provenfile: null,
    styles: {
      width: '130px'
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
      processCanceledObserver: 'uploadModeInitiatedObserver'
    }
  };
}

export {
  getDefaultLanguage,
  getFileHasherDefaults,
  getFileHasherObserverMappers
}
