import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
export const getAllPosts = createAsyncThunk("posts/getAll", async () => {
  const { data } = await axios.get("/post");
  return data;
});
export const getUserData = createAsyncThunk("auth/getUser", async (body) => {
  const { data } = await axios.post("/auth/signIn",body);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllPosts.fulfilled]: (state, { payload }) => {
      state.status = "laoded";
      state.data = payload;
    },
    [getAllPosts.rejected]: (state) => {
      state.status = "loading";
      state.data = [];
    },
  },
});

export const authReducer = authSlice.reducer;
