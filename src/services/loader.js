function getWoleetLibs() {
  return import('@woleet/woleet-weblibs').then(({ default: woleet }) => {
    return woleet;
  }).catch(error => 'An error occurred while loading the component');
}

function getLodash() {
  return import('lodash').then(({ default: _ }) => {
    return _;
  }).catch(error => 'An error occurred while loading the component');
}

export default  {
  getWoleetLibs,
  getLodash
}
