import { Box, Button, Divider, View } from "@gluestack-ui/themed";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading, Text, ButtonText } from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { isEmpty, set } from "lodash";
import dayjs from "dayjs";

import * as api from "../../utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { updateTables } from "../../redux/reducers/table";
import QRCode from "react-native-qrcode-svg";

export default function SalesBottomSheet({ selectedTable, setSelectedTable }) {
  const { tables } = useSelector((state) => state.tables);
  const dispatch = useDispatch();

  const snapPoints = useMemo(() => ['20%', '90%'], []);
  const [index, setIndex] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (checkingOut) {
      setIndex(1);
    }
  }, [checkingOut]);

  useEffect(() => {
    if (index === 0) setCheckingOut(false);
  }, [index]);

  useEffect(() => {
    if (isEmpty(selectedTable)) setIndex(0);
  }, [selectedTable]);
  const handleSheetChanges = useCallback((index) => {
    setIndex(index);
  }, []);

  const changeTableAvailability = async (event, availability) => {
    try {
      event.preventDefault();
      const response = await api.updateTableAvailability({
        tableId: selectedTable._id,
        body: {
          availability: availability,
        }
      });

      if (response.status === 200) {
        dispatch(updateTables(tables.map((table) => {
          return table._id === response.data.table._id ? response.data.table : table;
        })));
        setSelectedTable(response.data.table);
        
        alert(`${selectedTable.name} is now ${availability === 0 ? "available" : availability === 1 ? "occupied" : "reserved"}.`);
        setIndex(0);
        if (response.data.table.availability === 1) {
        }
        // NOT YET IMPLEMENTED
        // KAPAG NAG-OCCUPY, ALERT YUNG LINK PARA MAKAPAG-ORDER ONLINE YUNG CUSTOMER OR YUNG QR CODE TO ORDER ONLINE
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onCheckoutTable = async (event) => {
    changeTableAvailability(event, 0);
    setIndex(0);
  };

  function QRCodeModal() {
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);

    return (
      <>
        <Button
          sx={{
            width: "40%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 24,
            marginRight: "5%",
          }}
          onPress={() => setShowModal(true)}
          isDisabled={isEmpty(selectedTable)}
        >
          <Text>SHOW QR CODE</Text>
        </Button>
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          finalFocusRef={ref}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size='lg'>{`${selectedTable.name}'s QR Code`}</Heading>
              <ModalCloseButton><Text underline={true} color="red">Close</Text></ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Box
                sx={{
                  height: 400,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCode
                  value={JSON.stringify({ currentToken: selectedTable.currentToken, passcode: selectedTable.passcode })}
                  size={200}
                  ecl="L"
                />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  };

  function ExtendedBottomSheet() {
    return (
      <Box>
        <Box
          sx={{
            height: "82%",
            width: "100%",
          }}
        >
          {/* SWIPE DOWN TEXT */}
          <Box
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <Text>Swipe down to cancel checkout.</Text>
          </Box>
          {/* ORDER INFO HEADER */}
          <Box
            sx={{
              width: "100%",
              marginTop: 20,
            }}
          >
            <Box
              sx={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ marginLeft: 10 }}>{!isEmpty(selectedTable) ? selectedTable.name : ""}</Text>
              <Text style={{ marginRight: 10 }}>{dayjs(selectedTable.sales?.updatedAt).format("MMM D, YYYY")}</Text>
            </Box>
            <Box
              sx={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ marginLeft: 10 }}>{selectedTable.description ? selectedTable.description : null}</Text>
              <Text style={{ marginRight: 10, marginBottom: 10 }}>{dayjs(selectedTable.sales?.updatedAt).format("hh:mm A")}</Text>
            </Box>
          </Box>
          <Divider bgColor="black" />
          {/* ORDER INFO BODY */}
          <Box
            sx={{
              height: "75%",
              width: "100%",
              marginTop: 15,
            }}
          >
            {
              !isEmpty(selectedTable.sales)
                ?
                  selectedTable.sales.map((sale) => {
                    return (
                      sale.items.map((item, index) => {
                        return (
                          <Box key={index}
                            sx = {{
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
                      })
                    )
                  })
                :
                  <Box
                    sx = {{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginLeft: 10 }}>No orders.</Text>
                  </Box>
              // !isEmpty(selectedTable.items) && selectedTable.items.map((item,index) => {
              //   return (
                  // <Box key={index}
                  //   sx = {{
                  //     width: "100%",
                  //     flexDirection: "row",
                  //     justifyContent: "space-between",
                  //     alignItems: "center",
                  //   }}
                  // >
              //       <Text style={{ marginLeft: 10 }}>{item.quantity}    {item.item.name}</Text>
              //       <Text style={{ marginRight: 10 }}>{(Math.round(item.subtotal * 100) / 100).toFixed(2)}</Text>
              //     </Box>
              //   )
              // })
            }
          </Box>
          <Divider bgColor="black" />
        </Box>
        {/* CHECKOUT INFO AND BUTTON */}
        <Box
          sx={{
            height: "20%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ marginLeft: 10 }}>{!isEmpty(selectedTable) ? selectedTable.name : ""}</Text>
            <Text style={{ marginRight: 10 }}>Total: {!isEmpty(selectedTable) ? (Math.round(selectedTable.totalPrice * 100) / 100).toFixed(2) : "0.00"}</Text>
          </Box>
          <Box
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {
              selectedTable.availability === 0 // IF TABLE IS AVAILABLE
              ?
                <Box
                  sx={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{
                      width: "40%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 24,
                      marginRight: "5%",
                    }}
                    onPress={(e) => changeTableAvailability(e, 1)}
                    isDisabled={isEmpty(selectedTable)}
                    action={"positive"}
                  >
                    <Text>Occupy</Text>
                  </Button>
                  <Button
                    sx={{
                      width: "40%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#F00B51",
                      borderRadius: 24,
                    }}
                    onPress={(e) => changeTableAvailability(e, 2)}
                    isDisabled={isEmpty(selectedTable)}
                  >
                    <Text>Reserve</Text>
                  </Button>
                </Box>
              :
                selectedTable.availability === 1 // IF TABLE IS OCCUPIED
                  ?
                    <Box
                      sx={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        sx={{
                          width: "50%",
                          height: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#F00B51",
                          borderRadius: 24,
                        }}
                        onPress={onCheckoutTable}
                        isDisabled={isEmpty(selectedTable)}
                      >
                        <Text>Checkout</Text>
                      </Button>
                    </Box>
                  :
                    selectedTable.availability === 2 // IF TABLE IS RESERVED
                      ?
                        <Box
                          sx={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            sx={{
                              width: "40%",
                              height: 50,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 24,
                              marginRight: "5%",
                            }}
                            onPress={(e) => changeTableAvailability(e, 1)}
                            isDisabled={isEmpty(selectedTable)}
                            action={"positive"}
                          >
                            <Text>Occupy</Text>
                          </Button>
                          <Button
                            sx={{
                              width: "40%",
                              height: 50,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#F00B51",
                              borderRadius: 24,
                            }}
                            onPress={(e) => changeTableAvailability(e, 0)}
                            isDisabled={isEmpty(selectedTable)}
                          >
                            <Text>Vacate</Text>
                          </Button>
                        </Box>
                      :
                        <Box
                          sx={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            sx={{
                              width: "40%",
                              height: 50,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 24,
                              marginRight: "5%",
                            }}
                            onPress={() => setCheckingOut(true)}
                            isDisabled={isEmpty(selectedTable)}
                            action={"positive"}
                          >
                            <Text>Occupy</Text>
                          </Button>
                          <Button
                            sx={{
                              width: "40%",
                              height: 50,
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#F00B51",
                              borderRadius: 24,
                            }}
                            onPress={() => setCheckingOut(true)}
                            isDisabled={isEmpty(selectedTable)}
                          >
                            <Text>Reserve</Text>
                          </Button>
                        </Box>
            }
            {/* <Button
              sx={{
                width: "50%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F00B51",
                borderRadius: 24,
                marginTop: 7
              }}
              onPress={onCheckoutOrder}
              isDisabled={isEmpty(selectedTable)}
            >
              <Text>Checkout</Text>
            </Button> */}
          </Box>
        </Box>
      </Box>
    );
  }
  
  return (
    <BottomSheet index={index} snapPoints={snapPoints} onChange={handleSheetChanges}>
      <View>
        {
          index === 0
            ?
              <Box>
                <Box
                  sx={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>{!isEmpty(selectedTable) ? selectedTable.name : "Table #"}</Text>
                  <Text style={{ marginRight: 10 }}>Total: {!isEmpty(selectedTable) ? (Math.round(selectedTable.totalPrice * 100) / 100).toFixed(2) : "0.00"}</Text>
                </Box>
                {
                  selectedTable.availability === 0 // IF TABLE IS AVAILABLE
                    ?
                      <Box
                        sx={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 20,
                        }}
                      >
                        <Button
                          sx={{
                            width: "40%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 24,
                            marginRight: "5%",
                          }}
                          onPress={(e) => changeTableAvailability(e, 1)}
                          isDisabled={isEmpty(selectedTable)}
                          action={"positive"}
                        >
                          <Text>Occupy</Text>
                        </Button>
                        <Button
                          sx={{
                            width: "40%",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#F00B51",
                            borderRadius: 24,
                          }}
                          onPress={(e) => changeTableAvailability(e, 2)}
                          isDisabled={isEmpty(selectedTable)}
                        >
                          <Text>Reserve</Text>
                        </Button>
                      </Box>
                    :
                      selectedTable.availability === 1 // IF TABLE IS OCCUPIED
                        ?
                          <Box
                            sx={{
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 20,
                            }}
                          >
                            <QRCodeModal />
                            <Button
                              sx={{
                                width: "40%",
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#F00B51",
                                borderRadius: 24,
                              }}
                              onPress={() => setCheckingOut(true)}
                              isDisabled={isEmpty(selectedTable)}
                            >
                              <Text>Checkout Table</Text>
                            </Button>
                          </Box>
                        :
                          selectedTable.availability === 2 // IF TABLE IS RESERVED
                            ?
                              <Box
                                sx={{
                                  width: "100%",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: 20,
                                }}
                              >
                                <Button
                                  sx={{
                                    width: "40%",
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 24,
                                    marginRight: "5%",
                                  }}
                                  onPress={(e) => changeTableAvailability(e, 1)}
                                  isDisabled={isEmpty(selectedTable)}
                                  action={"positive"}
                                >
                                  <Text>Occupy</Text>
                                </Button>
                                <Button
                                  sx={{
                                    width: "40%",
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#F00B51",
                                    borderRadius: 24,
                                  }}
                                  onPress={(e) => changeTableAvailability(e, 0)}
                                  isDisabled={isEmpty(selectedTable)}
                                >
                                  <Text>Vacate</Text>
                                </Button>
                              </Box>
                            :
                              <Box
                                sx={{
                                  width: "100%",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: 20,
                                }}
                              >
                                <Button
                                  sx={{
                                    width: "40%",
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 24,
                                    marginRight: "5%",
                                  }}
                                  onPress={() => setCheckingOut(true)}
                                  isDisabled={isEmpty(selectedTable)}
                                  action={"positive"}
                                >
                                  <Text>Occupy</Text>
                                </Button>
                                <Button
                                  sx={{
                                    width: "40%",
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#F00B51",
                                    borderRadius: 24,
                                  }}
                                  onPress={() => setCheckingOut(true)}
                                  isDisabled={isEmpty(selectedTable)}
                                >
                                  <Text>Reserve</Text>
                                </Button>
                              </Box>

                }
              </Box>
            :
              <ExtendedBottomSheet />
        }
        <Box>
        </Box>
      </View>
    </BottomSheet>
  );
};