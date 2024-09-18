import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./slice/authSlice";
import rightDrawerSlice from "./slice/rightDrawerSlice";
import catalogSlice from "./pages/Catalog/slice/catalogSlice";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
  },
  combineReducers({
    authSlice,
    rightDrawer: rightDrawerSlice,
    catalogSlice,
  })
);

const store = configureStore({
  // reducer: combineReducers({ authSlice }),
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
