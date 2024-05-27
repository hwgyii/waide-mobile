import { Box, SafeAreaView, ScrollView, Text } from "@gluestack-ui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import TablesCRUDModal from "./TablesCRUDModal";
import { useEffect, useState } from "react";

import * as api from "../../../utilities/api";
import { getTables } from "../../../redux/reducers/table";
import TablesCRUDFab from "./TablesCRUDFab";

function TablesCRUDHeader() {
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
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Tables Settings</Text>
    </Box>
  );
};

export default function TablesCRUD() {
  const dispatch = useDispatch();
  const { tables } = useSelector((state) => state.tables);
  const [isLodaed, setIsLoaded] = useState(false);

  const [indexToEdit, setIndexToEdit] = useState(-1);

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

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <TablesCRUDHeader />
        <ScrollView
          sx={{
            height: "calc(100% - 50px)",
            width: "100%",
          }}
        >
          {
            tables.map((table, index) => (
              <TablesCRUDModal table={table} index={index} key={table._id} shouldEdit={index === indexToEdit} setIndexToEdit={setIndexToEdit} />
            ))
          }
        </ScrollView>
        <TablesCRUDFab />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};