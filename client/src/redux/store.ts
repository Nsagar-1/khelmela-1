import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import userSlice from './userSlice';
import storage from 'redux-persist/lib/storage';

// 1. First create your root reducer
const rootReducer = combineReducers({
  user: userSlice,
});

// 2. Define RootState type based on the root reducer
export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Create store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// 4. Export persistor
export const persistor = persistStore(store);

// 5. Export AppDispatch type
export type AppDispatch = typeof store.dispatch;