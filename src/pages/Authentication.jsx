import { useEffect, useState } from "react";
import { Box } from "@gluestack-ui/themed";

import AuthenticationCard from "../components/Authentication/AuthenticationCard";
import LoginCard from "../components/Authentication/LoginCard";
import Signup from "../components/Authentication/Signup";

export default function Authentication() {
  const [componentToRender, setAuthenticationToRender] = useState("authentication");

  const renderComponents = () => {
    switch (componentToRender) {
      case "login":
        return <LoginCard setAuthenticationToRender={setAuthenticationToRender} />;
      case "signup":
        return <Signup setAuthenticationToRender={setAuthenticationToRender} />;
      case "authentication":
        return <AuthenticationCard setAuthenticationToRender={setAuthenticationToRender} />;
      default:
        return <AuthenticationCard setAuthenticationToRender={setAuthenticationToRender} />;
    };
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
       {renderComponents()}
    </Box>
  );
}