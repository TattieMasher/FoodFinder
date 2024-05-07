// Helper function to randomly select an element from an array
const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

// Arrays for different parts of the message
const greetings = ["Hey", "Hello", "Hi"];
const visitingPhrase = [
  "Come visit me now!",
  "Don't miss out! Come here."
];
const ratingPhrase = [
  "People think I'm a",
  "If I had to rate myself, I'm definitely",
  "On a good day, I'm easily a"
]
const generateDeliveryMessage = () => {
  // TODO: Use delivery, takeout and dineIn for a description message
}
const generateAvailability = (restaurantData) => {
  let availabilityString = "";

  for(let i = 0; i < restaurantData.regularOpeningHours.weekdayDescriptions.length; i++) {
    availabilityString += `${restaurantData.regularOpeningHours.weekdayDescriptions[i]} <br>`;
  }
  return availabilityString;
}

// Function to generate messages based on restaurant data
const generateInitialMessages = (restaurantData) => {
  let pricePhrase;

  switch (restaurantData.priceLevel) {
    case "PRICE_LEVEL_INEXPENSIVE":
      pricePhrase = [
        "I'm cheap and easy.",
        "I'm cheaper than the rest!",
        "don't waste your money elsewhere. I'm one of the cheap ones."
      ];
      break;
    case "PRICE_LEVEL_MODERATE":
      pricePhrase = [
        "let's have a good time, but not break the bank!",
        "I'm enjoyable and affordable.",
        "I'm moderately expensive, but majorly worth it."
      ];
      break;
    case "PRICE_LEVEL_EXPENSIVE":
      pricePhrase = [
        "I'm high class and worth every penny!"
      ];
      break;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      pricePhrase = [
        "if you can't afford me, don't even try!",
        "your wallet better be fat!",
        "you don't just want a date, do you? You want an experience."
      ];
      break;
    default:
      pricePhrase = ["you hungry??"]; // When no price info is available from Google api
  }

  // Build the full messages as an array
  const messages = [
    { text: `${getRandomItem(greetings)}, ${getRandomItem(pricePhrase)}. ${getRandomItem(ratingPhrase)} ${restaurantData.rating * 2}/10.`, timestamp: new Date().toISOString() },
    { text: `I'm at <a href="${encodeURI(restaurantData.googleMapsUri)}" target="_blank">${restaurantData.formattedAddress}</a>. ${getRandomItem(visitingPhrase)}`, timestamp: new Date().toISOString() },
    { text: `Or give me a call on ${restaurantData.nationalPhoneNumber}. You can reach me...`, timestamp: new Date().toISOString() },
    { text: generateAvailability(restaurantData), timestamp: new Date().toISOString() }
    // TODO: use these fields-
    //    rating, dineIn, delivery, takeout, websiteUri, regularOpeningHours
    //    businessStatus (The allowed values include: OPERATIONAL, CLOSED_TEMPORARILY, and CLOSED_PERMANENTLY)
  ];

  return messages;
};

export const initialiseChat = (restaurantId, restaurantData) => {
  const chats = JSON.parse(localStorage.getItem('chats')) || {};
  const initialMessages = generateInitialMessages(restaurantData);

  // Initialise chat if it doesn't exist
  if (!chats[restaurantId]) {
    chats[restaurantId] = {
      name: restaurantData.displayName.text,
      liked: true,
      messages: initialMessages
    };
  } else {
    chats[restaurantId].name = restaurantData.displayName.text;
    
    // Ensure the messages are initialized
    if (chats[restaurantId].liked && chats[restaurantId].messages.length === 0) {
      chats[restaurantId].messages = initialMessages;
    }
  }

  localStorage.setItem('chats', JSON.stringify(chats));
};