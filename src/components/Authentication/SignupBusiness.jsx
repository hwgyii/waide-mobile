import { Box, Button, ButtonIcon, Text, VStack, Image, Input, InputField, FormControl, FormControlLabel, ButtonText, HStack, Pressable, Textarea, TextareaInput } from "@gluestack-ui/themed";

import { ChevronLeftIcon } from "@gluestack-ui/themed";

import AppLogo from "../../assets/AppLogo.png";
import SignupBusinessImage from "../../assets/SignupBusiness.png";
import { useState } from "react";

import * as api from "../../utilities/api";

export default function SignupBusiness({ setSignupToRender, setAuthenticationToRender }) {
  const [formToShow, setFormToShow] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [operatingHours, setOperatingHours] = useState("");

  //Handle signup
  const onSignup = async (e) => {
    e.preventDefault();
    try {
      if ( !firstName || !lastName || !email || !password || !confirmPassword || !businessName || !address || !operatingHours ) {
        return alert("All fields are required");
      };

      if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        return alert("Invalid email address");
      };

      if (password !== confirmPassword) {
        return alert("Passwords do not match");
      };

      const body = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        businessName,
        address,
        operatingHours
      };

      const response = await api.signUpBusiness({ body });

      if (response.status === 200) {
        alert("Signup successful");
        setAuthenticationToRender("authentication");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        return alert(error.response.data.message);
      }
    }
  };

  const onNextComponent = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return alert("All fields are required");
    };

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    };

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      return alert("Invalid email address");
    };

    setFormToShow(1);
  };

  //Handle back button
  const onBack = (e) => {
    e.preventDefault();
    setSignupToRender(null);
  };

  const renderComponent = () => {
    if (formToShow === 0) {
      return <FirstForm />;
    } else if (formToShow === 1) {
      return <SecondForm />;
    }
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
      {/* Signup Business Image */}
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          height: "17.5%",
        }}
      >
        <Image source={SignupBusinessImage} alt="Signup Business Image" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      {/* Signup Business Text */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text fontSize={32}>Signup - Business</Text>
      </Box>
      {/*Signup Business Forms*/}
      {
        formToShow === 0 
          ?
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
              <HStack
                sx={{
                  paddingTop: 30,
                  width: "100%",
                }}>
                  <Button action={"negative"} sx={{ width: "48%", marginRight: "4%", }} onPress={(e) => {onBack(e)}}>
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                  <Button sx={{ width: "48%" }} onPress={onNextComponent}>
                    <ButtonText>Next</ButtonText>
                  </Button>
                </HStack>
            </VStack>
          :
            <VStack
              space="md"
              sx={{
                width: "90%",
                marginLeft: "5%",
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
                  value={businessName}
                  onChangeText={(value) => {setBusinessName(value)}}
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
                  value={address}
                  onChangeText={(value) => {setAddress(value)}}
                />
              </Input>
              <Textarea>
                <TextareaInput placeholder="Operating hours" value={operatingHours} onChangeText={(value) => {setOperatingHours(value)}}/>
              </Textarea>
              <HStack
                sx={{
                  paddingTop: 22,
                  width: "100%",
                }}>
                  <Button action={"negative"} sx={{ width: "48%", marginRight: "4%", }} onPress={(e) => {e.preventDefault(); setFormToShow(0);}}>
                    <ButtonText>Previous</ButtonText>
                  </Button>
                  <Button sx={{ width: "48%" }} onPress={onSignup}>
                    <ButtonText>Signup</ButtonText>
                  </Button>
                </HStack>
            </VStack>
      }
    </VStack>
  );
};