import React, { useState } from 'react'
const img1 = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600";
const img2 = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=600";
const img3 = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600";
const img4 = "https://images.unsplash.com/photo-1501908734255-16579c18c25f?auto=format&fit=crop&q=80&w=600";
import LandingPage from './LandingPage';
function Happy() {
  const [back,setBack]=useState()
  if(back==="better"){
    return(
      <LandingPage/>
    )
  }

  return (
    <div className='bg-linear-to-t from-[#eea7cb] to-pink-200 h-screen flex flex-col relative bg-cover items-center justify-center'>
      <h1 className='text-3xl font-bold fixed top-20'>For You Baby (-ve♥️)💕</h1>
      
      <div className='bg-[#fff8e7] flex flex-col rounded-2xl w-200 p-5 border-2 border-[#e450b3]'>
        <h2 className='text-2xl p-2 border-b-2 border-[#eea2a2]  text-center  font-bold  font-[Great_Vibes] '>Meri Babu Kya ho gya babu💕
          <span className='block'>Lo ye dekho aap Babu </span>
        </h2>
        <div className='grid grid-flow-col grid-rows-2 gap-5 items-center justify-center p-5 '>
            <img src={img1} className='w-50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ' alt="" />
            <img src={img2} className='w-50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110' alt="" />
            <img src={img3} className='w-70 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110' alt="" />
            <img src={img4} className='w-70 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ' alt="" />
        </div>
        <button onClick={()=>{
          setBack("better")
        }} className='px-10 py-3 cursor-pointer bg-[#ffccd5] rounded-full shadow-lg text-[#590d22] font-bold'>Yes i will be your Valentine 🙈</button>
      </div>
    </div>
  )
}

export default Happy
