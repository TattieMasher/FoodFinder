import { IoIosSettings } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import Restaurant from './restaurant';
import './styles/App.css';
import { useState, useEffect } from "react";
import axios from 'axios';

const fetchNearbyRestaurants = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = import.meta.env.VITE_PLACES_API_KEY; // Taken from .env in root of project
        const apiUrl = 'https://places.googleapis.com/v1/places:searchNearby'; // Places (New) endpoint

        const requestBody = {
          includedTypes: ["restaurant"],
          locationRestriction: {
            circle: {
              center: { latitude, longitude },
              radius: 1500.0
            }
          }
        };

        try {
          const response = await axios.post(apiUrl, requestBody, {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask': 'places.id,places.formattedAddress,places.location,places.displayName,places.googleMapsUri,places.priceLevel,places.websiteUri'
            }
          });

          console.log("API response: ", response.data);
          resolve(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error.response ? error.response.data : error);
          reject(error);
        }
      }, (error) => {
        console.error('Geolocation not supported.', error);
        reject(error);
      });
    } else {
      reject(new Error("Geolocation not supported."));
    }
  });
};

function App() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      const fetchedRestaurants = await fetchNearbyRestaurants();
      setRestaurants(fetchedRestaurants);
      console.log("Restaurants retrieved: ", fetchedRestaurants); // Help here, GPT
    };
  
    getRestaurants();
  }, []);

  return (
    <div className="app_container">
      <div className="app_icon_container">
        <IoIosSettings className="app_icon"></IoIosSettings>
        <IoChatbubblesOutline className="app_icon"></IoChatbubblesOutline>
      </div>
      <div className="restaurant_card_container">
        <Restaurant />
      </div>
    </div>
  )
}

export default App
