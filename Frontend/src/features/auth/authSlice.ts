import { createSlice } from "@reduxjs/toolkit";
import { AuthTokens, UserInfo } from "../../types/AuthTypes";
import { registerUser, userLogin } from "./authActions";

export interface AuthState {
  loading: boolean;
  userInfo: UserInfo | null;
  authToken: AuthTokens | null;
  error: string | null;
  success: boolean;
}
const authToken: AuthTokens | null = localStorage.getItem("accessToken")
  ? {
      accessToken: localStorage.getItem("accessToken") as string,
    }
  : null;

const initialState: AuthState = {
  loading: false,
  userInfo: null,
  authToken,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.loading = false;
      state.userInfo = null;
      state.authToken = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        if (payload instanceof Error) state.error = payload.message;
        else state.error = "Something Went Wrong";
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.authToken = payload;
        console.log(state.authToken);
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        if (payload instanceof Error) state.error = payload.message;
        else state.error = "Something went wrong";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
