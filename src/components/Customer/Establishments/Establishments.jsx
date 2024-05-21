import { Box, SafeAreaView, ScrollView, Spinner, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as api from "../../../utilities/api";
import { Pressable } from "react-native";

export default function Establishments() {
  const [establishments, setEstablishments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchEstablishments = async () => {
    try {
      const response = await api.getEstablishments();
      
      if (response.status == 200) {
        setEstablishments(response.data.establishments);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEstablishments();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView>

        <ScrollView>
          {
            isLoaded
              ?
                establishments.length > 0
                  ?
                    establishments.map((establishment, index) => {
                      return (
                        <Pressable onPress={() => console.log(`${establishment.name} selected.`)} key={index}>
                            <Box
                              sx={{
                                height: 75,
                                width: "100%",
                                justifyContent: "center",
                                bgColor: index % 2 === 0 ? "#FDA5A5" : "#D9D9D9",
                              }}
                            >
                              <Text marginLeft={10} fontSize={20} fontWeight={"bold"}>{establishment.name}</Text>
                          </Box>
                        </Pressable>
                      )
                    })
                  :
                    <Box
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ marginTop: "50%" }}>No Establishments found.</Text>
                  </Box>
              :
                <Box
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner size={"xl"} style={{ height: 100, width: 100, marginTop: "50%" }} />
              </Box>
          }
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}