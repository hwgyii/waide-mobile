import { Box, Pressable, SafeAreaView, ScrollView, Spinner, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as api from "../../../utilities/api";
import dayjs from "dayjs";
import ReceiptsModal from "./ReceiptsModal";

export default function CustomerReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchDelivieries = async () => {
      try {
        const response = await api.getCustomerDeliveries();
        if (response.status === 200) {
          setReceipts(response.data.deliveries);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDelivieries();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Box
            sx={{
              height: 75,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text fontSize={32} fontWeight={"bold"}>Receipts</Text>
          </Box>
        <ScrollView
          style={{
            marginBottom: 175,
          }}
        >
            {
              isLoaded
                ?
                  receipts.length > 0
                    ?
                      receipts.map((receipt, index) => {
                        return (
                          <ReceiptsModal key={index} receipt={receipt} index={index} />
                        );
                      })
                    :
                      <Box
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ marginTop: "50%" }}>No Receipts found.</Text>
                      </Box>
                :
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}