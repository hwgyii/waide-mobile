import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Inventories from "../components/Inventories/Inventories";
import Orders from "../components/Orders/Orders";
import Tables from "../components/Tables/Tables";
import Home from "../pages/Home";

import TablesCRUD from "../components/CRUD/Tables/TablesCRUD";
import InventoriesCRUD from "../components/CRUD/Inventories/InventoriesCRUD";
import Receipts from "../components/CRUD/Receipts/Receipts";
import Settings from "../pages/Settings";
import TaxCalculator from "../pages/TaxCalculator";
import Reports from "../pages/Reports";

import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import * as api from "../utilities/api";
import { getEstablishment } from "../redux/reducers/auth";
import { get } from "lodash";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Box, Divider, Image, Pressable, Text, View } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function AppNavigation({ setAppToRender }) {
  function BottomTabStack() {
    return(
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={BottomTabs} />
      </Stack.Navigator>
    );
  };

  function BottomTabs() {
    const dispatch = useDispatch();
    const { establishment } = useSelector((state) => state.auth);

    const fetchEstablishment = async () => {
      try {
        const response = await api.getMyEstablishment();
        if (response.status === 200) {
          dispatch(getEstablishment(response.data.establishment));
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchEstablishment();
    }, []);


    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { height: 70 }}}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabelStyle: {
              fontSize: 16,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialIcons name="home-filled" size={30} color={focused ? "blue" : "black"} />
              )
            },
          }}
        />
        {
          get(establishment.settings, "inventoryEnabled", false)
            ?
              <Tab.Screen 
                name="Inventory"
                component={Inventories}
                options={{
                  tabBarLabelStyle: {
                    fontSize: 16,
                  },
                  tabBarIcon: ({ focused }) => {
                    return (
                      <MaterialIcons name="menu-book" size={30} color={focused ? "blue" : "black"} />
                    )
                  },
                }}
              />
            :
              null
        }
        {
          get(establishment.settings, "preparationEnabled", false)
            ?
              <Tab.Screen
                name="Orders"
                component={Orders}
                options={{
                  tabBarLabelStyle: {
                    fontSize: 16,
                  },
                  tabBarIcon: ({ focused }) => {
                    return (
                      <MaterialIcons name="receipt-long" size={30} color={focused ? "blue" : "black"} />
                    )
                  }
                }}
              />
            :
              null
        }
        {
          get(establishment.settings, "tablesEnabled", false)
            ?
              <Tab.Screen
                name="Tables"
                component={Tables}
                options={{
                  tabBarLabelStyle: {
                    fontSize: 16,
                  },
                  tabBarIcon: ({ focused }) => {
                    return (
                      <MaterialIcons name="table-restaurant" size={30} color={focused ? "blue" : "black"} />
                    )
                  }
                }}
              />
            :
              null
        }
      </Tab.Navigator>
    );
  };

  function CustomDrawerContent({props}) {
    const { establishment } = useSelector((state) => state.auth);

    const onLogout = async () => {
      try {
        const response = await api.logOut();
        if (response.status === 200) {
          await AsyncStorage.clear();
          setAppToRender("Authentication");
        } 
      } catch (error) {
        console.error(error);
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <Box
            sx={{
              height: 150,
              backgroundColor: "#FE8383",
              width: "100%",
              marginTop: -5,
            }}
          >
            <Text marginTop={20} marginLeft={10} fontSize={24} fontWeight="bold" color="black">{establishment.name}</Text>
            <Text marginTop={10} marginLeft={10} fontSize={16} color="black">{establishment.address}</Text>
          </Box>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <Pressable
          style={{ 
            position: "absolute",
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "#DDDDDD",
            padding: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {onLogout();}}
          >
            <Text fontWeight="bold" fontSize={16}>Logout</Text>
          </TouchableOpacity>
        </Pressable>
      </View>
    )
  };

  function DrawerNavigation() {
    return (
      <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent props={props} />}
      screenOptions={{
          headerTitle: () => <Image alt="App Logo" source={require("../assets/AppLogo.png")} style={{ width: 250, resizeMode: "contain" }} />
        }}
      >
        {/* <Drawer.Screen name="Reports" component={Reports} /> */}
        <Drawer.Screen name="Establishment Features" component={BottomTabStack} options={{
        }}/>
        <Drawer.Screen name="Tables Settings" component={TablesCRUD} />
        <Drawer.Screen name="Inventories Settings" component={InventoriesCRUD} />
        <Drawer.Screen name="Receipts" component={Receipts} />
        <Drawer.Screen name="Business Tax Calculator" component={TaxCalculator} />
        <Drawer.Screen name="Reports" component={Reports} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer> 
  )
};