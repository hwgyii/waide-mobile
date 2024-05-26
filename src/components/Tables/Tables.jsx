import { useCallback, useState } from "react";
import { Box, Input, ScrollView, Spinner, } from "@gluestack-ui/themed";
import { Text, SafeAreaView, Dimensions, TextInput, } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import TableBottomSheet from "./TableBottomSheet";
import TablesCard from "./TableCard";

import * as api from "../../utilities/api";
import { isEmpty, } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { getTables, updateTables } from "../../redux/reducers/table";
import { useFocusEffect } from "@react-navigation/native";

export default function Tables() {
  const [isLoaded, setIsLoaded] = useState(false);

  const dispatch = useDispatch();
  const { tables } = useSelector((state) => state.tables);
  const [selectedTable, setSelectedTable] = useState({});

  const fetchTables = async () => {
    try {
      const response = await api.getEstablishmentTables();
      if(response.status === 200) {
        dispatch(getTables(response.data.tables));
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchTables();
  }, []));

  function TablesHeader() {
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
        <Text style={{ fontSize: 32, fontWeight:"bold" }}>Tables</Text>
      </Box>
    );
  };

  const onPressTablesCard = (event, tableToSelect) => {
    event.preventDefault();
    setSelectedTable((prev) => {
      if (prev._id === tableToSelect._id) return {};
      return tableToSelect;
    });
  };

  return (
      <GestureHandlerRootView>
        <SafeAreaView
          style={{
            height: "100%"
          }}
        >
          <TablesHeader />
          <ScrollView
            style={{
              height: "calc(100% - 50px)",
              marginBottom: Dimensions.get("window").height * 0.20 - 50, //CHANGE 0.15 to the initial height of the bottom sheet
            }}
          >
            {
              isLoaded ? //IF TABLES ARE LOADED
                tables.length !== 0 ? // IF TABLES ARE LOADED AND NOT EMPTY
                  tables.map((table, index) => (
                    <TablesCard key={table._id} table={table} index={index} onPressTablesCard={onPressTablesCard}/>
                  ))
                    
                : //ELSE RENDER NO TABLES FOUND TEXT
                  <Box
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginTop: "50%" }}>No Tables found.</Text>
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
          <TableBottomSheet selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
        </SafeAreaView>
      </GestureHandlerRootView>
  );
};