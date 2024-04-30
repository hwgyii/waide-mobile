import { useEffect, useState } from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { get, isEmpty } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as api from "./src/utilities/api";

import Authentication from "./src/pages/Authentication";
import LoginCard from "./src/components/LoginCard";
import Home from "./src/pages/Home";
import Inventories from "./src/components/Inventories/Inventories";


export default function App() {
  const [user, setUser] = useState({});
  
  async function getUser() {
     const sessionToken = await AsyncStorage.getItem("sessionToken");
     if(sessionToken) {
       const response = await api.getUser(sessionToken);
       if(!isEmpty(response.data.user) && response.status === 200) {
         setUser(response.data.user);
         await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
       } else {
          alert("Session expired. Please login again.");
          //  NAVIGATE TO LOGIN PAGE
       }
     } else {
      //  NAVIGATE TO LOGIN PAGE
     }
  };

  useEffect(() => {
    try {
      getUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <GluestackUIProvider config={config}>
      {/* <Authentication /> */}
      {/* <LoginCard /> */}
      <Inventories />
    </GluestackUIProvider>
  )
}