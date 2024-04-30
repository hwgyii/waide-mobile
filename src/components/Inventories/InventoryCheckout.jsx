import { Box, Divider, Text, VStack, Button } from "@gluestack-ui/themed";

export default function InventoryCheckout({ orders, selectedInventories, totalPrice }) {
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
        <Text>Swip down to cancel checkout.</Text>
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
              onPress={() => {console.log("Preparing..")}}
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
              onPress={() => {console.log(orders)}}
            >
              <Text color="black">Checkout</Text>
            </Button>
          </Box>
        </Box>
    </VStack>
  );
};