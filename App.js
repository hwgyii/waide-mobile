import { useEffect, useState } from "react";
import { Box, GluestackUIProvider, Spinner, Text } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { get, isEmpty, set } from "lodash";
import { Provider, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as api from "./src/utilities/api";

import { store } from "./src/redux/store.js";

import { useDispatch } from "react-redux";

import Authentication from "./src/pages/Authentication";
import { getAuth, getEstablishment } from "./src/redux/reducers/auth.js";
import AppNavigation from "./src/navigation/AppNavigation.jsx";
import CustomerNavigation from "./src/navigation/CustomerNavigation.jsx";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [componentToRender, setComponentToRender] = useState("Authentication");
  const dispatch = useDispatch();

  useEffect(() => {
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
            setComponentToRender(response.data.user.role === 1 && response.data.establishment ? "Establishment" : "Customer");
          }
        } else {
          //  NAVIGATE TO LOGIN PAGE
          setComponentToRender("Authentication");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("Session expired. Please login again.");
          await AsyncStorage.clear();
          //  NAVIGATE TO LOGIN PAGE
          setComponentToRender("Authentication");
        } else {
          console.error(error);
        }
      }
    }

    getUser();
    setIsLoaded(true);
  }, []);

  function Loading() {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size={"xl"} style={{ height: 100, width: 100 }} />
      </Box>
    );
  }

  const rendercomponent = () => {
    switch (componentToRender) {
      case "Authentication":
        return <Authentication setAppToRender={setComponentToRender} />;
      case "Establishment":
        return <AppNavigation setAppToRender={setComponentToRender} />;
      case "Customer":
        return <CustomerNavigation setAppToRender={setComponentToRender} />;
      default:
        return <Authentication setAppToRender={setComponentToRender} />;
    };
  };

  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        {
          isLoaded
            ?
              rendercomponent()
            :
              <Loading />
        }
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