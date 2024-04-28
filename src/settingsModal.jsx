import { useState} from "react";

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
  
  export default function SettingsModal({ isOpen, onClose, searchRadius, setSearchRadius }) {
    const [localRadius, setLocalRadius] = useState(searchRadius);

    const handleSave = () => {
      setSearchRadius(localRadius);
      onClose();
    };
  
    const handleRadiusChange = (valueAsString, valueAsNumber) => {
      setLocalRadius(valueAsNumber);
    };

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
              <NumberInput defaultValue={searchRadius} min={1} max={30} value={localRadius} onChange={handleRadiusChange}>
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
                Delete data
              </Button>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  