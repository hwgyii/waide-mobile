import { useCallback, useState } from "react";
import { Box, Input, ScrollView, Spinner, } from "@gluestack-ui/themed";
import { Text, SafeAreaView, Dimensions, TextInput, } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import SalesBottomSheet from "./SalesBottomSheet";
import SalesCard from "./SalesCard";

import * as api from "../../utilities/api";
import { isEmpty, } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { getSales, updateSales } from "../../redux/reducers/sales";
import { useFocusEffect } from "@react-navigation/native";

export default function Orders() {
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.sales);

  const [selectedSales, setSelectedSales] = useState({});

  const fetchOrders = async () => {
    try {
      const response = await api.getIncompleteOrders();
      if (response.status === 200) {
        dispatch(getSales(response.data.sales));
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchOrders();
  }, []));

  function SalesHeader() {
    return (
      <Box
        sx={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 32 }}>Orders</Text>
      </Box>
    );
  };

  const onPressSalesCard = (event, salesToSelect) => {
    event.preventDefault();
    setSelectedSales((prev) => {
      if (prev._id === salesToSelect._id) return {};
      return salesToSelect;
    });
  };

  const onCheckoutOrder = async (event) => {
    try {
      event.preventDefault();
      const response = await api.onCompleteOrder({ salesId: selectedSales._id });
      if (response.status === 200) {
        alert("Order checked out successfully.");
        dispatch(updateSales(sales.filter((sale) => sale._id !== selectedSales._id)));
        setSelectedSales({});

      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <GestureHandlerRootView>
        <SafeAreaView
          style={{
            height: "100%"
          }}
        >
          <SalesHeader />
          <ScrollView
            style={{
              height: "calc(100% - 50px)",
              marginBottom: Dimensions.get("window").height * 0.20 - 50, //CHANGE 0.15 to the initial height of the bottom sheet
            }}
          >
            {
              isLoaded ? //IF INVENTORIES ARE LOADED
                sales.length !== 0 ? // IF INVENTORIES ARE LOADED AND NOT EMPTY
                  sales.map((sales, index) => (
                    <SalesCard key={sales._id} sales={sales} index={index} onPressSalesCard={onPressSalesCard}/>
                  ))
                    
                : //ELSE RENDER NO INVENTORIES FOUND TEXT
                  <Box
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginTop: "50%" }}>No Orders found.</Text>
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
          <SalesBottomSheet selectedSales={selectedSales} onCheckoutOrder={onCheckoutOrder} />
        </SafeAreaView>
      </GestureHandlerRootView>
  );
};