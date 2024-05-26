import { Box, Button, Divider, View } from "@gluestack-ui/themed";
import { Text, StyleSheet } from "react-native";

import { useState, useMemo, useCallback, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { isEmpty } from "lodash";
import dayjs from "dayjs";

export default function SalesBottomSheet({ selectedSales, onCheckoutOrder }) {
  const snapPoints = useMemo(() => ['15%', '90%'], []);
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

  useEffect(() => {
    if (isEmpty(selectedSales)) setIndex(0);
  }, [selectedSales]);
  const handleSheetChanges = useCallback((index) => {
    setIndex(index);
  }, []);

  function ExtendedBottomSheet() {
    return (
      <Box>
        <Box
          sx={{
            height: "82%",
            width: "100%",
          }}
        >
          {/* SWIPE DOWN TEXT */}
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
          {/* ORDER INFO HEADER */}
          <Box
            sx={{
              width: "100%",
              marginTop: 20,
            }}
          >
            <Box
              sx={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ marginLeft: 10 }}>Order ID: {isEmpty(selectedSales) ? "" : selectedSales._id.slice(-10)}</Text>
              <Text style={{ marginRight: 10 }}>{dayjs(selectedSales.createdAt).add(8, "hours").format("MMM D, YYYY")}</Text>
            </Box>
            <Box
              sx={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ marginLeft: 10 }}>{selectedSales.description ? selectedSales.description : null}</Text>
              <Text style={{ marginRight: 10, marginBottom: 10 }}>{dayjs(selectedSales.createdAt).add(8, "hours").format("hh:mm A")}</Text>
            </Box>
          </Box>
          <Divider bgColor="black" />
          {/* ORDER INFO BODY */}
          <Box
            sx={{
              height: "75%",
              width: "100%",
              marginTop: 15,
            }}
          >
            {
              !isEmpty(selectedSales.items) && selectedSales.items.map((item,index) => {
                return (
                  <Box key={index}
                    sx = {{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginLeft: 10 }}>{item.quantity}    {item.item.name}</Text>
                    <Text style={{ marginRight: 10 }}>{(Math.round(item.subtotal * 100) / 100).toFixed(2)}</Text>
                  </Box>
                )
              })
            }
          </Box>
          <Divider bgColor="black" />
        </Box>
        {/* CHECKOUT INFO AND BUTTON */}
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
            }}
          >
            <Text style={{ marginLeft: 10 }}>Order ID: {isEmpty(selectedSales) ? "" : selectedSales._id.slice(-10)}</Text>
            <Text style={{ marginRight: 10 }}>Total: {!isEmpty(selectedSales) ? (Math.round(selectedSales.totalPrice * 100) / 100).toFixed(2) : "0.00"}</Text>
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
              onPress={onCheckoutOrder}
              isDisabled={isEmpty(selectedSales)}
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
          index === 0
            ?
              <Box>
                <Box
                  sx={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>Order ID: {!isEmpty(selectedSales) ? selectedSales._id.slice(-10) : ""}</Text>
                  <Text style={{ marginRight: 10 }}>Total: {!isEmpty(selectedSales) ? (Math.round(selectedSales.totalPrice * 100) / 100).toFixed(2) : "0.00"}</Text>
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
                    isDisabled={isEmpty(selectedSales)}
                  >
                    <Text>Checkout Order</Text>
                  </Button>
                </Box>
              </Box>
            :
              <ExtendedBottomSheet />
        }
        <Box>
        </Box>
      </View>
    </BottomSheet>
  );
};