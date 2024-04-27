// Import only the necessary components from Chakra UI
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
  } from '@chakra-ui/react';
  
  export default function SettingsModal({ isOpen, onClose }) {
    const handleSave = () => {
        // TODO
        onClose;
    }

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormControl>
              <FormLabel>Search radius</FormLabel>
              <NumberInput defaultValue={5} min={1} max={50}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>Distance in miles</FormHelperText>
            </FormControl>
            </ModalBody>
            <ModalFooter display="flex" justifyContent="space-between">
              <Button colorScheme="red" onClick={onClose}>
                Delete stored data
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  