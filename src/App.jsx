import React from 'react'
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
const PROD_SERVER_URL = "https://crudwebsocketsserver-production.up.railway.app/"
const SERVER_URL = "http://localhost:5000";
const socket = io(PROD_SERVER_URL);

const App = () => {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    handleResponseMessage(newMessage);
    socket.emit('message', message);
  }

  const handleResponseMessage = (responseMessage) => {
    setAllMessages((prevMessages) => [...prevMessages, responseMessage]);
  }

  useEffect(() => {
    socket.on('responseMessage', handleResponseMessage)
    
    return () => {
       socket.off('responseMessage', handleResponseMessage);
    }
  },[]);

  return (
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
        <h1 className='text-2xl font-bold my-2'>Chat React</h1>
        <input type="text" className='border-2 border-zinc-500 p-2 my-3 w-full text-black' onChange={(e) => { setMessage(e.target.value) }} placeholder='Write your message'/>
        <button className="px-4 py-2 font-semibold bg-cyan-500 text-white rounded-full shadow-sm">Send</button>
        <ul>
        {
          allMessages.map((message, index) => (
            <li className={`my-2 p-2 table textsm rounded-md ${message.from === 'Me' ? 'bg-sky-500' : 'bg-green-800 ml-auto'}`} key={index}>
              <span className='text-xs text-slate-200 block'>{message.from}</span>
              {message.body}
            </li>
          ))
        }
      </ul>
      </form>      
    </div>
  )
}

export default App