import { Box, Button, VStack, Image,ButtonText, } from "@gluestack-ui/themed";

import AppLogoWithSlogan from "../../assets/AppLogoWithSlogan.png";

import AuthenticationImage from "../../assets/Authentication.png";

export default function AuthenticationCard({ setAuthenticationToRender }) {

  onClickButton = (e, component) => {
    e.preventDefault();
    setAuthenticationToRender(component);
  };

  return (
    <VStack
      sx={{
        height: "100%",
        width: "100%",
      }}
      paddingTop={30}
      paddingLeft={10}
      paddingRight={10}
    >
      {/* App Logo With Slogan*/}
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          height: "20%",
        }}
      >
        <Image source={AppLogoWithSlogan} alt="App Logo with Slogan" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      {/* Authentication Image */}
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          height: "50%",
        }}
      >
        <Image source={AuthenticationImage} alt="Authentication Image" sx={{ width: '100%', height: '100%', resizeMode: 'contain' }}/>
      </Box>
      
      {/*Buttons for Login and Signup*/}
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
          onPress={(e) => {onClickButton(e, "login")}}
        >
          <ButtonText>
            Login
          </ButtonText>
        </Button>
        <Button
          sx={{
            borderRadius: 24,
          }}
          size="xl"
          onPress={(e) => {onClickButton(e, "signup")}}
        >
          <ButtonText>
            Signup
          </ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};