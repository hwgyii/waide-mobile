import { Box, Divider, Text, VStack, Button } from "@gluestack-ui/themed";

import * as api from "../../utilities/api";

import { useDispatch } from "react-redux";
import { updateInventories } from "../../redux/reducers/inventory";

export default function InventoryCheckout({ orders, selectedInventories, totalPrice, onClearBottomSheet }) {
  const dispatch = useDispatch();
  const handleCheckout = async (e, isCompleted) => {
    try {
      e.preventDefault();

      const response = await api.checkoutOrder({ body: {
        orders,
        selectedInventories,
        totalPrice,
        isCompleted
      }});

      if (response.status === 200) {
        onClearBottomSheet();
        dispatch(updateInventories(response.data.inventories));        
        alert(response.data.message);
        // NOT YET IMPLEMENTED
        // ADD SETTING BOTTOM SHEET INDEX TO 0 [DONE onClearBottomSheet]
        // ADD CLEARING ORDERS [DONE onClearBottomSheet -> onClearOrders]
        // ADD CLEARING SELECTED INVENTORIES [DONE onClearBottomSheet -> onClearOrders]
        // ADD CLEARING TOTAL PRICE [DONE onClearBottomSheet -> onClearOrders]
        // ADD SETTING CHECKING OUT TO FALSE [DONE onClearBottomSheet]
        // ADD REDUX DISPATCH TO UPDATE THE QUANTITY OF INVENTORIES [TO DO HERE]
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      };
    }
  };
  return(
    <VStack>
      <Box
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.5,
        }}
      >
        <Text>Swipe down to cancel checkout.</Text>
      </Box>
      {/* STORE INFO */}
      <Box
        sx={{
          height: "15%",
        }}
      >

      </Box>
      {/* ORDERS INFO */}
      <Divider bgColor="black" />
      <Box
        sx={{
          height: "64%"
        }}
      >
        {
          Object.keys(orders).map((key, index) => {
            const order = orders[key];
            return (
              <Box key={index}
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginLeft: 10 }}>{order.orderSize}</Text>
                <Text>{order.name}</Text>
                <Text style={{ marginRight: 10 }}>{(Math.round(order.price * order.orderSize * 100) / 100).toFixed(2)}</Text>
              </Box>
            );
          })
        }
      </Box>
      <Divider bgColor="black" />
      <Box
          sx={{
            height: "20%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text style={{ marginLeft: 10 }}>{selectedInventories} selected</Text>
            <Text style={{ marginRight: 10 }}>Total: {(Math.round(totalPrice * 100) / 100).toFixed(2)}</Text>
          </Box>
          <Box
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                width: "40%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F00B51",
                borderRadius: 24,
                marginTop: 7,
                marginRight: "5%",
              }}
              onPress={(e) => {handleCheckout(e, false)}}
            >
              <Text color="black">Prepare</Text>
            </Button>
            <Button
              sx={{
                width: "40%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F00B51",
                borderRadius: 24,
                marginTop: 7
              }}
              onPress={(e) => {handleCheckout(e, true)}}
            >
              <Text color="black">Checkout</Text>
            </Button>
          </Box>
        </Box>
    </VStack>
  );
};