import { Box, SafeAreaView, ScrollView, Spinner, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { getReceipts } from "../../../redux/reducers/sales";

import * as api from "../../../utilities/api";
import { isEmpty } from "lodash";
import ReceiptsModal from "./ReceiptsModal";

export default function Receipts() {
  const dispatch = useDispatch();
  const { establishment } = useSelector((state) => state.auth);
  const { receipts } = useSelector((state) => state.sales);

  const [isLoaded, setIsLoaded] = useState(false);

  function ReceiptsHeader() {
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
        {/* 
          NOT YET IMPLEMENTED
            - ADD A FILTER MODAL HERE
            - DATE RANGE FILTER
        */}
        <Text style={{ fontSize: 32 }}>Receipts</Text>
      </Box>
    );
  };

  const fetchOrders = async () => {
    try {
      const response = await api.getAllEstablishmentOrders();
      if (response.status === 200) {
        dispatch(getReceipts(response.data.sales));
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <ReceiptsHeader />
        <Box
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* 
            NOT YET IMPLEMENTED
              - CHANGE BETTER BACKGROUND COLOR
          */}
          <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: "bold" }}>Receipt ID</Text>
          <Text style={{ marginRight: 15, fontSize: 20, fontWeight: "bold" }}>Total</Text>
        </Box>
        <ScrollView
          style={{
            height: "calc(100% - 200px)"
          }}
        >
          {
              isLoaded ? //IF INVENTORIES ARE LOADED
                receipts.length !== 0 ? // IF INVENTORIES ARE LOADED AND NOT EMPTY
                  receipts.map((receipt, index) => (
                    <ReceiptsModal key={index} receipt={receipt} index={index} />
                  ))
                    
                : //ELSE RENDER NO INVENTORIES FOUND TEXT
                  <Box
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginTop: "50%" }}>No Recipts found.</Text>
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
        <Box
          sx={{
            height: 50,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* 
            NOT YET IMPLEMENTED
              - CHANGE BETTER BACKGROUND COLOR
          */}
          <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>No. of Receipts: {receipts.length}</Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 15 }}>Total Sales: {receipts.reduce((acc, curr) => acc + curr.totalPrice, 0)}</Text>
        </Box>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}