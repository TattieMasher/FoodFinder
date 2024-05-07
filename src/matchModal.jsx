import { useEffect } from "react";
import './styles/Match.css'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
  } from '@chakra-ui/react';
  
  export default function MatchModal({ isOpen, onClose, isMatch, setIsMatch }) {

    useEffect(() => {
      if (isOpen) {
          const timer = setTimeout(() => {
              onClose();
          }, 1250);

          return () => clearTimeout(timer); // Stop tracking time once cleared
      }
  }, [isOpen, onClose]);

    return (
      <>
        <Modal isOpen={isOpen}
          onClose={onClose}
          >
          <ModalOverlay backdropFilter="blur(20px)" />
          <ModalContent
          bgColor={'transparent'}
          minWidth="fit-content"
          height="fit-content"
          border="none"
          boxShadow="none"
          >
            <ModalHeader className="match_text">It's a match!</ModalHeader>
            <ModalBody>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
  