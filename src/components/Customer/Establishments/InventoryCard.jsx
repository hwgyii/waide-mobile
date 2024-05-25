import { useState } from "react";
import { Box, Button, Pressable, Text } from "@gluestack-ui/themed";

import { AntDesign } from "@expo/vector-icons";
import { get } from "lodash";

export default function InventoryCard({ inventory, establishment, order, onSetOrder }) {
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
          <Button onPress={() => setOrderSize((prev) => prev !== inventory.quantity ? prev + 1 : prev)} isDisabled={inventory.quantity === 0 || orderSize === inventory.quantity}><Text>+</Text></Button>
          <Text>{orderSize}</Text>
          <Button onPress={() => setOrderSize((prev) => prev > 0 ? prev - 1 : 0 )} isDisabled={inventory.quantity === 0 || orderSize === 0}><Text>-</Text></Button>
          <Button onPress={onDoneGetOrderSize} isDisabled={inventory.quantity === 0}><Text>Done</Text></Button>
        </Box>
      </Box>
    );
  };

  return (
    <Pressable onPress={onPressInventoryCard} disabled={!get(establishment.settings, "deliveryEnabled", false)}>
      <Box
        sx={{
          height: 115,
          width: "100%",
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          bgColor: "pink",
        }}
      >
        <Box
          sx={{
            width: "75%",
            flexDirection: "column",
            marginLeft: 10,
          }}
        >

          <Text fontSize={20} fontWeight={"bold"} >{inventory.name} - Php {inventory.price}</Text>
          <Text fontSize={14} >{inventory.description}</Text>
          {inventory.quantity === 0 ? <Text style={{ color: "red" }}>Out of Stock</Text> : inventory.quantity <= 5 ? <Text style={{ color: "red" }}>{`Low stock: ${inventory.quantity} remaining.`}</Text> : null}
        </Box>
        {
          get(establishment.settings, "deliveryEnabled", false) && inventory.quantity !== 0
            ?
              <Box marginRight={15}>
                <AntDesign name="plus" size={20} />
              </Box>
            :
              null
        }
        
      </Box>
      {
        isPressed && inventory.quantity !== 0 && (
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