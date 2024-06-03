import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./reducers/auth";
import inventoryReducer from "./reducers/inventory";
import salesReducer from "./reducers/sales";
import tablesReducer from "./reducers/table";
import invoiceReducer from "./reducers/invoice";
import orderReducer from "./reducers/orders";

export const store = configureStore({
  reducer : {
    // Add reducers here
    auth: authReducer,
    inventories: inventoryReducer,
    invoices: invoiceReducer,
    sales: salesReducer,
    tables: tablesReducer,
    orders: orderReducer,
  },
});