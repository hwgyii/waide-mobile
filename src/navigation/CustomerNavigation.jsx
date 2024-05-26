import Establishments from "../components/Customer/Establishments/Establishments";
import CustomerReceipts from "../components/Customer/Receipts/CustomerReceipts";
import Ordering from "../components/Customer/Ordering/Ordering";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TablesCRUD from "../components/CRUD/Tables/TablesCRUD";
import InventoriesCRUD from "../components/CRUD/Inventories/InventoriesCRUD";
import Receipts from "../components/CRUD/Receipts/Receipts";
import Settings from "../pages/Settings";

import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
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

export default function CustomerNavigation({ setAppToRender }) {
  function BottomTabStack() {
    return(
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={BottomTabs} />
      </Stack.Navigator>
    );
  };

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { height: 70 }
        }}
      >
        <Tab.Screen
          name="Establishments"
          component={Establishments}
          options={{
            tabBarLabelStyle : {
              fontSize: 16,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Entypo name="shop" size={30} color={focused ? "blue" : "black"} />
              )
            },
          }}
        />
        <Tab.Screen
          name="Receipts"
          component={CustomerReceipts}
          options={{
            tabBarLabelStyle : {
              fontSize: 16,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons name="receipt" size={30} color={focused ? "blue" : "black"} />
              )
            },
          }}
        />
        <Tab.Screen
          name="Ordering"
          component={Ordering}
          options={{
            tabBarLabelStyle : {
              fontSize: 16,
            },
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialIcons name="menu-book" size={30} color={focused ? "blue" : "black"} />
              )
            },
          }}
        />
      </Tab.Navigator>
    );
  };

  function CustomDrawerContent({props}) {
    const { auth } = useSelector((state) => state.auth);

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
            <Text marginTop={20} marginLeft={10} fontSize={24} fontWeight="bold" color="black">{auth.fullName}</Text>
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
        <Drawer.Screen name="Customer Features" component={BottomTabStack} options={{
        }}/>
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer> 
  )
};