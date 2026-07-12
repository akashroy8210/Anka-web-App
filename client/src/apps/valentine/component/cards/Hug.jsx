import React, { useEffect, useRef, useState } from "react";
import letterHug from "../../assets/image/letterHug.png"; // ✅ FIXED
const musicFile = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3";

function Hug({ config = {} }){
  const hugIntro = config.hugIntro || "For a moment that feels like a hug...";
  const hugTitle = config.hugTitle || "A Hug For You 🤍";
  const hugDesc = config.hugDesc || "Not every hug is made with arms. Some are made with presence, patience, and the quiet promise that you are never alone. If this moment could wrap around you — consider it a gentle hug.";
  const hugBtn = config.hugBtn || "Feel the Hug 💞";

const [intro,setIntro] = useState(true);
const [zoom,setZoom] = useState(false);
const [reveal,setReveal] = useState(false);

const audioRef = useRef(null);


// Film intro disappears
useEffect(()=>{

setTimeout(()=>{
  setIntro(false);
},2200);

},[]);


// Play soft music
const playMusic = ()=>{

if(!audioRef.current) return;

audioRef.current.volume = 0;

audioRef.current.play();

let vol = 0;

const fade = setInterval(()=>{

 if(vol < 0.35){
   vol += 0.02;
   audioRef.current.volume = vol;
 }else{
   clearInterval(fade);
 }

},200);

};


// CLICK LETTER (shared transition illusion)

const openHug = ()=>{

playMusic();
setZoom(true);

setTimeout(()=>{
setReveal(true);
},900);

};



const particles = Array.from({length:18});

return(

<div className="
relative h-screen
flex items-center justify-center
overflow-hidden
bg-[#FFF1F5]
">

<audio ref={audioRef} src={musicFile} loop />

{/* PARALLAX LIGHT */}
<div className="
absolute
w-225
h-225
bg-[#FFD6E0]
rounded-full
blur-[160px]
opacity-60
animate-glow
"/>

<div className="
absolute
w-150
h-150
bg-pink-200
rounded-full
blur-[140px]
opacity-50
top-[20%]
left-[60%]
animate-glow
"/>



{/* FLOATING WARM PARTICLES */}
{
particles.map((_,i)=>(
<span
key={i}
className="absolute text-pink-300 animate-particle"
style={{
left:`${Math.random()*100}%`,
fontSize:`${10+Math.random()*14}px`,
animationDuration:`${7+Math.random()*6}s`
}}
>
✨
</span>
))
}



{/* FILM INTRO */}

{
intro && (

<div className="
absolute inset-0
bg-black
flex items-center justify-center
text-white
text-4xl
font-serif
animate-film
z-50
">
{hugIntro}
</div>

)
}



{/* LETTER */}

{
!reveal && !intro && (

<img
src={letterHug}
onClick={openHug}
className={`
w-105
cursor-pointer
transition
duration-700
hover:scale-105
${zoom ? "animate-zoom" : ""}
`}
/>

)
}



{/* HUG REVEAL */}

{
reveal && (

<div className="
text-center
animate-film
max-w-2xl
px-6
">

<h1 className="
text-6xl
font-serif
text-[#402B2B]
mb-6
">
{hugTitle}
</h1>

<p className="
text-lg
leading-relaxed
text-[#5C4444]
">
{hugDesc}
</p>


<button className="
mt-10
px-10 py-4
rounded-full
bg-inear-to-r
from-pink-300
to-rose-300
text-[#402B2B]
font-semibold
transition
duration-500
hover:scale-110
hover:shadow-[0_20px_60px_rgba(255,143,177,.5)]
active:scale-95
">
{hugBtn}
</button>

</div>

)
}

</div>
);
}

export default Hug;
