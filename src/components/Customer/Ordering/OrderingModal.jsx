// import everything needed from the function

import { Fontisto } from "@expo/vector-icons";
import { Box, Button, ButtonText, Divider, Fab, FabIcon, Heading, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Pressable, SafeAreaView, ScrollView, Text, Textarea, TextareaInput, View } from "@gluestack-ui/themed";
import dayjs from "dayjs";
import { get, isEmpty, set } from "lodash";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import * as api from "../../../utilities/api";

export default function OrderingModal({ table, establishment, orders, selectedInventories, totalPrice, onClearOrders, setInventories, setTable }) {
  const { auth } = useSelector((state) => state.auth);
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");

  const handleCheckout = async (e) => {
    try {
      e.preventDefault();
      const response = await api.checkoutOrder({ body: {
        establishmentId: establishment._id,
        orders,
        selectedInventories,
        totalPrice,
        isCompleted: false,
        description: `${table.name}`,
        table: table._id,
      }});

      if (response.status === 200) {
        alert(response.data.message);
        setInventories(response.data.inventories);
        setTable(response.data.table);
        setShowModal(false);
        onClearOrders();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      };
    }
  };

  return (
      <>
      <Fab
        size={"lg"}
        placement={"top right"}
        onPress={() => setShowModal(true)}
      >
        <Fontisto name="shopping-basket-add" size={24} color="black" />
      </Fab>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} finalFocusRef={ref} sx={{ height: "100%"}}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size='lg'>Order Details</Heading>
              <ModalCloseButton><Text underline={true} color="red">Close</Text></ModalCloseButton>
            </ModalHeader>
            <ModalBody
            >
              <Box
                sx={{
                  flexDirection: "column",
                  marginBottom: 10,
                }}
              >
                <Box
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>{establishment.name}</Text>
                  <Text>{dayjs().format("MMM DD, YYYY")}</Text>
                </Box>
                <Box
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>{table.name}</Text>
                  <Text>{dayjs().format("hh:mm A")}</Text>
                </Box>
              </Box>
              <Divider bgColor="black" />
              <ScrollView
                style={{
                  height: 200,
                  width: "100%",
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >

                {
                  Object.keys(orders).map((key, index) => {
                    const order = orders[key];
                    return (
                      <Box key={index}
                        sx={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ marginLeft: 10 }}>{order.orderSize}   -   {order.name}</Text>
                        <Text style={{ marginRight: 10 }}>{(Math.round(order.price * order.orderSize * 100) / 100).toFixed(2)}</Text>
                      </Box>
                    );
                  })
                }
              </ScrollView>
              <Divider bgColor="black" />
              <Box
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ marginLeft: 15 }}>Total</Text>
                <Text style={{ marginRight: 15, fontWeight: "bold" }}>{totalPrice.toFixed(2)}</Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Box
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button onPress={() => {onClearOrders(); setAddress(""); setShowModal(false);}} action="negative" marginRight={25}>
                  <ButtonText>Clear</ButtonText>
                </Button>
                <Button onPress={(e) => handleCheckout(e)} action="primary" disabled={Object.keys(orders).length === 0 && isEmpty(address)}>
                  <ButtonText>Order</ButtonText>
                </Button>
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  )
};