import { useState } from "react";
import { Box, Button, Pressable, } from "@gluestack-ui/themed";
import { Text, } from "react-native";
import dayjs from "dayjs";

export default function SalesCard({ sales, index, onPressSalesCard }) {
  return (
    <Pressable onPress={(e) => {onPressSalesCard(e, sales)}}>
      <Box
        sx={{
          height: 175,
          width: "100%",
          flexDirection: "column",
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
          <Text style={{ marginLeft: 10 }}>Order ID: {sales._id.slice(-10)}</Text>
          <Text style={{ marginRight: 10 }}>{dayjs(sales.createdAt).add(8, "hours").format("MMM D, YYYY hh:mm A")}</Text>
        </Box>
        <Box
          sx={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            marginTop: 5,
          }}
        >
          <Box
            sx={{
              width: "50%",
            }}
          >
            <Text style={{ marginLeft: 10 }}>{sales.description ? sales.description : null}</Text>
          </Box>
          <Text style={{ marginRight: 10 }}>Preparing</Text>
        </Box>
        <Box>
          {
            sales.items.map((item, index) => {
              if (index < 2) {
                return (
                  <Box key={index}
                    sx={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginLeft: 10 }}>{item.quantity}    {item.item.name}</Text>
                    <Text style={{ marginRight: 10 }}>{(Math.round(item.subtotal * 100) / 100).toFixed(2)}</Text>
                  </Box>
                );
              }
            })
          }
          {
            sales.items.length > 2 ? 
              <Box
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginLeft: 10 }}>... and others</Text>
              </Box> : null
          }
        </Box>
      </Box>
    </Pressable>
  );
};