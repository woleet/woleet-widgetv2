function getWoleetLibs() {
  return import(/* webpackChunkName: "woleet-weblibs" */'@woleet/woleet-weblibs').then(({ default: woleet }) => {
    return woleet;
  }).catch(error => 'An error occurred while loading the component');
}

function getI18nService() {
  return import(/* webpackChunkName: "i18next" */'i18next').then(({ default: __ }) => {
    return __;
  }).catch(error => 'An error occurred while loading the component');
}

function getPdfJs() {
  return import(/* webpackChunkName: "pdf.js" */'pdfjs-dist').then((module) => {
    return module;
  }).catch(error => 'An error occurred while loading the component');
}

export default {
  getPdfJs,
  getWoleetLibs,
  getI18nService
}
