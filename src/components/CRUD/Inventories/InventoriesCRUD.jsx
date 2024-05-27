import { Box, SafeAreaView, ScrollView, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryCRUDModal from "./InventoryCRUDModal";

import * as api from "../../../utilities/api";
import { isEmpty } from "lodash";
import { getInventories } from "../../../redux/reducers/inventory";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import InventoriesCRUDFab from "./InventoriesCRUDFab";

export default function InventoriesCRUD({}) {
  const dispatch = useDispatch();
  const { establishment } = useSelector((state) => state.auth);
  const { inventories } = useSelector((state) => state.inventories);

  const [isLoaded, setIsLoaded] = useState(false);

  const fetchInventories = async () => {
    try {
      const response = await api.getInventories();
      if (response.status === 200) {
        dispatch(getInventories(response.data.inventories));
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (isEmpty(inventories)) fetchInventories();
    else setIsLoaded(true);
  }, []);

  function InventoryCRUDHeader() {
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
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Inventory Settings</Text>
      </Box>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{
          height: "100%"
        }}
      >
        <InventoryCRUDHeader />
        <ScrollView
          style={{
            height: "calc(100% - 50px)",
          }}
        >
          {
            inventories.map((inventory, index) => {
              return (
                <InventoryCRUDModal key={index} inventory={inventory} index={index} />
              );
            })
          }
        </ScrollView>
        <InventoriesCRUDFab />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};