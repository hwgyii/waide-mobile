import { Box, LoaderIcon, Text } from "@gluestack-ui/themed";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      setUser(JSON.parse(user));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <Box>
      {
        isEmpty(user)
          ? 
            <LoaderIcon />
          : 
            <Box
              sx={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgColor: "pink",
              }}
            >
              <Text>TITE</Text>
              <Text>{user.fullName}</Text>
              <Text>{user.email}</Text>
              <Text>{user.role === 1 ? "Business Establishment Account" : "Customer Account"}</Text>
            </Box>
      }
    </Box>
  );
};