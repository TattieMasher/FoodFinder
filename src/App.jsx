import { ChakraProvider } from '@chakra-ui/react';

import { IoIosSettings } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";

import Restaurant from './restaurant';
import SettingsModal from './settingsModal';
import MatchModal from './matchModal';

import './styles/App.css';

import { useState, useEffect } from "react";
import axios from 'axios';

const getRadius = () => localStorage.getItem('searchRadius') || '2'; // Default to 2 if not set
const setRadius = (radius) => localStorage.setItem('searchRadius', radius);

const getLikesDislikes = () => JSON.parse(localStorage.getItem('likesDislikes')) || {};
const updateLikesDislikes = (id, like) => {
  const current = getLikesDislikes();
  const updated = { ...current, [id]: like };
  localStorage.setItem('likesDislikes', JSON.stringify(updated));
};

const convertMilesToMetres = (num) => {
  return num * 1609;
}

function App() {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [searchRadius, setSearchRadius] = useState(getRadius());
  const [restaurants, setRestaurants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setRadius(searchRadius);
  }, [searchRadius]);

  useEffect(() => {
    const getRestaurants = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude }); // Save user location
          const apiKey = import.meta.env.VITE_PLACES_API_KEY;
          const apiUrl = 'https://places.googleapis.com/v1/places:searchNearby';

          const requestBody = {
            includedTypes: ["restaurant"],
            locationRestriction: {
              circle: {
                center: { latitude, longitude },
                radius: convertMilesToMetres(parseInt(getRadius(), 10))
              }
            }
          };

          console.log("Request body: ", requestBody);

          try {
            const response = await axios.post(apiUrl, requestBody, {
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.formattedAddress,places.location,places.displayName,places.googleMapsUri,places.priceLevel,places.websiteUri,places.photos'
              }
            });

            const likesDislikes = getLikesDislikes(); // Retrieve the current likes/dislikes from localStorage
            const filteredRestaurants = response.data.places.filter(place => !(place.id in likesDislikes));
      
            setRestaurants(filteredRestaurants);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data: ', error);
            setRestaurants([]);
            setLoading(false);
          }
        }, (error) => {
          console.error('Geolocation not supported.', error);
        });
      } else {
        console.error("Geolocation not supported by the browser.");
      }
    };
  
    getRestaurants();
  }, []);

  const handleInteraction = (id, liked) => {
    updateLikesDislikes(id, liked);
  
    setRestaurants(currentRestaurants => {
      const updatedRestaurants = currentRestaurants.filter(restaurant => restaurant.id !== id);
      return updatedRestaurants;
    });
  };
  
  const handleDislike = id => {
    handleInteraction(id, false);
  };
  
  const handleLike = id => {
    handleInteraction(id, true);
    setIsMatchOpen(true); // TODO: Decide where/when to change this
  };

  if (isLoading) { // Notify user that page hasn't been processed yet
    return <div>Loading...</div>;
  }

  const noMoreRestaurantsData = {
    id: "no-more",
    displayName: { text: "No More Restaurants", languageCode: "en" },
    formattedAddress: "You've seen it all!",
    location: { ...userLocation },
    googleMapsUri: "",
    photos: [
      {
        name: "placeholder-image", // TODO: Change to actual placeholder image
      },
    ],
    priceLevel: null,
    websiteUri: null,
  };

  return (
    <ChakraProvider>
      <div className="app_container">
        <MatchModal
          isOpen={isMatchOpen}
          onClose={() => setIsMatchOpen(false)}
        />
        <div className="app_icon_container">
          <IoIosSettings className="app_icon" onClick={() => setSettingsOpen(true)} />
          <IoChatbubblesOutline className="app_icon" />
        </div>
        <div className="restaurant_card_container">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <Restaurant
              key={restaurant.id}
              data={restaurant}
              userLocation={userLocation}
              handleDislike={handleDislike} 
              handleLike={handleLike}
              className={index === currentIndex ? "current" : "next"}
            />
          ))
        ) : (
          // Render the no more restaurants card
          <Restaurant
            key={noMoreRestaurantsData.id}
            data={noMoreRestaurantsData}
            userLocation={userLocation}
            // no handleDislike or handleLike because this card is not interactable
            className="current"
          />
        )}
      </div>
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setSettingsOpen(false)} 
          searchRadius={searchRadius}
          setSearchRadius={setSearchRadius}
        />
      </div>
    </ChakraProvider>
  );
}

export default App;
