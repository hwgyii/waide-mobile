import { Box, CircleIcon, SafeAreaView, ScrollView, Spinner } from "@gluestack-ui/themed";
import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";

import * as api from "../utilities/api";
import dayjs from "dayjs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PieChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";

const colors = [
  "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00", "#00FF00", "#00FF66", "#00FFCC", "#00FFFF",
  "#00CCFF", "#0066FF", "#0000FF", "#6600FF", "#CC00FF", "#FF00FF", "#FF00CC", "#FF0099", "#FF0066", "#FF0033",
  "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00", "#00FF00", "#00FF66", "#00FFCC", "#00FFFF",
  "#00CCFF", "#0066FF", "#0000FF", "#6600FF", "#CC00FF", "#FF00FF", "#FF00CC", "#FF0099", "#FF0066", "#FF0033",
  "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00", "#00FF00", "#00FF66", "#00FFCC", "#00FFFF",
  "#00CCFF", "#0066FF", "#0000FF", "#6600FF", "#CC00FF", "#FF00FF", "#FF00CC", "#FF0099", "#FF0066", "#FF0033",
  "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00", "#00FF00", "#00FF66", "#00FFCC", "#00FFFF",
  "#00CCFF", "#0066FF", "#0000FF", "#6600FF", "#CC00FF", "#FF00FF", "#FF00CC", "#FF0099", "#FF0066", "#FF0033",
  "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00", "#00FF00", "#00FF66", "#00FFCC", "#00FFFF"
];


export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [sales, setSales] = useState([]);
  const [pieData, setPieData] = useState([{}]);
  const [updateTime, setUpdateTime] = useState(dayjs().format("MMMM DD, YYYY"));

  const getTodaysSales = async () => {
    try {
      const response = await api.getSalesToday();

      if (response.status === 200) {
        setSales(response.data.inventoryPercentage);
        setTotalSales(response.data.totalSales);
        setUpdateTime(response.data.updateTime);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(useCallback(() => {
    getTodaysSales();
  }, []));

  useEffect(() => {
    const pieData = [];
    if (sales.length === 0) {
      setPieData([{
        value: 100,
        color: colors[0],
      }]);
    } else {
      sales.forEach((sale, index) => {
        pieData.push({
          value: sale.percentage,
          color: colors[index],
          text: sale.name,
        });
      });
      setPieData(pieData);
    }
  }, [sales, setSales]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        sx={{
          width: "100%",
          height: "100%",
        }}
      >

        {
          isLoaded
            ?
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ fontSize: 32, fontWeight: "bold" }}>SALES BREAKDOWN</Text>
                </Box>
                <Box
                  sx ={{
                    width: "100%",
                    height: 250,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <PieChart
                    donut={true}
                    showText={true}
                    textColor={"black"}
                    radius={125}
                    textSize={10}
                    data={pieData}
                    innerRadius={75}
                    centerLabelComponent={() => {
                      return (
                        <Box
                          sx={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 16, fontWeight: "500" }}>{dayjs().format("MMMM DD, YYYY")}</Text>
                          <Text style={{ fontSize: 12, fontWeight: "500" }}>{dayjs().format("hh:mm A")}</Text>
                          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Php {totalSales.toFixed(2)}</Text>
                        </Box>
                      )
                    }}
                  />
                </Box>
                <Box>
                  <Box
                    sx={{
                      width: "80%",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Box width={"5%"}>
                      <CircleIcon color={colors[0]} />
                    </Box>
                    <Box width={"45%"}>
                      <Text style={{ fontSize: 20, marginLeft: 10 }}>Product</Text>
                    </Box>
                    <Box width={"30%"}>
                      <Text style={{ fontSize: 20, marginLeft: 10 }}>Quantity</Text>
                    </Box>
                    <Box width={"20%"} alignItems="center">
                    <Text style={{ fontSize: 20, marginLeft: 10 }}>%</Text>
                    </Box>
                  </Box>
                </Box>
                <ScrollView
                  style={{
                    height: "100%",
                    width: "80%",
                    marginBottom: 30,
                  }}
                >
                  {
                    sales.length > 0
                      ?
                        sales.map((sale, index) => {
                          return (
                            <Box
                              key={index}
                              sx={{
                                width: "100%",
                                justifyContent: "space-between",
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 5,
                              }}
                            >
                              <Box width={"5%"}>
                                <CircleIcon color={colors[index]} />
                              </Box>
                              <Box width={"45%"}>
                                <Text style={{ fontSize: 16, marginLeft: 10 }}>{sale.name}</Text>
                              </Box>
                              <Box width={"30%"} alignItems="center">
                                <Text style={{ fontSize: 16, marginLeft: 10 }}>{sale.quantity}</Text>
                              </Box>
                              <Box width={"20%"}>
                                <Text style={{ fontSize: 16, marginLeft: 10 }}>{(sale.percentage).toFixed(2)}%</Text>
                              </Box>
                            </Box>
                          )
                        })
                      :
                        <Box
                          sx={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          >
                          <Text style={{ fontSize: 20 }}>No sales today yet</Text>
                        </Box>
                  }
                </ScrollView>
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};