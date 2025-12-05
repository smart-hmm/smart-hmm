import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/app-slice";
import user from "./slices/user-slice";

export const store = configureStore({
  reducer: {
    app,
    user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
