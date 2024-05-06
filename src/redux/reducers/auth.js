import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: {},
  establishment: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAuth: (state, action) => {
      state.auth = action.payload
    },
    getEstablishment: (state, action) => {
      state.establishment = action.payload
    },
  }
});

export const { getAuth, getEstablishment } = authSlice.actions;

export default authSlice.reducer;