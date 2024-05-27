import { Box, ChevronDownIcon, Icon, ScrollView, Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "@gluestack-ui/themed";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import * as api from "../utilities/api";

export default function TaxCalculator() {
  const { establishment } = useSelector((state) => state.auth);
  const [yearsAvailable, setYearsAvailable] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().get("year").toString());
  const [selectedQuarter, setSelectedQuarter] = useState((Math.ceil((dayjs().get("month") + 1) / 3)).toString());
  const [totalSales, setTotalSales] = useState(0);

  const quarters = [
    { label: "1st Quarter", value: "1" },
    { label: "2nd Quarter", value: "2" },
    { label: "3rd Quarter", value: "3" },
    { label: "4th Quarter", value: "4" },
  ]
  const quartersLabel = {
    "1": "1st Quarter",
    "2": "2nd Quarter",
    "3": "3rd Quarter",
    "4": "4th Quarter",
  };

  useEffect(() => {
    const years = [];
    for (let i = dayjs(establishment.createdAt).get("year"); i <= dayjs().get("year"); i++) {
      years.push(i);
    }
    years.sort((a, b) => b - a);
    setYearsAvailable(years);
  }, []);

  useEffect(() => {
    async function getGrossSales() {
      try {
        const response = await api.getGrossSales({ selectedYear, selectedQuarter });
        if (response.status === 200) {
          setTotalSales(response.data.totalSales);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getGrossSales();
  }, [selectedYear, selectedQuarter]);

  const getDeadline = () => {
    let deadline = "";
    if (selectedQuarter === "1") {
      deadline = `April 25, ${selectedYear}`;
    } else if (selectedQuarter === "2") {
      deadline = `July 25, ${selectedYear}`;
    } else if (selectedQuarter === "3") {
      deadline = `October 25, ${selectedYear}`;
    } else if (selectedQuarter === "4") {
      deadline = `January 25, ${parseInt(selectedYear) + 1}`;
    }
    return deadline;
  };

  function TaxCalculatorHeader() {
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
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Business Tax Calculator</Text>
      </Box>
    );
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <TaxCalculatorHeader />
        <Box
          sx={{
            width: "90%",
            marginLeft: 15,
            bottom: 0,
            position: "absolute",
          }}
        >
          <Text fontSize={16} textAlign="justify" fontWeight="bold">{`Fill up BIR Form 2551Q and file your tax on or before ${getDeadline()}. Filing late will have additional payments.`}</Text>
          <Text fontSize={14} textAlign="justify" fontWeight="bold" marginTop={10}>*Note that this Business Tax Calculator is only for businesses that is registered as non-VAT and has an annual gross sales of less than 3,000,000.00 Php.</Text>
          <Text fontSize={14} textAlign="justify" fontWeight="bold" marginTop={10}>**Businesses that does not under the conditions above is not eligible for this tax calculator.</Text>
        </Box>
        <Box
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 50,
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", marginLeft: 15 }}>For:</Text>
          <Select
            sx={{
              width: "45%",
              marginRight: 15,
            }}
            onValueChange={(value) => setSelectedQuarter(value)}
          >
            <SelectTrigger>
              <SelectInput placeholder="Select Year" value={quarters[selectedQuarter - 1].label} />
              <SelectIcon mr={3}>
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <ScrollView
                  style={{
                    width: "100%",
                  }}
                >
                  {
                    quarters.map((quarter, index) => {
                      return (
                        <SelectItem key={index} label={quarter.label} value={quarter.value} />
                      )
                    })
                  }
                </ScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
          <Select
            sx={{
              width: "30%",
              marginRight: 15,
            }}
            onValueChange={(value) => setSelectedYear(value)}
          >
            <SelectTrigger>
              <SelectInput placeholder="Select Year" value={selectedYear} />
              <SelectIcon mr={3}>
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <ScrollView
                  style={{
                    width: "100%",
                  }}
                >
                  {
                    yearsAvailable.map((year, index) => {
                      return (
                        <SelectItem key={index} label={`${year}`} value={`${year}`} />
                      )
                    })
                  }
                </ScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
        </Box>
        <Box
          sx={{
            width: "90%",
            height: "85%",
            marginLeft: 15,
            marginRight: 15,
            alignItems: "center",
          }}
        >
          <Text textAlign="justify" fontSize={20}>{`${establishment.name}'s Gross Sales:`}</Text>
          <Text fontSize={16}>{`for ${quartersLabel[selectedQuarter]} of year ${selectedYear}`}</Text>
          <Text fontSize={24} fontWeight="bold">Php {totalSales}</Text>
          <Text fontSize={20} marginTop={15}>{`Total Tax Due (Gross Sales * 0.03):`}</Text>
          <Text fontSize={24} fontWeight="bold">Php {(totalSales * 0.03).toFixed(2)}</Text>
          <Text fontSize={16} fontWeight="bold" marginTop={15} color="red">{`Deadline on or before: ${getDeadline()}`}</Text>
        </Box>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
};