import html from './index.html';
import styles from'./index.scss';

/**
 *
 * @param globalObject
 */
export function displayIcon(globalObject) {
  // convert plain HTML string into DOM elements
  globalObject.widgetElement.innerHTML = html;
  globalObject.widgetElement
    .getElementsByClassName('woleet_file-hasher-widget__wrapper')[0]
    .textContent = JSON.stringify(globalObject.configurations);
}
