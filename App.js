import { useEffect, useState } from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { get, isEmpty } from "lodash";
import { Provider, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as api from "./src/utilities/api";

import { store } from "./src/redux/store.js";

import { useDispatch } from "react-redux";

import Authentication from "./src/pages/Authentication";
import Inventories from "./src/components/Inventories/Inventories.jsx";
import { getAuth, getEstablishment } from "./src/redux/reducers/auth.js";
import Orders from "./src/components/Orders/Orders.jsx";
import Tables from "./src/components/Tables/Tables.jsx";
import Settings from "./src/pages/Settings.jsx";
import InventoriesCRUD from "./src/components/CRUD/Inventories/InventoriesCRUD.jsx";
import Receipts from "./src/components/CRUD/Receipts/Receipts.jsx";
import TablesCRUD from "./src/components/CRUD/Tables/TablesCRUD.jsx";

function App() {
  const dispatch = useDispatch();
  async function getUser() {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      if (sessionToken) {
        const response = await api.getUser(sessionToken);
        if (!isEmpty(response.data.user) && response.status === 200) {
          dispatch(getAuth(response.data.user));
          if (response.data.user.role === 1 && response.data.establishment) {
            dispatch(getEstablishment(response.data.establishment));
          }
          await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } else {
        //  NAVIGATE TO LOGIN PAGE
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Session expired. Please login again.");
        await AsyncStorage.clear();
        //  NAVIGATE TO LOGIN PAGE
      } else {
        // Handle other types of errors (e.g., network error)
        // You might want to display a generic error message or retry the request
        // Example: alert("An error occurred. Please try again later.");
      }
    }
  }
  
  useEffect(() => {
    getUser();
  }, []);

  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        {/* <Authentication /> */}
        {/* <LoginCard /> */}
        {/* <SignupCard /> */}
        {/* <Inventories /> */}
        {/* <Orders /> */}
        {/* <Tables /> */}
        {/* <Settings /> */}
        {/* <InventoriesCRUD /> */}
        {/* <Receipts />  */}
        <TablesCRUD />
      </GluestackUIProvider>
    </Provider>
  )
}

export default WrappedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
};