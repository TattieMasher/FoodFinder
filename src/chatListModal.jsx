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
import ChatDetail from './chatDetail';

function ChatList({ isOpen, onClose }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const loadChats = () => {
      const chatData = JSON.parse(localStorage.getItem('chats')) || {};
      setChats(Object.entries(chatData).filter(([_, data]) => data.liked));
    };

    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  const openChat = (id) => {
    setSelectedChat(id);
  };

  const handleModalClose = () => {
    setSelectedChat(null);
    onClose();
  };

  if (selectedChat) {
    return <ChatDetail chatId={selectedChat} onClose={() => setSelectedChat(null)} />;
  }
  
// TODO: Sort this "full" so that it looks good for large screens as well.
  return (
    <Modal size="full" isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chats</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={3}>
            {chats.length > 0 ? chats.map(([id, chat]) => (
              <ListItem key={id} onClick={() => openChat(id)} cursor="pointer">
                <strong>{chat.name}</strong>
              </ListItem>
            )) : <p>No active chats</p>}
          </List>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ChatList;