import { Box } from "@gluestack-ui/themed";
import AuthenticationCard from "../components/AuthenticationCard";

export default function Authentication() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        bgColor: "$pink200"
      }}
    >
      <AuthenticationCard />
    </Box>
  );
}