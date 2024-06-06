import { Box, SafeAreaView, ScrollView, Spinner, Text } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import * as api from "../../../utilities/api";
import { Pressable } from "react-native";
import EstablishmentPage from "./EstablishmentPage";
import { MaterialIcons } from "@expo/vector-icons";

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

  
  const [component, setComponent] = useState("Establishments");
  const [establishmentId, setEstablishmentId] = useState("");

  const renderComponent = () => {
    switch (component) {
      case "Establishments":
        return <EstablishmentsPage />;
      case "EstablishmentPage":
        return <EstablishmentPage establishmentId={establishmentId} setComponent={setComponent} />;
      default:
        return <EstablishmentsPage />;
    }    
  };

  function EstablishmentsPage() {
    return (
      <>
        <Box
          sx={{
            height: 75,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text fontSize={32} fontWeight={"bold"}>Establishments</Text>
        </Box>
        <ScrollView
          sx={{
            height: 520,
            width: "100%",
          }}
        >
          {
            isLoaded
              ?
                establishments.length > 0
                  ?
                    establishments.map((establishment, index) => {
                      return (
                        <Pressable onPress={() => {setEstablishmentId(establishment._id); setComponent("EstablishmentPage")}} key={index}>
                            <Box
                              sx={{
                                height: 75,
                                width: "100%",
                                justifyContent: "space-between",
                                bgColor: index % 2 === 0 ? "#FDA5A5" : "#D9D9D9",
                                alignItems: "center",
                                flexDirection: "row",
                                marginBottom: 10,
                              }}
                            >
                              <Box
                                sx={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  width: "75%",
                                }}
                              >
                                <Box
                                  sx={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 12,
                                    bgColor: "#FFFFFF",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginLeft: 10,
                                  }}
                                >
                                  <MaterialIcons name="store" size={50} color={"#f00b51"} />
                                </Box>
                                <Text marginLeft={10} fontSize={20} fontWeight={"bold"}>{establishment.name}</Text>
                              </Box>
                              <Box marginRight={10}>
                                <MaterialIcons name="chevron-right" size={30} />
                              </Box>
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
      </>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        {renderComponent()}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}