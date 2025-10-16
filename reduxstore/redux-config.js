const createNoopStorage = () => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};

const storage = typeof window !== 'undefined' ? require('redux-persist/lib/storage').default
  : createNoopStorage();
const persistConfig = {
    key: 'root',
    storage,
    whiteList: ["userdata"],
}

export { persistConfig }