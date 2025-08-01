import { MESSAGE, type PubSubEventKeys } from "./Pubsub.events";

type Callback<T = any> = (data: T) => void;

interface Subscribers {
  [event: PubSubEventKeys]: Callback[];
}

const PubSub = (() => {

  const subscribers: Subscribers = {};

  function subscribe<T = any>(event: PubSubEventKeys, callback: Callback<T>): () => void {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    subscribers[event].push(callback);
    return () => unsubscribe(event, callback);
  }

  function publish<T = any>(event: PubSubEventKeys, data?: T): void {
    if (!subscribers[event]) return;
    subscribers[event].forEach(callback => callback(data));
  }

  function unsubscribe<T = any>(event: PubSubEventKeys, callback: Callback<T>): void {
    if (!subscribers[event]) return;
    subscribers[event] = subscribers[event].filter(cb => cb !== callback);
  }

  return {
    subscribe,
    publish,
    messages: MESSAGE,
  };
})();

export default PubSub;
