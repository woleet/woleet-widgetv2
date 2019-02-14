class WidgetLogger {
  constructor() {
    this.errors = [];
  }
  
  error(error) {
    this.errors.push(error);
    console.log('errors', this.errors, error);
  
    throw Error(error);
  }
}

let widgetLogger = new WidgetLogger();

export default widgetLogger;
