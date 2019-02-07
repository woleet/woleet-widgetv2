import template from './index.handlebars';
import styles from './index.scss';

/**
 *
 * @param globalObject
 */
export function displayIcon(globalObject) {
  const {configuration} = globalObject;
  const {mode, type, lang, colors} = configuration;

  // render the final html according with parameters
  globalObject.widgetElement.innerHTML = template({styles, mode, type, lang, colors});
}
