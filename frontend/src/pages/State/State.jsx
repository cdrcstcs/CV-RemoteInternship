import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarCollapsed: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed } = globalSlice.actions;

export default globalSlice.reducer;
