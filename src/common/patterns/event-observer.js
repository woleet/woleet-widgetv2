/**
 * Event Observer pattern
 * It's used for communication between the widget components
 */
class EventObserver {
  constructor () {
    this.observers = []
  }

  // subscribe on events
  subscribe (fn) {
    this.observers.push(fn);
  }

  // unsubscribe from events
  unsubscribe (fn) {
    this.observers = this.observers.filter(subscriber => subscriber !== fn)
  }

  // broadcast an event
  broadcast (data) {
    this.observers.forEach(subscriber => subscriber(data))
  }
}

export default EventObserver;
