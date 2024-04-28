import { IoClose } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import logo from "./assets/Prince.png";
import { getDistance, convertDistance } from 'geolib';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { useState, useEffect } from "react";
import "./styles/Card.css"

export default function Restaurant({ data, userLocation, handleDislike, handleLike, className }) {
  const [dragDirection, setDragDirection] = useState(null); // Track the direction of the drag, defaulting to no direction
  const [{ x, opacity }, set] = useSpring(() => ({ x: 0, opacity: 1 }));

  const bind = useDrag(({ down, movement: [mx], direction: [xDir], distance }) => {
    // Update the drag direction immediately upon moving, and maintain it unless the drag ends
    if (down && distance > window.innerWidth * 0.05) {
      if (dragDirection === null || distance > window.innerWidth * 0.15) {
        setDragDirection(xDir > 0 ? 'right' : 'left');
      }
    } else if (!down) {
      setDragDirection(null); // Reset the drag direction when the drag ends
    }

    // If drag distance is >15%
    if (down && distance > window.innerWidth * 0.15) {
      if (xDir < 0) handleDislike(data.id); // To left
      else if (xDir > 0) handleLike(data.id); // To right
    }

    set({ x: down ? mx : 0 });
  });

  // Reset the position and opacity when not dragging
  useEffect(() => {
    if (!opacity.get()) {
      set({ opacity: 1, x: 0 });
    }
  }, [opacity, set]);

  // Extract details from data prop for use in the component
  const {
    id,
    displayName: { text: name = 'Restaurant' },
    photos,
    location: { latitude, longitude }
  } = data;

  const imageUrl = photos.length > 0
    ? `https://places.googleapis.com/v1/${photos[0].name}/media?key=${import.meta.env.VITE_PLACES_API_KEY}&maxWidthPx=900`
    : logo;

  const distance = Math.round(
    convertDistance(getDistance({ latitude: userLocation.latitude, longitude: userLocation.longitude }, { latitude, longitude }), 'mi') * 10) / 10;

  return (
    <animated.div className={`restaurant_card ${className}`} {...bind()} style={{ x }}>
      {dragDirection === 'right' && <IoMdHeart className="like_icon_overlay" />} 
      {dragDirection === 'left' && <IoClose className="dislike_icon_overlay" />}
      <img className="restaurant_pic" src={imageUrl} alt={name} onDragStart={e => e.preventDefault()} />
      <div className="restaurant_card_header_container">
        <h2>{name}</h2>
        <h4>{distance} miles</h4>
      </div>
      <div className="restaurant_card_icon_container">
        <IoClose className="restaurant_icon dislike_icon" onClick={() => handleDislike(id)} />
        <IoMdHeart className="restaurant_icon like_icon" onClick={() => handleLike(id)} />
      </div>
    </animated.div>
  );
}