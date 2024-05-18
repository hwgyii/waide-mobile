import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tables: [],
};

export const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    getTables: (state, action) => {
      state.tables = action.payload
    },
    updateTables: (state, action) => {
      state.tables = action.payload
    },
  }
});

export const { getTables, updateTables } = tablesSlice.actions;

export default tablesSlice.reducer;