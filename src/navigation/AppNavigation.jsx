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

import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import * as api from "../utilities/api";
import { getEstablishment } from "../redux/reducers/auth";
import { get } from "lodash";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function AppNavigation() {
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

  function DrawerNavigation() {
    return (
      <Drawer.Navigator screenOptions={{
        drawerStyle: {
          width: "70%",
        },
      }}>
        <Drawer.Screen name="BottomTabs" component={BottomTabStack} options={{
        }}/>
        <Drawer.Screen name="Tables Settings" component={TablesCRUD} />
        <Drawer.Screen name="Inventories Settings" component={InventoriesCRUD} />
        <Drawer.Screen name="Receipts" component={Receipts} />
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