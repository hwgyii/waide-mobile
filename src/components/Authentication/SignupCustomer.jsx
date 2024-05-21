import { Box, Button, ButtonIcon, Text, VStack, Image, Input, InputField, FormControl, FormControlLabel, ButtonText, HStack, Pressable } from "@gluestack-ui/themed";

import { ChevronLeftIcon } from "@gluestack-ui/themed";

import AppLogo from "../../assets/AppLogo.png";
import SignupCustomerImage from "../../assets/SignupCustomer.png";
import { useState } from "react";

import * as api from "../../utilities/api";

export default function SignupCustomer({ setSignupToRender, setAuthenticationToRender }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Handle signup
  const onSignup = async (e) => {
    e.preventDefault();
    try {
      const body = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      };

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return alert("All fields are required");
      };

      if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        return alert("Invalid email address");
      };

      if (password !== confirmPassword) {
        return alert("Passwords do not match");
      };
      
      const response = await api.signUp({ body });

      if (response.status === 200) {
        alert("Signup successful");
        setAuthenticationToRender("authentication");
      }
    } catch (error) {
      if (error.response) {
        return alert(error.response.data.message);
      }
    }
  };

  //Handle back button
  const onBack = (e) => {
    e.preventDefault();
    setSignupToRender(null);
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
      {/* Signup Customer Image */}
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          height: "17.5%",
        }}
      >
        <Image source={SignupCustomerImage} alt="Signup Customer Image" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      {/* Signup Customer Text */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text fontSize={32}>Signup - Customer</Text>
      </Box>
      {/*Signup Customer Forms*/}
      <VStack
        space="md"
        sx={{
          width: "90%",
          marginLeft: "5%",
          marginTop: 20,
        }}
      >
          <HStack
            sx={{
              width: "100%",
            }}
          >
          <Input placeholder="First name"
            variant="outline"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
            sx={{
              width: "48%",
              marginRight: "4%"
            }}
          >
            <InputField
              type="text"
              placeholder="First name"
              value={firstName}
              onChangeText={(value) => {setFirstName(value)}}
            />
          </Input>
          <Input placeholder="Last name"
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
            sx={{
              width: "48%",
            }}
          >
            <InputField
              type="text"
              placeholder="Last name"
              value={lastName}
              onChangeText={(value) => {setLastName(value)}}
            />
          </Input>
          </HStack>
          <Input 
            placeholder="Email"
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            isRequired={true}
          >
            <InputField
              type="email"
              inputMode="email"
              keyboardType="email-address"
              placeholder="Email address"
              value={email}
              onChangeText={(value) => {setEmail(value)}}
            />
          </Input>
          <Input 
            type="password"
            placeholder="Password"
            variant="outline"
            size="md"
          >
            <InputField 
              type="password"
              placeholder="Password" 
              value={password}
              onChangeText={(value) => {setPassword(value)}}
            />
          </Input>
          <Input 
            type="password"
            placeholder="Confirm password"
            variant="outline"
            size="md"
          >
            <InputField 
              type="password"
              placeholder="Confirm password" 
              value={confirmPassword}
              onChangeText={(value) => {setConfirmPassword(value)}}
            />
          </Input>
          <Box
            sx={{
              paddingTop: 30,
            }}
          >
            <Button
              onPress={(e) => {onSignup(e)}}
            >
              <ButtonText>Signup</ButtonText>
            </Button>
          </Box>
      </VStack>
    </VStack>
  );
};