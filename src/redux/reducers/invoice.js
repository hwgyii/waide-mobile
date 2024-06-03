import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
};

export const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    getInvoices: (state, action) => {
      state.invoices = action.payload
    },
    updateInvoices: (state, action) => {
      state.invoices = action.payload
    },
  }
});

export const { getInvoices, updateInvoices } = invoiceSlice.actions;

export default invoiceSlice.reducer;