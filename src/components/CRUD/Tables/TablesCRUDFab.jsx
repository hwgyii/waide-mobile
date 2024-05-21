import { AddIcon, Box, Button, ButtonText, Fab, FabIcon } from "@gluestack-ui/themed";
import { Text, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading, Input, InputField, FormControl, FormControlLabel, Textarea, TextareaInput, } from "@gluestack-ui/themed";
import { get } from "lodash";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as api from "../../../utilities/api";
import { updateTables } from "../../../redux/reducers/table";

export default function TablesCRUDFab() {
  const dispatch = useDispatch();
  const { tables } = useSelector((state) => state.tables);
  const { establishment } = useSelector((state) => state.auth);
  const [newTable, setNewTable] = useState({});

  const [isEditModeButtonEnabled, setIsEditModeButtonEnabled] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let shoudDisable = get(newTable, "name", "").length === 0;
    
    setIsEditModeButtonEnabled(!shoudDisable);
  }, [newTable, setNewTable]);

  useEffect(() => {
    setNewTable({});
  }, [showModal, setShowModal]);

  const onAddNewTable = async () => {
    try {
      const options = {
        body: {
          ...newTable
        },
      };
      const response = await api.createTable(options);
      if (response.status === 200) {
        alert("Table added successfully.");
        dispatch(updateTables(tables.concat(response.data.table)));
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
        placement={"bottom center"}
        onPress={() => setShowModal(true)}
      >
        <Text sx={{ fontSize: 16, color: "white", fontWeight: "bold" }}>Add Table</Text>
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
            <Heading size='lg'>Add Table</Heading>
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
                  value={newTable.name}
                  onChangeText={(value) => {setNewTable({...newTable, name: value})}}
                />
              </Input>
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
                onPress={() => {onAddNewTable();}}
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