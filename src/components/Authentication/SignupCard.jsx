import { Box, Button, ButtonIcon, Text, VStack, Image, ButtonText, } from "@gluestack-ui/themed";

import { ChevronLeftIcon } from "@gluestack-ui/themed";

import AppLogo from "../../assets/AppLogo.png";

import SignupCardImage from "../../assets/SignupCard.png";


export default function SignupCard({ setAuthenticationToRender, setSignupToRender }) {

  //Handle back button
  const onBack = (e) => {
    e.preventDefault();
    setAuthenticationToRender("authentication");
  };

  onClickButton = (e, component) => {
    e.preventDefault();
    setSignupToRender(component);
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
        <Image source={SignupCardImage} alt="Signup Card Image" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      {/* Signup Text */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text fontSize={32} fontWeight="bold">Signup</Text>
        <Text fontSize={20} sx={{ marginBottom: 15 }}>as</Text>
      </Box>
      {/*Buttons for Customer and Establishment*/}
      <VStack
        space="md"
        sx={{
          width: "90%",
          marginLeft: "5%",
        }}
      >
        <Button
          sx={{
            borderRadius: 24,
            marginBottom: 10,
          }}
          size="xl"
          onPress={(e) => {onClickButton(e, "customer")}}
        >
          <ButtonText>
            Customer
          </ButtonText>
        </Button>
        <Text sx={{ justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: 20, marginBottom: 10 }}>Or</Text>
        <Button
          sx={{
            borderRadius: 24,
          }}
          size="xl"
          onPress={(e) => {onClickButton(e, "business")}}
        >
          <ButtonText>
            Business
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};