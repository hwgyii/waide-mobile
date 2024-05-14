import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./reducers/auth";
import inventoryReducer from "./reducers/inventory";
import salesReducer from "./reducers/sales";

export const store = configureStore({
  reducer : {
    // Add reducers here
    auth: authReducer,
    inventories: inventoryReducer,
    sales: salesReducer,
  },
});