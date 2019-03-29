import utils from './utils';

// Allow class customization
let hiddenClass = 'hidden';

function DOM(element) {
  if ((!element instanceof Element)) {
    throw new TypeError;
  }
  /**
   * @type {DOM}
   */
  const self = this;
  const target = element;
  const getSelf = () => self;
  const defineProp = utils.defineProperty(this);
  
  defineProp('target', () => target);
  
  defineProp('attr', (attr, val) => getSelf(val ? target.setAttribute(attr, val) : target.removeAttribute(attr)));
  
  defineProp('removeClass', (e) => getSelf(Array.isArray(e) ? e.forEach(e => target.classList.remove(e)) : target.classList.remove(e)));
  
  defineProp('addClass', (e) => getSelf(Array.isArray(e) ? e.forEach(e => target.classList.add(e)) : target.classList.add(e)));
  
  defineProp('text', (text, add) => getSelf(add ? target.innerText += text : target.innerText = text));
  
  defineProp('html', (text, add) => getSelf(add ? target.innerHTML += text : target.innerHTML = text));
  
  defineProp('append', (html) => getSelf(target.appendChild(html)));
  
  defineProp('height', (value) => getSelf(target.height = value));
  
  defineProp('width', (value) => getSelf(target.width = value));
  
  defineProp('link', (url) => getSelf(self.text(url).attr('href', url)));
  
  defineProp('clear', () => getSelf(self.text(''), self.attr('href', null)));
  
  defineProp('show', () => self.removeClass(hiddenClass));
  
  defineProp('hide', () => self.addClass(hiddenClass));
  
  defineProp('setHiddenClass', className => hiddenClass = className);
  
  defineProp('style', (props) => {
    if (Array.isArray(props)) {
      return props.map((p) => target.style[p])
    }
    else if (typeof props === 'string') return target.style[props];
    else {
      for (let prop in props) {
        //noinspection JSUnfilteredForInLoop
        target.style[prop] = props[prop];
      }
    }
  });
  
  defineProp('on', (type, listener, capture) => getSelf(target.addEventListener(type, listener, capture)));
  
  defineProp('render', () => {
    let root = self.target();
    for (let e in self) {
      if(self.hasOwnProperty(e)) {
        const elt = self[e];
        try {
          if (Array.isArray(elt))
            elt.forEach((e) => root.appendChild(e.render()));
          else
            root.appendChild(elt.render())
        } catch (err) {
          console.warn(e, target, self[e], err);
        }
      }
    }
    return root;
  });
}

function createElement(element = 'div', options = {}, attrs = {}) {
  const domElement = new DOM(document.createElement(element));
  if (options.classes) {
    domElement.addClass(options.classes);
  }
  
  if (options.hidden) {
    domElement.setHiddenClass(options.hidden);
  }
  
  if (attrs) {
    const attributes = Object.keys(attrs);
    attributes.forEach(attribute => {
      domElement.attr(attribute, attrs[attribute]);
    });
  }
  return domElement;
}

/**
 * Create input file
 * @param options
 * @param attrs
 */
function createFileInput(options = {}, attrs = {}) {
  return createElement('input', options, utils.extendObject({ type: 'file' }, attrs));
}

export default {
  createElement,
  createFileInput
}
