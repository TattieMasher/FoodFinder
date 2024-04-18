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
              'X-Goog-FieldMask': 'places.id,places.formattedAddress,places.location,places.displayName,places.googleMapsUri,places.priceLevel,places.websiteUri,places.photos'
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [isLoading, setLoading] = useState(true);

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
                radius: 1500.0
              }
            }
          };

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

  const handleDislike = () => {
    // If not at the end
    if (currentIndex < restaurants.length - 1) {
      console.log("index: ", currentIndex);
      setCurrentIndex(prevIndex => prevIndex + 1); // TODO: Apply CSS Transform slide to side
    } else {
      // TODO: Special card once reached the end?
      console.log("No more restaurants");
    }
  };

  if (isLoading) { // Notify user that page hasn't been processed yet
    return <div>Loading...</div>;
  }

  return (
    <div className="app_container">
      <div className="app_icon_container">
        <IoIosSettings className="app_icon" />
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
                className="next"
              />
            )}
            <Restaurant
              key={`current_${restaurants[currentIndex].id}`}
              data={restaurants[currentIndex]}
              userLocation={userLocation}
              handleDislike={handleDislike} // Pass the handleDislike function down
              className="current"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
