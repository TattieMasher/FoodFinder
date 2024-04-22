import { IoClose } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import logo from "./assets/Prince.png";
import { getDistance, convertDistance } from 'geolib';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import "./styles/Card.css"

export default function Restaurant({ data, userLocation, handleDislike, className }) {
  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
    if (down && distance > window.innerWidth * 0.075) {
      // if dragged more than 7.5% to the left, trigger dislike. Seems best through experimentation.
      if (xDir < 0) {
        handleDislike();
        cancel();
      }
    }
    set({ x: down ? mx : 0 });
  });

  // Destructure the necessary details from the data prop.
  const {
    displayName, // displayName is an object with text and languageCode
    formattedAddress,
    googleMapsUri,
    location, // This is an object with latitude and longitude
    photos, // Array of photos
  } = data;

  // Handle the displayName object
  const name = displayName && displayName.text ? displayName.text : 'Restaurant';

  // Handle the imageUrl
  // Use the Google Place Photo API to construct the URL for the image (https://developers.google.com/maps/documentation/places/web-service/place-photos)
  const apiKey = import.meta.env.VITE_PLACES_API_KEY; // Grab API key from .env again
  const imageUrl = photos && photos.length > 0
    ? `https://places.googleapis.com/v1/${photos[0].name}/media?key=${apiKey}&maxWidthPx=900`
    : logo; // Use the first photo reference or fallback to the logo (TODO: Change. Maybe make a "No image found" image?)

  const restaurantCoords = { // Construct user location object
    latitude: data.location.latitude,
    longitude: data.location.longitude
  };

  const userCoords = { // Construct restaurant location object
    latitude: userLocation.latitude,
    longitude: userLocation.longitude
  };

  const distance = Math.round(
    convertDistance( 
      getDistance( // Get the geolib distance between the two points
        userCoords,
        restaurantCoords
  ), 'mi') * 10) / 10; // Convert to miles, then round to 1 d.p.

  console.log("User location: ", userCoords);
  console.log("Restaurant location: ", restaurantCoords);

    return (
      <animated.div
      className={`restaurant_card ${className}`}
      {...bind()}
      style={{ x }}
    >
      <img className="restaurant_pic" 
        src={imageUrl} 
        alt={data.displayName.text} 
        onDragStart={(e) => e.preventDefault() // stops the default image dragging and allows the card to be dragged from here
      } />
      <div className="restaurant_card_header_container">
        <h2>{name}</h2>
        <h4>{distance} miles</h4>
      </div>
      <div className="restaurant_card_icon_container">
        <IoClose className="restaurant_icon dislike_icon" onClick={handleDislike} />
        <IoMdHeart className="restaurant_icon like_icon" />
      </div>
    </animated.div>
  );
}