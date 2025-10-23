import { persistConfig } from "./redux-config";

import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authSlice from "./authSlice";
import editDataSlice from "./editIDataSlice";

// Step 1: Base reducer
const appReducer = combineReducers({
  userdata: authSlice,
  editData: editDataSlice,
});

// Step 2: RootState type derived from appReducer
export type RootState = ReturnType<typeof appReducer>;

// Step 3: Custom root reducer with logout reset
const newrootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === "auth/logout") {
    state = {} as RootState; // safely reset
    localStorage.removeItem("persist:root");
  }
  return appReducer(state, action);
};

// Step 4: Persisted reducer
const persistedReducer = persistReducer(persistConfig, newrootReducer);

// Step 5: Configure store
const store = configureStore({
  reducer: {
    data: persistedReducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }),
});

// Step 6: Persist store
const persistedStore = persistStore(store);

// Step 7: Useful types
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type StoreRootState = ReturnType<typeof store.getState>; // <- includes "data"
export type DataState = RootState; // state.data shape = RootState

export { store, persistedStore };
