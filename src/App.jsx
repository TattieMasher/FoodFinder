import { IoIosSettings } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";
import Restaurant from './restaurant';
import './styles/App.css';

function App() {
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
