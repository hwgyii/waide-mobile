import { Box, CheckIcon, CloseIcon, EditIcon, Icon, Input, InputField, Pressable, Text, TrashIcon } from "@gluestack-ui/themed";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import * as api from "../../../utilities/api";
import { updateTables } from "../../../redux/reducers/table";

export default function TablesCRUDModal({ table, index, shouldEdit, setIndexToEdit }) {
  const [newTable, setNewTable] = useState(cloneDeep(table));
  const [isEditMode, setIsEditMode] = useState(shouldEdit);

  const [isEditModeButtonEnabled, setIsEditModeButtonEnabled] = useState(false);

  const dispatch = useDispatch();
  const { tables } = useSelector((state) => state.tables);

  const onDeleteTable = async () => {
    try {
      const response = await api.deleteTable({ tableId: table._id });
      
      if (response.status === 200) {
        alert("Table deleted successfully.");
        dispatch(updateTables(tables.filter((element) => element._id !== table._id)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      `Delete ${table.name}`,
      'Are you sure you want to delete this table?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Handle the confirmation
            onDeleteTable();
          },
        },
      ],
      { cancelable: false }
    );
  };


  const onEditTable = async () => {
    try {
      const response = await api.updateTable({ tableId: table._id, body: newTable });
      if (response.status === 200) {
        alert("Table updated successfully.");
        setIsEditMode(false);
        setIndexToEdit(-1);
        dispatch(updateTables(tables.map((table) => table._id === response.data.table._id ? response.data.table : table)));
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmEdit = () => {
    Alert.alert(
      `Edit ${table.name}`,
      `Are you sure you want to edit ${table.name} to ${newTable.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // Handle the confirmation
            onEditTable();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    setIsEditModeButtonEnabled(newTable.name !== table.name);
  }, [newTable]);

  useEffect(() => {
    setNewTable(cloneDeep(table));
  }, [isEditMode, setIsEditMode]);

  useEffect(() => {
    setIsEditMode(shouldEdit);
  }, [shouldEdit, setIndexToEdit]);

  return (
    <Box>
      <Pressable>
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
          {
            isEditMode
              ?
                <Input
                  sx={{
                    width: "40%",
                    borderColor: "$black",
                    borderWidth: 2,
                  }}
                >
                  <InputField
                    type="text"
                    inputMode="text"
                    keyboardType="default"
                    placeholder="Table Name"
                    value={newTable.name}
                    onChangeText={(value) => {setNewTable({...newTable, name: value})}}
                    sx={{
                      fontSize: 24,
                    }}
                    autoFocus={true}
                  />
                </Input>
              :
                <Text style={{ fontSize: 24, fontWeight: "bold", marginLeft: 10 }}>{table.name}</Text>
          }
          <Box
            sx={{
              height: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {
              isEditMode
                ?
                  <Box
                    sx={{
                      height: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Pressable onPress={() => handleConfirmEdit()} disabled={!isEditModeButtonEnabled}>
                      <Icon name="edit" as={CheckIcon} size="xl" marginRight={30} color={!isEditModeButtonEnabled ? "black" : "blue"} />
                    </Pressable>
                    <Pressable onPress={() => {setIsEditMode(false); setIndexToEdit(-1);}}>
                      <Icon name="edit" as={CloseIcon} size="xl" marginRight={20} color={"red"} />
                    </Pressable>
                  </Box>
                :
                  <Box
                    sx={{
                      height: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Pressable onPress={() => {setIsEditMode(true); setIndexToEdit(index);}}>
                      <Icon name="edit" as={EditIcon} size="xl" marginRight={30} color={"blue"} />
                    </Pressable>
                    <Pressable onPress={() => handleConfirmDelete()}>
                      <Icon name="edit" as={TrashIcon} size="xl" marginRight={20} color={"red"} />
                    </Pressable>
                  </Box>
            }
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
};