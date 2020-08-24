/**
 * The function set to download external libraries as lazy as possible
 * @return {Promise<T | string>}
 */
function getWoleetWebLibs() {
  return import(/* webpackChunkName: "woleet-weblibs" */'@woleet/woleet-weblibs')
    .then(({ default: woleet }) => {
      return woleet;
    })
    .catch(_ => 'An error occurred while loading the component');
}

export default {
  getWoleetWebLibs: getWoleetWebLibs
};
