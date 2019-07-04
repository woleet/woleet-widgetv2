/**
 * Event Observer pattern
 * It's used for communication between the widget components
 */
class EventObserver {
  constructor () {
    this.observers = []
  }

  // Subscribe on events
  subscribe (fn) {
    this.observers.push(fn);
  }

  // Unsubscribe from events
  unsubscribe (fn) {
    this.observers = this.observers.filter(subscriber => subscriber !== fn)
  }

  // Broadcast an event
  broadcast (data, ...args) {
    this.observers.forEach(subscriber => subscriber(data, ...args))
  }
}

export default EventObserver;
