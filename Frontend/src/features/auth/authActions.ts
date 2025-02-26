//features/auth/authActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosClient from "../../api/axios";
import { AuthTokens, LoginInputs, RegisterInputs } from "../../types/AuthTypes";

export const registerUser = createAsyncThunk<AuthTokens, RegisterInputs>(
  "auth/register",
  async (
    { username, email, password, passwordConfirmation }: RegisterInputs,
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.post("auth/register", {
        username,
        email,
        password,
        passwordConfirmation,
      });
      const { access_token } = response.data;

      localStorage.setItem("accessToken", access_token);
      return { accessToken: access_token };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const userLogin = createAsyncThunk<AuthTokens, LoginInputs>(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<{
        access_token: string;
        expires_in: number;
      }>("auth/login", {
        username,
        password,
      });

      const { access_token } = response.data;

      localStorage.setItem("accessToken", access_token);
      return { accessToken: access_token };
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

