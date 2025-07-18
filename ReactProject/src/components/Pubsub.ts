type Callback<T = any> = (data: T) => void;

interface Subscribers {
  [event: string]: Callback[];
}

const PubSub = (() => {

  const subscribers: Subscribers = {};

  function subscribe<T = any>(event: string, callback: Callback<T>): () => void {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    subscribers[event].push(callback);
    return () => unsubscribe(event, callback);
  }

  function publish<T = any>(event: string, data?: T): void {
    if (!subscribers[event]) return;
    subscribers[event].forEach(callback => callback(data));
  }

  function unsubscribe<T = any>(event: string, callback: Callback<T>): void {
    if (!subscribers[event]) return;
    subscribers[event] = subscribers[event].filter(cb => cb !== callback);
  }

  return {
    subscribe,
    publish
  };
})();

export default PubSub;
