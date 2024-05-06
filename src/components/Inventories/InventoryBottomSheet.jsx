import { Box, Button, View } from "@gluestack-ui/themed";
import { Text, StyleSheet } from "react-native";

import { useState, useMemo, useCallback, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import InventoryCheckout from "./InventoryCheckout";

export default function InventoryBottomSheet({ orders, selectedInventories, totalPrice, onClearOrders }) {
  const snapPoints = useMemo(() => ['15%', '95%'], []);
  const [index, setIndex] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (checkingOut) {
      setIndex(1);
    }
  }, [checkingOut]);

  useEffect(() => {
    if (index === 0) setCheckingOut(false);
  }, [index]);

  const handleSheetChanges = useCallback((index) => {
    setIndex(index);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
      height: "100%",
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

  const onClearBottomSheet = () => {
    onClearOrders();
    setIndex(0);
    setCheckingOut(false);
  };

  function ExtendedBottomSheet() {
    return (
      <Box>
        <Box
          sx={{
            height: "82.5%",
            width: "100%",
          }}
        >
          {
            Object.keys(orders).map((key, index) => {
              const order = orders[key];
              return (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15,
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
                width: "50%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F00B51",
                borderRadius: 24,
                marginTop: 7
              }}
              onPress={() => setCheckingOut(true)}
              isDisabled={selectedInventories === 0}
            >
              <Text>Checkout</Text>
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
  
  return (
    <BottomSheet index={index} snapPoints={snapPoints} onChange={handleSheetChanges}>
      <View>
        {
          !checkingOut
            ?
              index === 0
                ?
                  <Box>
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
                          width: "50%",
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#F00B51",
                          borderRadius: 24,
                        }}
                        onPress={() => setCheckingOut(true)}
                        isDisabled={selectedInventories === 0}
                      >
                        <Text>Checkout</Text>
                      </Button>
                    </Box>
                  </Box>
                :
                  <ExtendedBottomSheet />
            :
              <InventoryCheckout orders={orders} selectedInventories={selectedInventories} totalPrice={totalPrice} onClearBottomSheet={onClearBottomSheet} />
        }
        <Box>
        </Box>
      </View>
    </BottomSheet>
  );
};