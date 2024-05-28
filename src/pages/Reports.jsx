import { Box, ChevronDownIcon, Icon, Pressable, SafeAreaView, Spinner, Text } from "@gluestack-ui/themed";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, Heading, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, ScrollView, SelectItem, Button, ButtonText } from "@gluestack-ui/themed";
import { useEffect, useRef, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { isEmpty } from "lodash";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";



const dataToSelect = [
  {
    label: "Sales",
    value: "sales",
  },
  {
    label: "Inventories",
    value: "inventory",
  }
];

const dataToSelectLabel = {
  "sales": "Sales",
  "inventory": "Inventories",
}

export default function Reports() {
  const { establishment } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [dataToReport, setDataToReport] = useState("sales");
  
  const [isGenerateButtonDisabled, setIsGenerateButtonDisabled] = useState(true);

  useEffect(() => {
    if (dataToReport === "sales") {
      setIsGenerateButtonDisabled(isEmpty(fromDate.toString()) || isEmpty(toDate.toString()) || isEmpty(dataToReport))
    } else if (dataToReport === "invoices" || dataToReport === "inventory") {
      setIsGenerateButtonDisabled(false)
    }
  }, [dataToReport, fromDate, toDate]);

  const downloadSalesReport = async () => {
    try {
      const url = `http://192.168.1.8:3000/reports/establishment/sales/?establishmentId=${establishment._id}&from=${dayjs(fromDate).format("YYYY-MM-DD")}&to=${dayjs(toDate).format("YYYY-MM-DD")}`;

      const fileName = `${establishment.name.replace(/[^a-zA-Z0-9]/g, '_')}_Sales_Report_${dayjs(fromDate).format("YYYY-MM-DD")}_${dayjs(toDate).format("YYYY-MM-DD")}.pdf`;
      
      const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName);

      // shareAsync(result.uri);

      const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permission.granted) {
        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, fileName, result.headers["Content-Type"])
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        });
      }

    } catch (error) {
      console.error("Error during download or save:", error);
    }
  };

  const downloadInventoryReport = async () => {
    try {
      const url = `http://192.168.1.8:3000/reports/establishment/inventory?establishmentId=${establishment._id}`;

      const fileName = `${establishment.name.replace(/[^a-zA-Z0-9]/g, '_')}_Inventory_Report_${dayjs().format("YYYY-MM-DD")}}.pdf`;
      
      const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName);

      // shareAsync(result.uri);

      const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permission.granted) {
        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, fileName, result.headers["Content-Type"])
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        });
      }

    } catch (error) {
      console.error("Error during download or save:", error);
    }
  };

  const onGenerateReport = async () => {
    if (dataToReport === "sales") {
      await downloadSalesReport();
    } else if (dataToReport === "inventory") {
      await downloadInventoryReport();
    }
  };

  function ReportsHeader() {
    return (
      <Box
        sx={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box width={"70%"}>
          <Text style={{ fontSize: 32, fontWeight: "bold", left: "50%" }}>Reports</Text>
        </Box>
      </Box>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <ReportsHeader />
        <ScrollView>
          <Box
            sx={{
              flexDirection: "column",
              marginLeft: 15,
              marginTop: 15,
            }}
          >
            <Box
              sx={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text marginRight={15}>Data to Report:</Text>
              <Select
                sx={{
                  width: "50%",
                }}
                onValueChange={value => setDataToReport(value)}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select Data"/>
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
                        dataToSelect.map((data, index) => {
                          return (
                            <SelectItem key={index} label={data.label} value={data.value} />
                          )
                        })
                      }                        
                    </ScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
            {
              dataToReport === "sales" && (
                <>
                  <Box
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Button onPress={() => setShowFromDatePicker(true)}>
                      <Text color="white">From:</Text>
                    </Button>
                    <DateTimePicker
                      date={fromDate ? fromDate : dayjs().toDate()}
                      minimumDate={dayjs(establishment.createdAt).toDate()}
                      maximumDate={dayjs().toDate()}
                      isVisible={showFromDatePicker}
                      onConfirm={(date) => {
                        setShowFromDatePicker(false);
                        setFromDate(date);
                      }}
                      onCancel={() => setShowFromDatePicker(false)}
                    />
                    <Text marginLeft={10}>{dayjs(fromDate).isValid() ? dayjs(fromDate).format("MMM DD, YYYY") : ""}</Text>
                  </Box>
                  <Box
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Button onPress={() => setShowToDatePicker(true)}>
                      <Text color="white">To:</Text>
                    </Button>
                    <DateTimePicker
                      date={toDate ? dayjs(toDate).isBefore(fromDate) ? dayjs().toDate() : toDate  : dayjs().toDate()}
                      minimumDate={fromDate ? dayjs(fromDate).toDate() : dayjs(establishment.createdAt).toDate()}
                      maximumDate={dayjs().toDate()}
                      isVisible={showToDatePicker}
                      onConfirm={(date) => {
                        setShowToDatePicker(false);
                        setToDate(date);
                      }}
                      onCancel={() => setShowToDatePicker(false)}
                    />
                    <Text marginLeft={10}>{dayjs(toDate).isValid() ? dayjs(toDate).format("MMM DD, YYYY") : ""}</Text>
                  </Box>
                </>
              )
            }
            <Box
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 40,
              }}
            >
              <Button width={"50%"} isDisabled={isGenerateButtonDisabled}>
                <ButtonText color="white" fontSize={20} fontWeight="bold" onPress={onGenerateReport}>Generate Report</ButtonText>
              </Button>
            </Box>
            
          </Box>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};