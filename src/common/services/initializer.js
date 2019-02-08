import constants from "../constants";

const fileHasherWidgetConfiguration = {
  dev: false,
  provenFile: null,
  lang: document.documentElement.lang,
  type: constants.FILE_HASHER_WIDGET_TYPE
};

function getFileHasherDefaults() {
  return fileHasherWidgetConfiguration;
}

export default {
  getFileHasherDefaults
}
