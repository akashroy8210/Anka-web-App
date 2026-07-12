import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function Teddy(){

const navigate = useNavigate();
const [spot,setSpot] = useState({x:0,y:0});
  
useEffect(()=>{
const move = e=>{
setSpot({x:e.clientX,y:e.clientY});
};
window.addEventListener("mousemove",move);
return ()=>window.removeEventListener("mousemove",move);
},[]);

return(

<div className="relative h-screen w-full bg-[#0c0707] overflow-hidden flex items-center justify-center">


{/* CURSOR FLASHLIGHT */}
<div
className="pointer-events-none fixed w-80.75 h-80.75 rounded-full"
style={{
left:spot.x-175,
top:spot.y-175,
background:"radial-gradient(circle, rgba(255,182,193,.35), transparent 70%)"
}}
/>


{/* TEDDY SILHOUETTE */}
<img
src="/teddy.png"
alt=""
className="
absolute
w-[500px]
opacity-80
animate-fog
"
/>


{/* TEXT */}

<div className="relative text-center">

<h1 className="
text-6xl
text-pink-100
font-serif
animate-cinema
">
Someone is waiting…
</h1>

<button
onClick={()=>navigate("/love")}
className="

mt-12
px-10 py-4
rounded-full
bg-pink-300
text-black
font-semibold

transition
duration-500
hover:scale-110
hover:shadow-[0_20px_60px_rgba(255,182,193,.6)]
"
>
Go Closer →
</button>

</div>

</div>
);
}

export default Teddy;
