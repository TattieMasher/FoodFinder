import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text
} from '@chakra-ui/react';

function ChatDetail({ chatId, onClose }) {
  const [chat, setChat] = useState(null);

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem('chats')) || {};
    setChat(chats[chatId]);
  }, [chatId]);

  // TODO: Sort this "full" so that it looks good for large screens as well.
  return (
    <Modal size="full" isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{chat?.name || "Chat"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {chat?.messages.map((msg, index) => (
            <Box key={index} bg="gray.100" p={3} my={2} borderRadius="md">
              <Text>{msg.text}</Text>
              <Text fontSize="sm" color="gray.600">{new Date(msg.timestamp).toLocaleString()}</Text>
            </Box>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ChatDetail;