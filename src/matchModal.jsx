import { useState } from "react";
import './styles/Match.css'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
  } from '@chakra-ui/react';
  
  export default function MatchModal({ isOpen, onClose, isMatch, setIsMatch }) {

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
  