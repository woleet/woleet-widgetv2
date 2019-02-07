function getWoleetLibs() {
  return import('@woleet/woleet-weblibs').then(({ default: woleet }) => {
    return woleet;
  }).catch(error => 'An error occurred while loading the component');
}

export default  {
  getWoleetLibs
}
