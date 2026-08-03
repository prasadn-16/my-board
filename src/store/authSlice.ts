import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/types";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ uid: string; email: string | null }>,
    ) => {
      // Mocking role assignment: emails containing 'admin' get the admin role.
      // In production, fetch this from Firestore/Custom Claims.
      const role = action.payload.email?.toLowerCase().includes("admin")
        ? "admin"
        : "user";
      state.user = { ...action.payload, role };
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;