import { Box, Button, ButtonText, HStack, Input, InputField, SafeAreaView, Text, Textarea, TextareaInput, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import { cloneDeep, isEqual } from 'lodash';

import * as api from "../utilities/api";
import { getEstablishment } from "../redux/reducers/auth";

export default function EstablishmentProfile() {
  const { establishment } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newEstablishment, setNewEstablishment] = useState(cloneDeep(establishment));
  const dispatch = useDispatch();

  const onEditEstablishment = async () => {
    try {
      console.log({ establishmentId: establishment._id, body: newEstablishment });
      const response = await api.editEstablishment({ establishmentId: establishment._id, body: newEstablishment });

      if (response.status === 200) {
        alert("Establishment updated successfully");
        setIsEditing(false);
        dispatch(getEstablishment(response.data.establishment));
      };
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>ESTABLISHMENT PROFILE</Text>
        </Box>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            marginLeft: 15,
          }}
        >
          {
            isEditing
              ?
                <VStack
                  space="md"
                  sx={{
                    width: "90%",
                    marginTop: 20,
                  }}
                >
                  <Input 
                    placeholder="Business name"
                    variant="outline"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    isRequired={true}
                  >
                    <InputField
                      type="text"
                      placeholder="Business name"
                      value={newEstablishment.name}
                      onChangeText={(value) => {setNewEstablishment({...newEstablishment, name: value})}}
                    />
                  </Input>
                  <Input 
                    placeholder="Address"
                    variant="outline"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    isRequired={true}
                  >
                    <InputField
                      type="text"
                      placeholder="Address"
                      value={newEstablishment.address}
                      onChangeText={(value) => {setNewEstablishment({...newEstablishment, address: value})}}
                    />
                  </Input>
                  <Textarea>
                    <TextareaInput placeholder="Operating hours" value={newEstablishment.operatingHours} onChangeText={(value) => {setNewEstablishment({...newEstablishment, operatingHours: value})}}/>
                  </Textarea>
                  <HStack
                    sx={{
                      paddingTop: 22,
                      width: "100%",
                    }}>
                      <Button action={"negative"} sx={{ width: "48%", marginRight: "4%", }} onPress={() => {setIsEditing(false); setNewEstablishment(cloneDeep(establishment))}}>
                        <ButtonText>Cancel</ButtonText>
                      </Button>
                      <Button sx={{ width: "48%" }} onPress={() => onEditEstablishment()} isDisabled={isEqual(establishment, newEstablishment)}>
                        <ButtonText>Save Edit</ButtonText>
                      </Button>
                  </HStack>
                </VStack>
              :
                <VStack mr={40} space="md" mt={15}>
                  <Box width={"100%"} alignItems="center">
                    <Text fontSize={32} fontWeight="bold" textAlign="justify">{establishment.name}</Text>
                  </Box>
                  <Text fontSize={24} fontWeight="bold" textAlign="justify">Address: {establishment.address}</Text>
                  <Text fontSize={24} fontWeight="bold" textAlign="justify">Operating Hours: {establishment.operatingHours}</Text>
                  <Box sx={{ width: "90%", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                    <Button sx={{ width: "50%", ml: 40 }} onPress={() => setIsEditing(true)}>
                      <ButtonText>Edit Profile</ButtonText>
                    </Button>
                  </Box>
                </VStack>
          }
        </Box>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};