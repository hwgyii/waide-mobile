import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sales: {},
};

export const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    getSales: (state, action) => {
      state.sales = action.payload
    },
    updateSales: (state, action) => {
      state.sales = action.payload
    },
  }
});

export const { getSales, updateSales } = salesSlice.actions;

export default salesSlice.reducer;