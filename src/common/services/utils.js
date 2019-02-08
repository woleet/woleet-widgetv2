function extendObject(a, b) {
  for (let key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
}

function defineProperty(target) {
  return (name, value) => Object.defineProperty(target, name, {
    enumerable: false,
    value
  })
}

function extractClasses(styles, classCodes) {
  return Object.keys(styles)
    .map(classCode => classCodes.indexOf(classCode) !== -1 ? styles[classCode] : '')
    .filter(className => className && className.length > 0);
}

export default  {
  extendObject,
  defineProperty,
  extractClasses
}
