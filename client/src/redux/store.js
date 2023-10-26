import { configureStore } from "@reduxjs/toolkit";
import { postReucer } from "./slices/postSlice";
import { authReducer } from "./slices/authSlice";

const store = configureStore({
  reducer: {
    posts: postReucer,
    auth: authReducer,
  },
});

export default store;
