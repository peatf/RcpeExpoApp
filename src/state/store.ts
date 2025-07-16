import { configureStore } from '@reduxjs/toolkit';
import questReducer from './quests/questSlice';

export const store = configureStore({
  reducer: {
    quests: questReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
