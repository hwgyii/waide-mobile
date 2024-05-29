// import everything needed from the function

import { Box, Divider, Heading, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Pressable, SafeAreaView, ScrollView, Text, View } from "@gluestack-ui/themed";
import dayjs from "dayjs";
import { get } from "lodash";
import { useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ReceiptsModal({ receipt, index }) {
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(false);
  return (
    <GestureHandlerRootView>
      <Box>
        <Pressable onPress={() => setShowModal(true)}>
          <Box
            sx={{
              width: "100%",
              justifyContent: "center",
              marginBottom: 10,
              bgColor: "pink",
            }}
          >
            <Box
              sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <Box
                sx={{
                  width: "60%",
                }}
              >
                <Text fontSize={20} fontWeight={"bold"}>{receipt.establishment.name}</Text>
              </Box>
              <Text fontSize={20} fontWeight={"bold"} mr={10}>Php {receipt.sales.totalPrice.toFixed(2)}</Text>
            </Box>
            <Box
              sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  marginTop: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                }}
              >
                <Text fontSize={12}>Ordered on: {dayjs(receipt.createdAt).format("ddd, MMM DD, YYYY hh:mm A")}</Text>
                <Text fontSize={12}>Order ID: {receipt.sales._id.slice(10)}</Text>
              </Box>
              <Text fontSize={16} fontWeight="bold" marginRight={10}>{receipt.sales.isCompleted ? "Delivered" : "Preparing"}</Text>
            </Box>
          </Box>
        </Pressable>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} finalFocusRef={ref} sx={{ height: "100%"}}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size='lg'>Receipt Details</Heading>
              <ModalCloseButton><Text underline={true} color="red">Close</Text></ModalCloseButton>
            </ModalHeader>
            <ModalBody
              sx={{
                height: "75%",
              }}
            >
              <ScrollView
                sx={{
                  height: "10%",
                  width: "100%",
                }}
              >
                <Text>{receipt.establishment.name}</Text>
                <Text>Receipt ID: {receipt.sales._id.slice(10)}</Text>
                <Text>{dayjs(receipt.sales.createdAt).format("MMM DD, YYYY hh:mm A")}</Text>
                <Divider bgColor="black" marginTop={10}/>
                {
                  get(receipt.sales, "items", []).map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: index === 0 ? 10 : 0,
                      }}
                    >
                      <Box
                        width={"50%"}
                      >
                        <Text style={{ marginLeft: 10 }}>{item.quantity} - {item.item.name}</Text>
                      </Box>
                      <Text style={{ marginLeft: 10 }}>{item.subtotal.toFixed(2)}</Text>
                    </Box>
                  ))
                }
                <Divider bgColor="black" marginTop={10}/>
                <Box
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ marginLeft: 10, fontSize: 24, fontWeight: "bold" }}>Total:</Text>
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>{receipt.sales.totalPrice.toFixed(2)}</Text>
                </Box>
              </ScrollView>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </GestureHandlerRootView>
  )
};