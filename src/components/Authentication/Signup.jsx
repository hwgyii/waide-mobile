import { useState } from "react";
import { Box, } from "@gluestack-ui/themed";

import SignupCard from "./SignupCard";
import SignupCustomer from "./SignupCustomer";
import SignupBusiness from "./SignupBusiness";

export default function Signup({ setAuthenticationToRender }) {
  const [signupToRender, setSignupToRender] = useState(null);

  const renderComponents = () => {
    switch(signupToRender) {
      case "customer":
        return <SignupCustomer setAuthenticationToRender={setAuthenticationToRender} setSignupToRender={setSignupToRender} />;
      case "business":
        return <SignupBusiness setAuthenticationToRender={setAuthenticationToRender} setSignupToRender={setSignupToRender} />;
      default:
        return <SignupCard setAuthenticationToRender={setAuthenticationToRender} setSignupToRender={setSignupToRender} />;
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
};