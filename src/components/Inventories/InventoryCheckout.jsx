import { Box, Divider, Text, VStack, Button, Center, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading, ButtonText, } from "@gluestack-ui/themed";
import { useState, useRef } from "react";
import { isEmpty, get } from "lodash";

import * as api from "../../utilities/api";

import { useDispatch, useSelector } from "react-redux";
import { updateInventories } from "../../redux/reducers/inventory";
import SelectComponent from "./InventorySelect";

/** 
  NOT YET IMPLEMENTED:
    FOR PREPARING FOR USING TABLES:
      IF TABLES ARE ENABLED:
        - WHEN CHECKING OUT ORDERS AND SELECTS A TABLE, CHECK IN DB IF THERE'S AN INCOMPLETE(BY CHEKING IF isCompleted IS FALSE) ORDER FOR THAT TABLE(BY CHECKING description value IF IT'S THE TABLE NAME) AND ADD THE ORDERS TO THAT INCOMPLETE ORDER.
        - SELECT BUTTON FOR DELIVERY, TABLES, TAKEOUT ORDERS.
**/

export default function InventoryCheckout({ orders, selectedInventories, totalPrice, onClearBottomSheet }) {
  const dispatch = useDispatch();
  const { establishment } = useSelector((state) => state.auth);

  const handleCheckout = async (e, isCompleted, table = null) => {
    try {
      e.preventDefault();

      const response = await api.checkoutOrder({ body: {
        orders,
        selectedInventories,
        totalPrice,
        isCompleted
      }});

      if (response.status === 200) {
        dispatch(updateInventories(response.data.inventories));        
        alert(response.data.message);
        onClearBottomSheet();
        // NOT YET IMPLEMENTED
        // ADD SETTING BOTTOM SHEET INDEX TO 0 [DONE onClearBottomSheet]
        // ADD CLEARING ORDERS [DONE onClearBottomSheet -> onClearOrders]
        // ADD CLEARING SELECTED INVENTORIES [DONE onClearBottomSheet -> onClearOrders]
        // ADD CLEARING TOTAL PRICE [DONE onClearBottomSheet -> onClearOrders]
        // ADD SETTING CHECKING OUT TO FALSE [DONE onClearBottomSheet]
        // ADD REDUX DISPATCH TO UPDATE THE QUANTITY OF INVENTORIES [TO DO HERE]
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      };
    }
  };

  function InventoryModal(){
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);
    return (
      <Center
        sx= {{
          width: "40%",
          marginRight: "5%",
        }}
      >
        <Button
          sx={{
            width: "100%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 24,
            marginTop: 7,
          }}
          onPress={() => setShowModal(true)} ref={ref}
          action={"positive"}
        >
          <Text color="black">Prepare</Text>
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
              <Heading size='lg'>Checking Out Inventory</Heading>
            </ModalHeader>
            <ModalBody>
              <Box
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text size="lg">For:</Text>
                <SelectComponent />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="positive"
                borderWidth='$0'
                // onPress={(e) => {handleCheckout(e, false)}}
                onPress={() => {
                  setShowModal(false);
                }}
              >
                <ButtonText>Prepare</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
    );
  }

  return(
    <VStack>
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
      {/* STORE INFO */}
      <Box
        sx={{
          height: "15%",
        }}
      >

      </Box>
      {/* ORDERS INFO */}
      <Divider bgColor="black" />
      <Box
        sx={{
          height: "64%"
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
                <Text style={{ marginLeft: 10 }}>{order.orderSize}</Text>
                <Text>{order.name}</Text>
                <Text style={{ marginRight: 10 }}>{(Math.round(order.price * order.orderSize * 100) / 100).toFixed(2)}</Text>
              </Box>
            );
          })
        }
      </Box>
      <Divider bgColor="black" />
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
              marginBottom: 15,
            }}
          >
            <Text style={{ marginLeft: 10 }}>{selectedInventories} selected</Text>
            <Text style={{ marginRight: 10 }}>Total: {(Math.round(totalPrice * 100) / 100).toFixed(2)}</Text>
          </Box>
          <Box
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            { //NOT YET IMPLEMENTED MAKE !isEmpty and &&
              isEmpty(establishment.settings) || get(establishment.settings, "tablesEnabled", false) === true 
                ?
                  <InventoryModal />
                :
                  <Button
                    sx={{
                      width: "40%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#F00B51",
                      borderRadius: 24,
                      marginTop: 7,
                      marginRight: "5%",
                    }}
                    onPress={(e) => {handleCheckout(e, false)}}
                  >
                    <Text color="black">Prepare</Text>
                  </Button>
            }
            <Button
              sx={{
                width: "40%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F00B51",
                borderRadius: 24,
                marginTop: 7
              }}
              onPress={(e) => {handleCheckout(e, true)}}
            >
              <Text color="black">Checkout</Text>
            </Button>
          </Box>
        </Box>
    </VStack>
  );
};