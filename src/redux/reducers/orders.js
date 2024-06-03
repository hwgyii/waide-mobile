import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: {},
};

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    getOrders: (state, action) => {
      state.orders = action.payload
    },
    updateOrders: (state, action) => {
      state.orders = action.payload
    },
  }
});

export const { getOrders, updateOrders } = orderSlice.actions;

export default orderSlice.reducer;