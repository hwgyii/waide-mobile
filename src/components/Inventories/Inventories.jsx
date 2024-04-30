import { useEffect, useState } from "react";
import { Box, ScrollView } from "@gluestack-ui/themed";
import { Text, SafeAreaView, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import InventoryBottomSheet from "./InventoryBottomSheet";
import InventoryCard from "./InventoryCard";

import inventories from "../../constants/inventories";

function InventoryHeader() {
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
      <Text>Inventory</Text>
      <Text>Search Inventory</Text>
    </Box>
  );
};

export default function Inventories() {
  const [orders, setOrders] = useState([]);
  const [selectedInventories, setSelectedInventories] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
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
  }, [orders]);
  
  const onSetOrder = (order) => {
    setOrders((prev) => {
      return {
        ...prev,
        [order._id]: order,
      }
    });
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
              marginBottom: Dimensions.get("window").height * 0.20 - 50, //CHANGE 0.15 to the initial height of the bottom sheet
            }}
          >
            {
              inventories.map((inventory, index) => {
                return (
                  <InventoryCard key={index} inventory={inventory} index={index} order={orders[inventory._id]} onSetOrder={onSetOrder}/>
                );
              })
            }
          </ScrollView>
          <InventoryBottomSheet orders={orders} selectedInventories={selectedInventories} totalPrice={totalPrice} />
        </SafeAreaView>
      </GestureHandlerRootView>
  );
};