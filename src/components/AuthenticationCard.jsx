import { Box, Button, Image, Text, VStack } from "@gluestack-ui/themed";
import { Link } from "expo-router";

import AuthenticationImage from "../assets/Authentication.png";

export default function AuthenticationCard() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        bgColor: "$pink200",
      }}
    >
      <Box
        sx={{
          width: "calc(100% - 10px)",
          marginLeft: "5px",
          bgColor: "$white",
          height: "35%",
        }}
      >
        <Image source={AuthenticationImage} alt="Authentication Image" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      <VStack
        space="md"
        sx={{
          marginTop: "10%",
          width: "80%",
          marginLeft: "10%",
        }}
      >
        <Button><Text>Login</Text></Button>
        <Button><Text>Signup</Text></Button>
      </VStack>
    </Box>
  );
};