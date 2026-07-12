import './App.css'
import LandingPage from './component/Landing Page/LandingPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Teddy, Choclate, Love, Promise, Valentine, Hug, Kiss, Propose } from './component/cards'
import GlobalEffects from './component/GlobalEffects'
import MusicPlayer from "./component/MusicPlayer";
import ValentineWeek from "./component/ValentineWeek";
import Message from './component/cards/Message';

function App() {
  return (
    <GlobalEffects>
      <MusicPlayer />
      <LandingPage />
    </GlobalEffects>
  );
}

export default App



