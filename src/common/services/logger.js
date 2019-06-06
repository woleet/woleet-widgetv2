/**
 * A service to customize logging
 */
class WidgetLogger {
  constructor() {
    this.errors = [];
    this.logs = [];
  }
  
  error(error) {
    this.errors.push(error);
    console.log('errors', this.errors, error);
  
    throw Error(error);
  }
  
  log(message) {
    this.logs.push(message);
    
    console.log('this.logs', this.logs);
  }
}

let widgetLogger = new WidgetLogger();

export default widgetLogger;
