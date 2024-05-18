import React, { useState } from "react";
import { Center, Button, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading, Text, Icon, ButtonText } from "@gluestack-ui/themed";

export default function InventoryModal(){
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  return (
    <Center h={300}>
      <Button
        sx={{
          width: "40%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F00B51",
          borderRadius: 24,
          marginTop: 7
        }}
        onPress={() => setShowModal(true)} ref={ref}
      >
        <Text color="black">Checkout</Text>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size='lg'>Engage with Modals</Heading>
            <ModalCloseButton>
              <Text>Close </Text>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text >
          Elevate user interactions with our versatile modals. Seamlessly integrate notifications, forms, and media displays. Make an impact effortlessly.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              action="positive"
              borderWidth='$0'
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Explore</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
