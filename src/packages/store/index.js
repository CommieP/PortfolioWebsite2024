import { configureStore } from "@reduxjs/toolkit";
import currentPageSlice from "./reducers/currentPageReducer.js"

const store = configureStore({
  reducer: {
    currentPageData: currentPageSlice,
  },
});

export default store;
