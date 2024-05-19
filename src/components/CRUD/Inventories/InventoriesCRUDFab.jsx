import { AddIcon, Box, Button, ButtonText, Fab, FabIcon } from "@gluestack-ui/themed";
import { Text, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading, Input, InputField, FormControl, FormControlLabel, Textarea, TextareaInput, } from "@gluestack-ui/themed";
import { get } from "lodash";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as api from "../../../utilities/api";
import { updateInventories } from "../../../redux/reducers/inventory";

export default function InventoriesCRUDFab() {
  const dispatch = useDispatch();
  const { inventories } = useSelector((state) => state.inventories);
  const { establishment } = useSelector((state) => state.auth);
  const [newInventory, setNewInventory] = useState({});

  const [isEditModeButtonEnabled, setIsEditModeButtonEnabled] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let shoudDisable = get(newInventory, "name", "").length === 0 || get(newInventory, "price", "").length === 0 || get(newInventory, "quantity", "").length === 0 || get(newInventory, "description", "").length === 0;
    
    setIsEditModeButtonEnabled(!shoudDisable);
  }, [newInventory, setNewInventory]);

  useEffect(() => {
    setNewInventory({});
  }, [showModal, setShowModal]);

  const onAddNewInventory = async () => {
    try {
      const options = {
        body: {
          ...newInventory
        },
      };
      const response = await api.createInventory(options);
      if (response.status === 200) {
        alert("Inventory added successfully.");
        dispatch(updateInventories(inventories.concat(response.data.inventory)));
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Fab
        size={"lg"}
        placement={"bottom right"}
        onPress={() => setShowModal(true)}
      >
        <FabIcon as={AddIcon} mr={"1"} />
      </Fab>
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
            <Heading size='lg'>Add Inventory</Heading>
            <ModalCloseButton><Text underline={true} color="red">Close</Text></ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormControlLabel><Text>Name</Text></FormControlLabel>
              <Input placeholder="Name"
                variant="outline"
                isDisabled={false}
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
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                width={"45%"}
              >
                <InputField
                  type="text"
                  inputMode="decimal"
                  keyboardType="decimal-pad"
                  placeholder="Price"
                  value={newInventory.price}
                  onChangeText={(value) => {setNewInventory({...newInventory, price: value})}}
                />
              </Input>
              <FormControlLabel><Text>Quantity</Text></FormControlLabel>
              <Input placeholder="Quantity"
                variant="outline"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                width={"45%"}
              >
                <InputField
                  type="text"
                  inputMode="numeric"
                  keyboardType="numeric"
                  placeholder="Quantity"
                  value={newInventory.quantity}
                  onChangeText={(value) => {setNewInventory({...newInventory, quantity: value})}}
                />
              </Input>
              <FormControlLabel><Text>Description</Text></FormControlLabel>
              <Textarea
                isDisabled={false}
              >
                <TextareaInput placeholder="Description" value={newInventory.description} onChangeText={(value) => {setNewInventory({...newInventory, description: value})}} />
              </Textarea>
            </FormControl>
          </ModalBody>
          <ModalFooter>
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
                  setShowModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="primary"
                borderWidth='$0'
                // onPress={(e) => {handleCheckout(e, false)}}
                onPress={() => {onAddNewInventory();}}
                isDisabled={!isEditModeButtonEnabled}
              >
                <ButtonText>Confirm Add</ButtonText>
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}