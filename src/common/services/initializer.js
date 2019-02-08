import constants from "../constants";

const fileHasherWidgetConfiguration = {
  dev: false,
  provenFile: null,
  lang: constants.DEFAULT_WIDGET_LANGUAGE,
  type: constants.FILE_HASHER_WIDGET_TYPE
};

function getFileHasherDefaults() {
  return fileHasherWidgetConfiguration;
}

function getDefaultLanguage() {
  return constants.DEFAULT_WIDGET_LANGUAGE;
}

export default {
  getFileHasherDefaults,
  getDefaultLanguage,
}
