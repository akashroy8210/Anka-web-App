import React, {useState, useRef} from "react";
import paper from '../../assets/image/paper.jpg';
const baby1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function Promise({ config = {} }){
  const promiseTitle = config.promiseTitle || "My Promise";
  const promiseSub = config.promiseSub || "I promise to stand beside you in every chapter we write...";
  const promisePoints = config.promisePoints || "I promise you babu hum gussa nahi karenge agar kuch hota hia bhi to hum aapko samjhane ki koshish karenge pehle,";

const [open,setOpen] = useState(false);
const audioRef = useRef(null);


// music fade-in
const playMusic = ()=>{

if(!audioRef.current) return;

audioRef.current.volume = 0;
audioRef.current.play();

let vol = 0;

const fade = setInterval(()=>{
 if(vol < 0.4){
   vol += 0.02;
   audioRef.current.volume = vol;
 }else{
   clearInterval(fade);
 }
},200);

};


const openEnvelope = ()=>{
setOpen(true);
playMusic();
};


const petals = Array.from({length:18});

return(

<div
className="h-screen flex items-center justify-center relative overflow-hidden"
style={{
backgroundImage:`url(${paper})`,
backgroundSize:"cover",
backgroundPosition:"center"
}}
>

<audio ref={audioRef} src={baby1} loop />

{/* INK BLEED GLOW */}
<div className="
absolute
w-[600px]
h-[600px]
bg-rose-200
rounded-full
blur-[140px]
opacity-40
"/>


{/* CANDLE LIGHT */}
<div className="
absolute
top-20
right-24
w-28
h-28
bg-orange-300
rounded-full
blur-3xl
opacity-70
animate-flicker
"/>


{/* FALLING PETALS */}

{
petals.map((_,i)=>(
<span
key={i}
className="absolute text-rose-300 animate-petal"
style={{
left:`${Math.random()*100}%`,
fontSize:`${12+Math.random()*18}px`,
animationDuration:`${6+Math.random()*6}s`
}}
>
🌸
</span>
))
}



{/* ENVELOPE */}

<div
onClick={openEnvelope}
className="relative cursor-pointer"
>

{/* body */}
<div className="
w-[360px]
h-[240px]
bg-[#f8d7da]
rounded-md
shadow-xl
"/>

{/* flap */}
<div className={`
absolute top-0
w-0 h-0
border-l-[180px]
border-r-[180px]
border-b-[130px]
border-l-transparent
border-r-transparent
border-b-[#f3b6c0]

${open ? "animate-flap":""}
`}
/>

</div>



{/* LETTER */}

{
open && (

<div className="
absolute
bg-[#fffaf3]
max-w-3xl
p-16
rounded-lg
shadow-[0_20px_60px_rgba(0,0,0,.18)]
animate-letter
">

<h1 className="
text-5xl
mb-8
text-[#3b2f2f]
font-['Dancing_Script']
">
{promiseTitle}
</h1>


<p className="
typewriter
text-xl
text-[#3b2f2f]
mb-6
">
{promiseSub}
</p>


<p className="
text-lg
leading-loose
text-[#3b2f2f]
">

{promisePoints}


</p>


{/* YOUR MESSAGE SPACE */}

<div className="
mt-8
p-6
bg-rose-50
rounded-2xl
italic
text-[#5c4444]
">
✨ I will support you every time what you want to do,
I want to be your strength agar lage ki disturb karte hia to aap mujhe bata dena, I will always be there for you, I promise to make you smile every day, I promise to love you unconditionally, I promise to be your best friend, I promise to grow old with you, I promise to make our love stronger every day.

Not a perfect promise —  
just a real one.
</div>



{/* SIGNATURE */}

<svg
width="180"
height="90"
viewBox="0 0 200 100"
className="mt-10"
>

<path
d="M10 60 Q 95 10 180 60"
stroke="#3b2f2f"
strokeWidth="3"
fill="transparent"
className="animate-sign"
/>

</svg>

</div>

)}

</div>
);
}

export default Promise;
