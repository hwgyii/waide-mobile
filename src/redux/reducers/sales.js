import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sales: [],
  receipts: [],
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
    getReceipts: (state, action) => {
      state.receipts = action.payload
    },
    updateReceipts: (state, action) => {
      state.receipts = action.payload
    },
  }
});

export const { getSales, updateSales, getReceipts, updateReceipts } = salesSlice.actions;

export default salesSlice.reducer;