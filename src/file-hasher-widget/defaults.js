import constants from 'Common/constants';

// Default configuration of the widget. For more information check the README file
function getFileHasherDefaults() {
  return {
    file: {
      url: null
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
    type: constants.FILE_HASHER_WIDGET_TYPE
  };
}

export {
  getFileHasherDefaults
};
