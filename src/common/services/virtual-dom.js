import utils from './utils';

// The class to make and element hidden
let hiddenClass = 'hidden';

/**
 * The service to create elements of virtual DOM
 * @param element
 * @constructor
 */
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

  // Get real HTML element
  defineProp('target', () => target);

  // Define base64 SVG image as src attribute
  defineProp('setSvg', (svg, color = null) => getSelf(svg=!!(color) ? svg.replace('currentColor', color) : svg,
    svg ? target.setAttribute('src', `data:image/svg+xml;base64,${btoa(svg)}`) : target.removeAttribute('src')));

  // Define src attribute
  defineProp('setSrc', (svg) => getSelf(svg ? target.setAttribute('src', svg) : target.removeAttribute('src')));

  // Define element's attribute
  defineProp('attr', (attr, val) => getSelf(val ? target.setAttribute(attr, val) : target.removeAttribute(attr)));

  // Remove element's class
  defineProp('removeClass', (e) => getSelf(Array.isArray(e) ? e.forEach(e => target.classList.remove(e)) : target.classList.remove(e)));

  // Add element's classes
  defineProp('addClass', (e) => getSelf(Array.isArray(e) ? e.forEach(e => target.classList.add(e)) : target.classList.add(e)));

  // Define element's text
  defineProp('text', (text, add) => getSelf(add ? target.innerText += text : target.innerText = text));

  // Define element's html
  defineProp('html', (text, add) => getSelf(add ? target.innerHTML += text : target.innerHTML = text));

  // Append html into the element
  defineProp('append', (html) => getSelf(target.appendChild(html)));

  // Define element's height
  defineProp('height', (value) => getSelf(target.height = value));

  // Define element's width
  defineProp('width', (value) => getSelf(target.width = value));

  // Define element's href
  defineProp('link', (url) => getSelf(self.text(url).attr('href', url)));

  // Clear the element
  defineProp('clear', () => getSelf(self.text(''), self.attr('href', null)));

  // Show the element
  defineProp('show', () => self.removeClass(hiddenClass));

  // Hide the element
  defineProp('hide', () => self.addClass(hiddenClass));

  // Define the hidden class
  defineProp('setHiddenClass', className => hiddenClass = className);

  // Define the element's class
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

  // Add the event's listener
  defineProp('on', (type, listener, capture) => getSelf(target.addEventListener(type, listener, capture)));

  // Remove the event's listener
  defineProp('off', (type, listener) => getSelf(target.removeEventListener(type, listener)));

  // Render the element content
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

/**
 * Create a custom element of virtual DOM
 * @param element
 * @param options
 * @param attrs
 * @return {DOM}
 */
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
  return createElement('input', options, utils.extendObject({ type: 'file', title: '' }, attrs));
}

export default {
  createElement,
  createFileInput
}
