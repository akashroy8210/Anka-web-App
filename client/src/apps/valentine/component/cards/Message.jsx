import React from 'react'

function Message() {

    const sendMessage=()=>{
        
    }
    return (
        <div className='bg-[#3f556f]  min-h-screen min-w-full flex bg-cover items-center  justify-center'>
            <div className='bg-[#2b283d] p-5 shadow-2xl min-w-md min-h-80' >
                <h1 className='text-3xl text-[#d5c7ba] text-center mb-2'>Hello Baby </h1>
                <p className='text-[#d5c7ba9c] mb-4 capitalize '>this is your time what you want to say after seeing this type in the box</p>
                <form onSubmit={sendMessage} className='flex flex-col gap-4'>
                    <textarea name="message" id="" className='border border-gray-200 w-full text-[#d5c7ba] p-2 text-lg shadow-2xl'></textarea>
                    <button type='submit' className='w-full p-5 bg-[#d5c7ba]'>Send</button>
                </form>
            </div>

        </div>
    )
}

export default Message
