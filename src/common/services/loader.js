function getWoleetLibs() {
  return import(/* webpackChunkName: "woleet-weblibs" */'@woleet/woleet-weblibs').then(({ default: woleet }) => {
    return woleet;
  }).catch(error => 'An error occurred while loading the component');
}

function getI18mService() {
  return import(/* webpackChunkName: "i18n" */'i18n').then(({ default: __ }) => {
    return __;
  }).catch(error => 'An error occurred while loading the component');
}

export default  {
  getWoleetLibs,
  getI18mService
}
