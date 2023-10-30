import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const getUserData = createAsyncThunk("auth/getUser", async (body) => {
  const { data } = await axios.post("/auth/signIn", body);
  return data;
});

export const authMe = createAsyncThunk("auth/authMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

export const regUser = createAsyncThunk("auth/regUser", async (body) => {
  const { data } = await axios.post("/auth/register", body);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [getUserData.fulfilled]: (state, { payload }) => {
      state.status = "laoded";
      state.data = payload;
    },
    [getUserData.rejected]: (state) => {
      state.status = "loading";
      state.data = null;
    },

    [authMe.fulfilled]: (state, { payload }) => {
      state.status = "laoded";
      state.data = payload;
    },

    [regUser.fulfilled]: (state, { payload }) => {
      state.status = "laoded";
      state.data = payload;
    },
    [regUser.rejected]: (state) => {
      state.status = "loading";
      state.data = null;
    },
  },
});
export const isAuthSelector = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
