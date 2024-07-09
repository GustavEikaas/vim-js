type SubscriberEventCb<T> = (ev: T) => void;

/**
 * Creates a generic list of subscribers
 */
export function createSubscriptionChannel<T>() {
  let subscribers: SubscriberEventCb<T>[] = []

  const notify = (event: T) => {
    subscribers.forEach(cb => cb(event))
  }

  return {
    addSubscriber: (cb: SubscriberEventCb<T>, signal: AbortSignal) => {
      subscribers.push(cb)
      signal.onabort = () => {
        subscribers = subscribers.filter(s => s !== cb)
      }
    },
    notify
  }
}
