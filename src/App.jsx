import { ChakraProvider } from '@chakra-ui/react';

import { IoIosSettings } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import Restaurant from './restaurant';
import SettingsModal from './settingsModal';
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

            setRestaurants(response.data.places || []);
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

  const handleDislike = (id) => {
    updateLikesDislikes(id, false);
    console.log("Index: ", currentIndex);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= restaurants.length - 1) {
        // If we've reached the end, we could loop back to the start or handle the "end" state.
        console.log("End of the list reached");
        return prevIndex; // Maintain the current index if at the end of the list
      } else {
        return nextIndex; // Increment the index
      }
    });
  };

  const handleLike = (id) => {
    updateLikesDislikes(id, true);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= restaurants.length - 1) {
        // If we've reached the end, we could loop back to the start or handle the "end" state.
        console.log("End of the list reached");
        return prevIndex; // Maintain the current index if at the end of the list
      } else {
        return nextIndex; // Increment the index
      }
    });
  };

  if (isLoading) { // Notify user that page hasn't been processed yet
    return <div>Loading...</div>;
  }

  return (
    <ChakraProvider>
      <div className="app_container">
        <div className="app_icon_container">
          <IoIosSettings className="app_icon" onClick={() => setSettingsOpen(true)} />
          <IoChatbubblesOutline className="app_icon" />
        </div>
        <div className="restaurant_card_container">
          {restaurants.length > 0 && currentIndex < restaurants.length && (
            <>
              {currentIndex < restaurants.length - 1 && (
                // Render the next restaurant beneath the current one
                <Restaurant
                  key={`next_${restaurants[currentIndex + 1].id}`}
                  data={restaurants[currentIndex + 1]}
                  userLocation={userLocation}
                  handleDislike={handleDislike} // Pass the handleDislike function
                  handleLike={handleLike} // Pass handleLike also
                  className="next"
                />
              )}
              <Restaurant
                key={`current_${restaurants[currentIndex].id}`}
                data={restaurants[currentIndex]}
                userLocation={userLocation}
                handleDislike={handleDislike} // Pass the handleDislike function down
                handleLike={handleLike} // Pass handleLike also
                className="current"
              />
            </>
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
