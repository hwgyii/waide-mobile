// import everything needed from the function

import { Fontisto } from "@expo/vector-icons";
import { Box, Button, ButtonText, Divider, Fab, FabIcon, Heading, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Pressable, SafeAreaView, ScrollView, Text, Textarea, TextareaInput, View } from "@gluestack-ui/themed";
import dayjs from "dayjs";
import { get, isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import * as api from "../../../utilities/api";

export default function OrderModal({ establishment, orders, selectedInventories, totalPrice, onClearOrders, setInventories }) {
  const { auth } = useSelector((state) => state.auth);
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");

  const handleCheckout = async (e) => {
    try {
      e.preventDefault();

      const response = await api.createDelivery({ body: {
        establishmentId: establishment._id,
        orders,
        selectedInventories,
        totalPrice,
        isCompleted: false,
        description: `For Delivery ${auth.fullName}: ${address}`,
        address,
      }});

      if (response.status === 200) {
        alert(response.data.message);
        setInventories(response.data.inventories);
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
                  <Text>{dayjs().add(8, "hours").format("MMM DD, YYYY")}</Text>
                </Box>
                <Box
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>For Delivery</Text>
                  <Text>{dayjs().add(8, "hours").format("hh:mm A")}</Text>
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
                <Text style={{ marginRight: 15, fontWeight: "bold" }}>{totalPrice}</Text>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Textarea>
                  <TextareaInput placeholder="Delivery Address" value={address} onChangeText={(value) => {setAddress(value)}} autoFocus={true} />
                </Textarea>
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
                <Button onPress={handleCheckout} action="primary" disabled={Object.keys(orders).length === 0 && isEmpty(address)}>
                  <ButtonText>Order</ButtonText>
                </Button>
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  )
};