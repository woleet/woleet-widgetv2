import constants from 'Common/constants';

// Default configuration of the widget. For more information check the README file
function getFileHasherDefaults() {
  return {
    file: {
      url: null,
      fastDownload: true
    },
    visibility: {
      preview: true
    },
    styles: {
      icons: {
        color: '#000'
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

export {
  getFileHasherDefaults
};
