import { persistConfig } from "./redux-config";
import authSlice from "./authSlice"
import editDataSlice from "./editIDataSlice"
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer,persistStore, REGISTER, REHYDRATE } from "redux-persist";

const appReducer = combineReducers({
    userdata: authSlice,
    editData:editDataSlice
});

const newrootReducer = (state, action) => {
    if (action.type === "auth/logout") {
        state = {};
        localStorage.removeItem("persist:root");
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, newrootReducer);

const store = configureStore({
    reducer: {
        data: persistedReducer,
    },
    devTools: process.env.NODE_ENV === "development" ? true : false,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
            },
        }),
});

const persistedStore = persistStore(store);
export { store, persistedStore };
