import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/app-slice";
import tenants from "./slices/tenants-slice";

export const store = configureStore({
  reducer: {
    app,
    tenants,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
