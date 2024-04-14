import { IoClose } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import logo from "./assets/Prince.png"; // TODO: Change me, will be loaded from API later
import "./styles/Card.css"

export default function Restaurant() {
  return (
    <div className="restaurant_card">
      <img className="restaurant_pic" id="restaurant_pic_1" src={logo}></img>
      <div className="restaurant_card_header_container">
        <h2>Restaurant name</h2>
        <h3>0.1 miles</h3>
      </div>
      <div className="restaurant_card_icon_container">
        <IoClose className="restaurant_icon dislike_icon"></IoClose>
        <IoMdHeart className="restaurant_icon like_icon"></IoMdHeart>
      </div>
    </div>
  )
}