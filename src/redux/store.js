import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./reducers/auth";
import inventoryReducer from "./reducers/inventory";
import salesReducer from "./reducers/sales";
import tablesReducer from "./reducers/table";

export const store = configureStore({
  reducer : {
    // Add reducers here
    auth: authReducer,
    inventories: inventoryReducer,
    sales: salesReducer,
    tables: tablesReducer,
  },
});