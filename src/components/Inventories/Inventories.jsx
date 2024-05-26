import { useCallback, useState } from "react";
import { Box, Input, ScrollView, Spinner, } from "@gluestack-ui/themed";
import { Text, SafeAreaView, Dimensions, TextInput, } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import InventoryBottomSheet from "./InventoryBottomSheet";
import InventoryCard from "./InventoryCard";

import * as api from "../../utilities/api";
import { isEmpty, } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { getTables } from "../../redux/reducers/table";
import { useFocusEffect } from "@react-navigation/native";

export default function Inventories() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedInventories, setSelectedInventories] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const dispatch = useDispatch();
  const { establishment } = useSelector((state) => state.auth);
  const { inventories } = useSelector((state) => state.inventories);
  const { getInventories } = require("../../redux/reducers/inventory");

  const [searchInventory, setSearchInventory] = useState("");
  const [filteredInventories, setFilteredInventories] = useState([]);

  const fetchInventories = async () => {
    try {
      const response = await api.getInventories();
      if (response.status === 200) {
        dispatch(getInventories(response.data.inventories));
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await api.getEstablishmentTables();
      if(response.status === 200) {
        dispatch(getTables(response.data.tables));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInventories();
      fetchTables();
    }, [])
  );

  useFocusEffect(useCallback(() => {
    let total = 0;
    let count = 0;
    for (const key in orders) {
      if (Object.hasOwnProperty.call(orders, key)) {
        const order = orders[key];
        total += order.price * order.orderSize;
        count += order.orderSize;
      }
    }
    setTotalPrice(total);
    setSelectedInventories(count);
  }, [orders]));

  useFocusEffect(useCallback(() => {
    if (searchInventory === "") {
      setFilteredInventories([]);
    } else {
      setFilteredInventories(inventories.filter((inventory) => inventory.name.toLowerCase().includes(searchInventory.toLowerCase())));
    }
  }, [searchInventory]));
  
  const onSetOrder = (order) => {
    setOrders((prev) => {
      if (order.orderSize === 0) {
        return (
          Object.keys(prev).reduce((acc, key) => {
            if (key !== order._id) {
              acc[key] = prev[key];
            }
            return acc;
          }, {})
        )
      }
      return {
        ...prev,
        [order._id]: order,
      }
    });
  };

  const onClearOrders = () => {
    setOrders({});
    setSelectedInventories(0);
    setTotalPrice(0);
  };

  function InventoryHeader() {
    const [temp, setTemp] = useState(searchInventory);

    return (
      <Box
        sx={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* NOT YET IMPLEMENTED
            - Add a search bar to search for inventories
            - Add a Add inventory button to add new inventories
            - Better UI for the header
            - Find a better way to implement the header
        */}
        <Text style={{ fontSize: 32, marginLeft: "35%"}}>Inventory</Text>
        <Input placeholder="Email"
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <TextInput
              type="text"
              inputMode="text"
              keyboardType="default"
              placeholder="Search inventories"
              value={temp}
              onChangeText={(value) => {setTemp(value)}}
              onEndEditing={() => {setSearchInventory(temp)}}
              onBlur={() => {setSearchInventory(temp)}}
            />
          </Input>
      </Box>
    );
  };

  return (
      <GestureHandlerRootView>
        <SafeAreaView
          style={{
            height: "100%"
          }}
        >
          <InventoryHeader />
          <ScrollView
            style={{
              height: "calc(100% - 50px)",
              marginBottom: Dimensions.get("window").height * 0.20 - 50, //CHANGE 0.15 to the initial height of the bottom sheet
            }}
          >
            {
              isLoaded ? //IF INVENTORIES ARE LOADED
                inventories.length !== 0 ? // IF INVENTORIES ARE LOADED AND NOT EMPTY
                searchInventory !== "" ? //IF USER SEARCHES FOR INVENTORIES
                  filteredInventories.length !== 0 ? //IF USER SEARCHES FOR INVENTORIES
                    filteredInventories.map((inventory, index) => {
                      return (
                        <InventoryCard key={index} inventory={inventory} index={index} order={orders[inventory._id]} onSetOrder={onSetOrder}/>
                      );
                    })
                  : //SHOW NO INVENTORIES FOUND TEXT WHEN filteredInventories IS EMPTY
                    <Box
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ marginTop: "50%" }}>No Inventories found.</Text>
                    </Box>
                  : //ELSE RENDER ALL INVENTORIES
                    inventories.map((inventory, index) => {
                      return (
                        <InventoryCard key={index} inventory={inventory} index={index} order={orders[inventory._id]} onSetOrder={onSetOrder}/>
                      );
                    })
                : //ELSE RENDER NO INVENTORIES FOUND TEXT
                  <Box
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginTop: "50%" }}>No Inventories found.</Text>
                  </Box>
              : //ELSE RENDER LOADING SPINNER
                <Box
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spinner size={"xl"} style={{ height: 100, width: 100, marginTop: "50%" }} />
                </Box>
            }
          </ScrollView>
          <InventoryBottomSheet orders={orders} selectedInventories={selectedInventories} totalPrice={totalPrice} onClearOrders={onClearOrders} />
        </SafeAreaView>
      </GestureHandlerRootView>
  );
};