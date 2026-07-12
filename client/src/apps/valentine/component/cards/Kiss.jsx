import FilmIntro from "../FilmIntro";
import Hero from "../Hero";
import ParticlesBg from "../ParticlesBg";
import Slideshow from "../Slideshow";
import MemoryCards from  '../MemoryCards'
import { useRef, useState } from "react";
import Timeline from "../Timeline";
const promise = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
export default function Kiss() {

  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="bg-black overflow-x-hidden">
      <ParticlesBg />
      <FilmIntro />
      <Hero />
      <MemoryCards />
      <Timeline />
      <Slideshow />

      {/* Music Button */}
      <audio ref={audioRef} src={promise}  loop />
      
      <button
        onClick={toggleMusic}
        className="absolute cursor-pointer top-6 right-6 bg-[#5C3A2E] text-[#FFF8F0] px-4 py-2 rounded-full hover:scale-105 transition duration-300"
      >
        🎵 Music
      </button>


    </div>
  );
}

