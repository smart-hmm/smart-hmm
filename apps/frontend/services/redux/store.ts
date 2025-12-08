import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/app-slice";

export const store = configureStore({
  reducer: {
    app,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
