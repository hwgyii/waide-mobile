import { Box, Divider, Text, VStack, Button, Center, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading, ButtonText, HStack, Input, InputField, FormControl, FormControlLabel, Textarea, TextareaInput,} from "@gluestack-ui/themed";
import { useState, useRef, useEffect } from "react";
import { isEmpty, get, cloneDeep } from "lodash";
import { Alert } from "react-native";
import { Pressable } from "@gluestack-ui/themed";
import { useDispatch, useSelector } from "react-redux";

import * as api from "../../../utilities/api";
import { updateInventories } from "../../../redux/reducers/inventory";

export default function InventoryCRUDModal({ inventory, index }){
  const { inventories } = useSelector((state) => state.inventories);
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [newInventory, setNewInventory] = useState(inventory);

  const [isEditModeButtonEnabled, setIsEditModeButtonEnabled] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setNewInventory(inventory);
    setIsEditMode(false);
  }, [showModal]);

  useEffect(() => {
    let shoudDisable = false;
    Object.keys(newInventory).forEach((key) => {
      if (newInventory[key] != get(inventory, `${key}`)) shoudDisable = true;
    });
    setIsEditModeButtonEnabled(shoudDisable);
  }, [newInventory, setNewInventory]);

  const handleConfirm = () => {
    Alert.alert(
      `Edit ${inventory.name}`,
      'Are you sure you want to edit this inventory?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Handle the confirmation
            onEditInventory();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      `Delete ${inventory.name}`,
      'Are you sure you want to delete this inventory?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Handle the confirmation
            onDeleteInventory();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onEditInventory = async () => {
    try {
      const response = await api.updateInventory({ inventoryId: inventory._id, body: newInventory });
      if (response.status === 200) {
        alert("Inventory updated successfully.");
        setShowModal(false);
        dispatch(updateInventories(inventories.map((inv) => inv._id === inventory._id ? response.data.inventory : inv)));
      };
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteInventory = async () => {
    try {
      const response = await api.deleteInventory({ inventoryId: inventory._id });
      
      if (response.status === 200) {
        alert("Inventory deleted successfully.");
        setShowModal(false);
        dispatch(updateInventories(inventories.filter((inv) => inv._id !== inventory._id)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Center
      sx= {{
        width: "100%",
        marginRight: "5%",
      }}
    >
      <Pressable onPress={() => setShowModal(true)}>
        <Box
          sx={{
            height: 100,
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
              }}
            >
              <Text style={{ marginLeft: 10, fontSize: 24, fontWeight: "bold" }}>{inventory.name}</Text>
              {inventory.quantity === 0 ? <Text style={{ color: "red", marginLeft: 10 }}>Out of Stock</Text> : inventory.quantity <= 5 ? <Text style={{ color: "red", marginLeft: 10 }}>{`Low stock: ${inventory.quantity} remaining.`}</Text> : null}
            </Box>
          </Box>
        </Box>
      </Pressable>
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
            <Heading size='lg'>{inventory.name}</Heading>
            <ModalCloseButton><Text underline={true} color="red">Close</Text></ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormControlLabel><Text>Name</Text></FormControlLabel>
              <Input placeholder="Name"
                variant="outline"
                isDisabled={!isEditMode}
                isInvalid={false}
                isReadOnly={false}
                width={"100%"}
              >
                <InputField
                  type="text"
                  inputMode="text"
                  keyboardType="default"
                  placeholder="Name"
                  value={newInventory.name}
                  onChangeText={(value) => {setNewInventory({...newInventory, name: value})}}
                />
              </Input>
              <FormControlLabel><Text>Price</Text></FormControlLabel>
              <Input placeholder="Price"
                variant="outline"
                isDisabled={!isEditMode}
                isInvalid={false}
                isReadOnly={false}
                width={"45%"}
              >
                <InputField
                  type="text"
                  inputMode="decimal"
                  keyboardType="decimal-pad"
                  placeholder="Price"
                  value={newInventory.price.toString()}
                  onChangeText={(value) => {setNewInventory({...newInventory, price: value})}}
                />
              </Input>
              <FormControlLabel><Text>Quantity</Text></FormControlLabel>
              <Input placeholder="Quantity"
                variant="outline"
                isDisabled={!isEditMode}
                isInvalid={false}
                isReadOnly={false}
                width={"45%"}
              >
                <InputField
                  type="text"
                  inputMode="numeric"
                  keyboardType="numeric"
                  placeholder="Quantity"
                  value={newInventory.quantity.toString()}
                  onChangeText={(value) => {setNewInventory({...newInventory, quantity: value})}}
                />
              </Input>
              <FormControlLabel><Text>Description</Text></FormControlLabel>
              <Textarea
                isDisabled={!isEditMode}
              >
                <TextareaInput placeholder="Description" value={newInventory.description} onChangeText={(value) => {setNewInventory({...newInventory, description: value})}} />
              </Textarea>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {
              isEditMode
                ?
                  <Box
                    sx={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="sm"
                      action="negative"
                      mr="$3"
                      onPress={() => {
                        setIsEditMode(false);
                      }}
                    >
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      action="primary"
                      borderWidth='$0'
                      // onPress={(e) => {handleCheckout(e, false)}}
                      onPress={() => {handleConfirm();}}
                      isDisabled={!isEditModeButtonEnabled}
                    >
                      <ButtonText>Confirm Edit</ButtonText>
                    </Button>
                  </Box>
                :
                  <Box
                    sx={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="sm"
                      action="negative"
                      mr="$3"
                      onPress={() => {
                        handleConfirmDelete();
                      }}
                    >
                      <ButtonText>Delete Inventory</ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      action="primary"
                      borderWidth='$0'
                      // onPress={(e) => {handleCheckout(e, false)}}
                      onPress={() => {setIsEditMode(true)}}
                    >
                      <ButtonText>Edit Inventory</ButtonText>
                    </Button>
                  </Box>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}