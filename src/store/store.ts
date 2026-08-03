import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";
import authReducer from "./authSlice";
import { socketMiddleware } from "./socketMiddleware"; // <-- ADD THIS

export const store = configureStore({
  reducer: {
    board: boardReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware), // <-- ADD THIS
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;