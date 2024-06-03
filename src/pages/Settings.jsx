import { Box, Button, HStack, SafeAreaView, Switch, Text } from "@gluestack-ui/themed";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";

import * as api from "../utilities/api";
import { updateEstablishment } from "../redux/reducers/auth";

export default function Settings() {
  const dispatch = useDispatch();
  const { establishment } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState(get(establishment, "settings", {}));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    let shoudDisable = true;
    Object.keys(settings).forEach((key) => {
      if (settings[key] !== get(establishment, `settings.${key}`)) shoudDisable = false;
    });
    setIsButtonDisabled(shoudDisable);
  }, [settings, setSettings]);

  function SettingsHeader() {
    return (
      <Box
        sx={{
          height: 50,
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Settings</Text>
      </Box>
    );
  };

  const onToggleSwitch = (key) => {
    setSettings((prev) => {
      return {
        ...prev,
        [key]: !prev[key]
      }
    });
  };

  const onSaveSettings = async () => {
    try {
      const options = {
        body: {
          newSettings: settings
        }
      }
      const response = await api.updateSettings(options);

      if (response.status === 200) {
        dispatch(updateEstablishment(response.data.establishment));
        setSettings(response.data.establishment.settings);
        alert("Settings saved successfully.");
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <Box>
          <SettingsHeader />
        </Box>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.8,
            marginBottom: 30,
          }}
        >
          <Text textAlign={"justify"}>Toggling Switches will disable or enable its corresponding features for your establishment.</Text>
        </Box>
        <Box
          sx= {{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 10px",
            borderBottomWidth: 2,
            borderBottomColor: "black",
            marginBottom: 15,
          }}
        >
          <Box width={"62%"}>
            <HStack space="md"
              sx={{
                marginLeft: 20
              }}
            >
              <Switch size={"lg"} value={settings.isOpen} onToggle={() => onToggleSwitch("isOpen")}/>
              <Text>Establishment Open</Text>
            </HStack>
          </Box>
          <Box width={"38%"}>
            <HStack space="md"
              sx={{
                marginRight: 20
              }}
            >
              <Switch size={"lg"} value={settings.deliveryEnabled} onToggle={() => onToggleSwitch("deliveryEnabled")}/>
              <Text>Delivery</Text>
            </HStack>
          </Box>
        </Box>
        <Box
          sx= {{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 10px",
            borderBottomWidth: 2,
            borderBottomColor: "black",
            marginBottom: 15,
          }}
        >
          <Box width={"62%"}>
            <HStack space="md"
              sx={{
                marginLeft: 20
              }}
            >
              <Switch size={"lg"} value={settings.inventoryEnabled} onToggle={() => onToggleSwitch("inventoryEnabled")}/>
              <Text>Inventory</Text>
            </HStack>
          </Box>
          <Box width={"38%"}>
            <HStack space="md"
              sx={{
                marginRight: 20
              }}
            >
              <Switch size={"lg"} value={settings.invoiceEnabled} onToggle={() => onToggleSwitch("invoiceEnabled")}/>
              <Text>Invoice</Text>
            </HStack>
          </Box>
        </Box>
        <Box
          sx= {{
            width: "100%",
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 10px",
            borderBottomWidth: 2,
            borderBottomColor: "black",
            marginBottom: 15,
          }}
        >
          <Box width={"62%"}>
            <HStack space="md"
              sx={{
                marginLeft: 20
              }}
            >
              <Switch size={"lg"} value={settings.preparationEnabled} onToggle={() => onToggleSwitch("preparationEnabled")}/>
              <Text>Inventory Preparation</Text>
            </HStack>
          </Box>
          <Box width={"38%"}>
            <HStack space="md"
              sx={{
                marginRight: 20,
              }}
            >
              <Switch size={"lg"} value={settings.tablesEnabled} onToggle={() => onToggleSwitch("tablesEnabled")}/>
              <Text>Tables</Text>
            </HStack>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Button
            isDisabled={isButtonDisabled}
            sx={{
              width: "50%",
              height: 50,
            }}
            action={"positive"}
            onPress={() => {onSaveSettings()}}
          >
            <Text color="black">Save Settings</Text>
          </Button>
        </Box>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
};