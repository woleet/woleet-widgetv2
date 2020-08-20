/**
 * The function set to download external libraries as lazy as possible
 * @return {Promise<T | string>}
 */
function getWoleetLibs() {
  return import(/* webpackChunkName: "woleet-weblibs" */'@woleet/woleet-weblibs')
    .then(({ default: woleet }) => {
      return woleet;
    })
    .catch(_ => 'An error occurred while loading the component');
}

function getPdfJs() {
  return import(/* webpackChunkName: "pdf.js" */'pdfjs-dist')
    .then((module) => {
      return module.default;
    })
    .catch(_ => 'An error occurred while loading the component');
}

export default {
  getPdfJs,
  getWoleetLibs
};
