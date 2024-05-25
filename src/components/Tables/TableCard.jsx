import { useState } from "react";
import { Box, Button, Pressable, } from "@gluestack-ui/themed";
import { Text, } from "react-native";
import dayjs from "dayjs";

const AVAILABILITY = {
  0: "Available",
  1: "Occupied",
  2: "Reserved",
};

export default function TablesCard({ table, index, onPressTablesCard }) {
  return (
    <Pressable onPress={(e) => {onPressTablesCard(e, table)}}>
      <Box
        sx={{
          height: 100,
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          bgColor: index % 2 === 0 ? "#FDA5A5" : "#D9D9D9",
        }}
      >
        <Box
          sx={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
            marginTop: 5,
          }}
        >
          <Text style={{ marginLeft: 10 }}>{table.name}</Text>
          <Text style={{ marginRight: 10 }}>{AVAILABILITY[table.availability]}</Text>
        </Box>
        {
          table.availability === 1 && (
            <Box
              sx={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
                marginTop: 5,
              }}
            >
              <Text style={{ marginLeft: 10 }}>Access Code: {table.currentToken}</Text>
              <Text style={{ marginRight: 10 }}>Passcode: {table.passcode}</Text>
            </Box>
          )
        }
      </Box>
    </Pressable>
  );
};