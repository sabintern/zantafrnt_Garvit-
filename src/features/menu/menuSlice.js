import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: ["inbox"],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    updateActiveTab: (state, action) => {
      state.activeTab = [action.payload];
    },
  },
});

export const { updateActiveTab } = menuSlice.actions;
export default menuSlice.reducer;
