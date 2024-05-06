import { useState } from "react";
import { Box, Button, Pressable, } from "@gluestack-ui/themed";
import { Text, } from "react-native";

export default function InventoryCard({ inventory, index, order, onSetOrder }) {
  const [isPressed, setIsPressed] = useState(false);

  const onPressInventoryCard = (event) => {
    event.preventDefault();
    setIsPressed((prev) => !prev); 

  };

  function OrderSize() {
    const [orderSize, setOrderSize] = useState(order?.orderSize || 1);

    const onDoneGetOrderSize = (event) => {
      event.preventDefault();
      onSetOrder({
        ...inventory,
        orderSize: orderSize,
      });
      onPressInventoryCard(event);
    };
    
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "$white",
          }}
        >
          <Button onPress={() => setOrderSize((prev) => prev !== inventory.quantity ? prev + 1 : prev)} isDisabled={inventory.quantity === 0}><Text>+</Text></Button>
          <Text>{orderSize}</Text>
          <Button onPress={() => setOrderSize((prev) => prev > 0 ? prev - 1 : 0 )} isDisabled={inventory.quantity === 0}><Text>-</Text></Button>
          <Button onPress={onDoneGetOrderSize} isDisabled={inventory.quantity === 0}><Text>Done</Text></Button>
        </Box>
      </Box>
    );
  };

  return (
    <Pressable onPress={onPressInventoryCard}>
      <Box
        sx={{
          height: 100,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          bgColor: index % 2 === 0 ? "#FDA5A5" : "#D9D9D9",
        }}
      >
        <Box
          sx={{
            flexDirection: "row",
          }}
        >
          {/* Image */}
          <Box sx={{height: "90%", width: "90px", bgColor: "red"}} >

          </Box>
          {/* PRODUCT NAME */}
          <Text>{inventory.name}</Text>
        </Box>
        <Text style={{ marginRight: 10 }}>{(Math.round(inventory.price * 100) / 100).toFixed(2)}</Text>
      </Box>
      {
        isPressed && (
          <Box
            sx={{
              height: 50,
              width: "60%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              bgColor: "#F00B51",
              position: "absolute",
              marginTop: "5%",
              marginLeft: "20%"
            }}
          >
            <OrderSize />
          </Box>
        )
      }
    </Pressable>
  );
};