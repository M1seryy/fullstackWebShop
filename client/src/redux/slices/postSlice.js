import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
export const getAllPosts = createAsyncThunk("posts/getAll", async () => {
  const { data } = await axios.get("/post");
  return data;
});
export const getAllTags = createAsyncThunk("tags/getAll", async () => {
  const { data } = await axios("/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllPosts.fulfilled]: (state, { payload }) => {
      state.posts.status = "laoded";
      state.posts.items = payload.db;
    },
    [getAllPosts.rejected]: (state) => {
      state.posts.status = "loading";
      state.posts.items = [];
    },
    [getAllTags.fulfilled]: (state, { payload }) => {
      state.tags.status = "laoded";
    },
    [getAllTags.fulfilled]: (state, { payload }) => {
      state.tags.status = "laoded";
      state.tags.items = payload.tags;
    },
    [getAllTags.rejected]: (state) => {
      state.tags.status = "loading";
      state.tags.items = [];
    },
  },
});

export const postReucer = postSlice.reducer;
