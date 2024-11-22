import { configureStore } from "@reduxjs/toolkit";
import nav_Reducer from "./slices/navSlice"

export const store = configureStore({
  reducer: {
    nav:nav_Reducer,
  },
});