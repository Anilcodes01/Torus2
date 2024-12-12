import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import analyticsReducer from './slices/analyticsSlice'
import authenticationReducer from './slices/authenticationSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
   analytics: analyticsReducer,
   authentication: authenticationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  
