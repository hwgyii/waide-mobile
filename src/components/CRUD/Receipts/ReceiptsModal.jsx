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
              height: 75,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              bgColor: index % 2 === 0 ? "#FDA5A5" : "#D9D9D9",
            }}
          >
            <Box
              sx={{
                flexDirection: "row",
              }}
            >
              {/* Image */}
              <Box sx={{height: "90%", width: "90px", bgColor: "red"}} >

              </Box>
              {/* PRODUCT NAME */}
              <Box
                sx={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginLeft: 15 }}>{receipt._id.slice(-10)}</Text>
                <Text style={{ marginRight: 15 }}>{receipt.totalPrice.toFixed(2)}</Text>
              </Box>
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
                <Text>Receipt ID: {receipt._id.slice(10)}</Text>
                {receipt.description ? <Text>Description: {receipt.description}</Text> : null}
                <Text>{dayjs(receipt.createdAt).add(8, "hours").format("MMM DD, YYYY hh:mm A")}</Text>
                <Divider bgColor="black" marginTop={10}/>
                {
                  get(receipt, "items", []).map((item, index) => (
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
                  <Text style={{ fontSize: 24, fontWeight: "bold" }}>{receipt.totalPrice.toFixed(2)}</Text>
                </Box>
              </ScrollView>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </GestureHandlerRootView>
  )
};