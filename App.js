import { useEffect, useState } from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { get, isEmpty } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as api from "./src/utilities/api";

import Authentication from "./src/pages/Authentication";


export default function App() {
  const [user, setUser] = useState({});
  
  async function getUser() {
    try {
      const sessionToken = await AsyncStorage.getItem("sessionToken");
      if (sessionToken) {
        const response = await api.getUser(sessionToken);
        if (!isEmpty(response.data.user) && response.status === 200) {
          setUser(response.data.user);
          await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } else {
        //  NAVIGATE TO LOGIN PAGE
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Session expired. Please login again.");
        await AsyncStorage.removeItem("sessionToken");
        await AsyncStorage.removeItem("user");
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
    <GluestackUIProvider config={config}>
      <Authentication />
      {/* <LoginCard /> */}
      {/* <SignupCard /> */}
      {/* <Inventories /> */}
    </GluestackUIProvider>
  )
}