import template from './index.handlebars';
import styles from './index.scss';

/**
 *
 * @param widgetElement
 * @param configuration
 * @param dependencies
 */
export function fileHasherWidget(widgetElement, configuration, dependencies) {
  const {provenFile, lang} = configuration;

  // render the final html according with parameters
  widgetElement.innerHTML = template({styles, lang});
}
