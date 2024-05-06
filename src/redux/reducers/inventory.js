import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventories: {},
};

export const inventorySlice = createSlice({
  name: "inventories",
  initialState,
  reducers: {
    getInventories: (state, action) => {
      state.inventories = action.payload
    },
    updateInventories: (state, action) => {
      state.inventories = action.payload
    },
  }
});

export const { getInventories, updateInventories } = inventorySlice.actions;

export default inventorySlice.reducer;