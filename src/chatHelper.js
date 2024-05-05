export const initialiseChat = (restaurantId, restaurantData) => {
  const chats = JSON.parse(localStorage.getItem('chats')) || {};
  const initialMessage = {
    text: `Located at ${restaurantData.formattedAddress}. Check us out on Google Maps: ${restaurantData.googleMapsUri}`,
    timestamp: new Date().toISOString()
  };

  // Initialise chat if it does't exist
  if (!chats[restaurantId]) {
    chats[restaurantId] = {
      name: restaurantData.displayName.text, // Store the restaurant name separately, TODO: to use as a header when the chat list is sorted
      liked: true,
      messages: [initialMessage]
    };
  } else {
    chats[restaurantId].name = restaurantData.displayName.text;
    
    // If already liked but no messages, just in case (shouldn't happen)
    if (chats[restaurantId].liked && chats[restaurantId].messages.length === 0) {
      chats[restaurantId].messages.push(initialMessage);
    }
  }

  localStorage.setItem('chats', JSON.stringify(chats));
};