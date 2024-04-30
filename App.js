import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import Authentication from "./src/pages/Authentication";
import LoginCard from "./src/components/LoginCard";
import Home from "./src/pages/Home";
import Inventories from "./src/components/Inventories/Inventories";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      {/* <Authentication /> */}
      {/* <LoginCard /> */}
      <Inventories />
    </GluestackUIProvider>
  )
}