import { Box, Button, ButtonText, Input, InputField, SafeAreaView, ScrollView, Text } from "@gluestack-ui/themed";
import { get, isEmpty, set } from "lodash";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

import * as api from "../../../utilities/api";
import InventoryCard from "../Establishments/InventoryCard";
import OrderingModal from "./OrderingModal";

// NOT YET IMPLEMENTED
// IF GUMAWA NG SOCKET SERVER, KAPAG CHINECKOUT YUNG TABLE, REMOVE ALL DITO TAPOS ALERT NA SUCCESSFULLY CHECKED OUT AND THANK YOU FOR ORDERING

export default function Ordering() {
  const [currentToken, setCurrentToken] = useState("");
  const [passcode, setPasscode] = useState("");
  const [table, setTable] = useState({});
  const [inventories, setInventories] = useState([]);

  const [orders, setOrders] = useState({});
  const [selectedInventories, setSelectedInventories] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
      if (Object.keys(orders).length === 0) return ;
      let total = 0;
      let count = 0;
      for (const key in orders) {
        if (Object.hasOwnProperty.call(orders, key)) {
          const order = orders[key];
          total += order.price * order.orderSize;
          count += order.orderSize;
        }
      }
      setTotalPrice(total);
      setSelectedInventories(count);
    }, [orders]);

    const onSetOrder = (order) => {
      setOrders((prev) => {
        if (order.orderSize === 0) {
          return (
            Object.keys(prev).reduce((acc, key) => {
              if (key !== order._id) {
                acc[key] = prev[key];
              }
              return acc;
            }, {})
          )
        }
        return {
          ...prev,
          [order._id]: order,
        }
      });
    };
  
    const onClearOrders = () => {
      setOrders({});
      setSelectedInventories(0);
      setTotalPrice(0);
    };

  const onAccessOrdering = async () => {
    try {
      const response = await api.accessOrdering({
        body: {
          currentToken,
          passcode
        }
      })

      if (response.status === 200) {
        setTable(response.data.table);
        setInventories(response.data.inventories);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.error(error);
    }
  };

  function QRCodeScanner() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back); // Default to the back camera
  
    useEffect(() => {
      const requestPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      };
  
      requestPermissions();
    }, []);
  
    const handleBarCodeScanned = async ({ type, data }) => {
      if (scanned) return;
      setScanned(true);
      const data1 = JSON.parse(data);
      try {
        const response = await api.accessOrdering({
          body: {
            currentToken: data1.currentToken,
            passcode: data1.passcode
          }
        })
  
        if (response.status === 200) {
          setTable(response.data.table);
          console.log(response.data.table);
          setInventories(response.data.inventories);
        }
      } catch (error) {
        setScanned(false);
        alert(error.response.data.message);
        console.error(error);
      }
    };
  
    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{
        flexDirection: 'column',
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: "black",
        width: "90%",
        height: 200,
      }}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          type={type}
          onBarCodeScanned={handleBarCodeScanned}
          barCodeScannerSettings={{
            interval: 10000,
          }}
          >
        </Camera>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            height: 75,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text fontSize={32} fontWeight={"bold"}>Ordering</Text>
          {
            !isEmpty(table) &&
            <OrderingModal table={table} establishment={table.establishment} orders={orders} selectedInventories={selectedInventories} totalPrice={totalPrice} onClearOrders={onClearOrders} setInventories={setInventories} setTable={setTable} />
          }
        </Box>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              height: 75,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {
              !isEmpty(table) &&
              <>
                <Box
                  sx={{
                    width: "100%",
                    marginLeft: 10,
                    justifyContent: "center",
                    height: 150,
                  }}
                >
                  <Text fontSize={24} fontWeight={"bold"} >{table.establishment.name}</Text>
                  <Box
                    sx={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text fontWeight="bold">{get(table, "name", "")}</Text>
                    <Text style={{ marginRight: 20, fontWeight: "bold" }}>Php {get(table, "totalPrice", 0).toFixed(2)}</Text>
                  </Box>
                </Box>
              </>
            }
          </Box>
          {
            isEmpty(table)
              ?
                <Box
                  sx={{
                    height: 500,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "black",
                    borderWidth: 1,
                    marginBottom: 300,
                  }}
                >
                  <Input placeholder="Table Access Code"
                    variant="outline"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    width={"75%"}
                  >
                    <InputField
                      type="text"
                      inputMode="text"
                      keyboardType="default"
                      placeholder="Table Access Code"
                      value={currentToken}
                      onChangeText={(value) => {setCurrentToken(value)}}
                    />
                  </Input>
                  <Input placeholder="Table Passcode"
                    variant="outline"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    width={"75%"}
                    marginTop={10}
                    marginBottom={20}
                  >
                    <InputField
                      type="text"
                      inputMode="numeric"
                      keyboardType="numeric"
                      placeholder="Table Passcode"
                      value={passcode}
                      onChangeText={(value) => {setPasscode(value)}}
                    />
                  </Input>
                  <Button disabled={currentToken.length === 0 || passcode.length === 0} onPress={() => onAccessOrdering()}>
                    <ButtonText>Submit</ButtonText>
                  </Button>
                  <Text marginTop={10} marginBottom={10}>Or</Text>
                  <Text marginTop={10} marginBottom={10}>Scan QR Code</Text>
                  <QRCodeScanner />
                </Box>
              :
                <ScrollView
                  style={{
                    height: 870,
                    width: "100%",
                    marginBottom: 525,
                  }}
                >
                  {
                    inventories.length > 0
                      ?
                        inventories.map((inventory, index) => (
                          <InventoryCard inventory={inventory} establishment={table.establishment} order={orders[inventory._id]} onSetOrder={onSetOrder} key={index}/>
                        ))
                      :
                        <Box
                          sx={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ marginTop: "50%" }}>No Inventories found.</Text>
                        </Box>
                }
                </ScrollView>
          }
        </Box>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}