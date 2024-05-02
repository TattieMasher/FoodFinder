import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  List,
  ListItem
} from '@chakra-ui/react';

function ChatList({ isOpen, onClose }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const loadChats = () => {
      const chatData = JSON.parse(localStorage.getItem('chats')) || {};
      setChats(Object.entries(chatData).filter(([_, data]) => data.liked));
    };

    loadChats();
  }, []);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minH={"400px"}>
        <ModalHeader>Chats</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={3}>
            {chats.length > 0 ? chats.map(([id, chat]) => (
              <ListItem key={id} onClick={() => onClose(id)} cursor="pointer">
                {chat.messages[chat.messages.length - 1].text}
              </ListItem>
            )) : <p>No active chats</p>}
          </List>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ChatList;
