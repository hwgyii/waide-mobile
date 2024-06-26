import { Box, Button, ButtonIcon, Text, VStack, Image, Input, InputField, FormControl, FormControlLabel, ButtonText } from "@gluestack-ui/themed";

import { ChevronLeftIcon } from "@gluestack-ui/themed";

import AppLogo from "../../assets/AppLogo.png";
import LoginImage from "../../assets/Login.png";
import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage"

import * as api from "../../utilities/api";

import { useDispatch } from "react-redux";
import { getAuth, getEstablishment } from "../../redux/reducers/auth";

export default function LoginCard({ setAuthenticationToRender, setAppToRender }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  
  //Handle login
  const onLogin = async (e) => {
    e.preventDefault();
    try {
      if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        return alert("Invalid email address");
      };
      
      const response = await api.logIn({body: {email: email, password: password}});
      if (response.status === 200) {
        await AsyncStorage.setItem("sessionToken", response.data.sessionToken);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        dispatch(getAuth(response.data.user));

        if (response.data.user.role === 1 && response.data.establishment) dispatch(getEstablishment(response.data.establishment));

        setAppToRender(response.data.user.role === 1 && response.data.establishment ? "Establishment" : "Customer")
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //Handle back button
  const onBack = (e) => {
    e.preventDefault();
    setAuthenticationToRender("authentication");
  };

  return (
    <VStack
      sx={{
        height: "100%",
        width: "100%",
      }}
      paddingTop={20}
      paddingLeft={10}
      paddingRight={10}
    >
      {/* Back Button */}
      <Button 
        sx={{
          bgColor: "#F00B51",
          width: 42,
        }}
        onPress={(e) => {onBack(e)}}
      >
        <ButtonIcon as={ChevronLeftIcon} />
      </Button>
      {/* App Logo */}
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          height: "20%",
        }}
      >
        <Image source={AppLogo} alt="App Logo" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      {/* Login Image */}
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          height: "25%",
        }}
      >
        <Image source={LoginImage} alt="Login Image" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      {/* Login Text */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text fontSize={28} fontWeight="bold">Login</Text>
      </Box>
      {/*Login Forms*/}
      <VStack
        space="md"
        sx={{
          width: "90%",
          marginLeft: "5%",
        }}
      >
        <FormControl>
          <FormControlLabel paddingTop={25}><Text>Email</Text></FormControlLabel>
          <Input placeholder="Email"
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField
              type="email"
              inputMode="email"
              keyboardType="email-address"
              placeholder="Email address..."
              value={email}
              onChangeText={(value) => {setEmail(value)}}
            />
          </Input>
          <FormControlLabel paddingTop={10}><Text>Password</Text></FormControlLabel>
          <Input 
            type="password"
            placeholder="Password"
            variant="outline"
            size="md"
          >
            <InputField 
              type="password"
              placeholder="Password..." 
              value={password}
              onChangeText={(value) => {setPassword(value)}}
            />
          </Input>
          <Box
            sx={{
              paddingTop: 30,
            }}
          >
            <Button
              onPress={(e) => {onLogin(e)}}
            >
              <ButtonText>Login</ButtonText>
            </Button>
          </Box>
        </FormControl>
      </VStack>
    </VStack>
  );
};