import logo from './logo.svg';
import './App.css';
import React , {useState , useEffect} from 'react' 
import {io} from "socket.io-client"


function App() {
  const [message, setMessage] = useState('');  // Store the message typed by the user
  const [number, setNumber] = useState(''); 
  const [receivedMessage , setReceivedMessage] = useState('');
  const [receivedNumber , setReceivedNumber] = useState('');
  const [socket , setSocket] = useState(null); 


  useEffect(()=> {
    // Connecting to Flask Using Socket IO
    const newSocket = io("http://localhost:5000" , { 
      
    }); 

    //reconnectionAttempts : 3 , 
    // timeout: 10000,

    newSocket.on("connect" , () => {
      console.log('Connected to Flask Web Socket server') 
    })

    // Listening for messages from flask (my_event_response)
    newSocket.on("my_event_response" , (data) => {
      console.log('Received message from flask:', data)
      setReceivedMessage(data); 
    }) ;

    newSocket.on("my_event_number" , (number) => {
      console.log('Received number from flask:',number)
      setReceivedNumber(number);  
    })
 
    setSocket(newSocket);

    return () => {
      console.log("Clean up function called");
      newSocket.disconnect();
    }
  } , [])   

  const sendMessage = () => { 
    if (message && socket){
      console.log(socket); 
      console.log('Sending message to flask:',message)
      socket.emit("my_event" , message);  
      setMessage(""); 
    }
  }

  const sendNumber = () => {
    if (number && socket){
      socket.emit("my_number" , number) ; 
    }
  }


  return (
    <div className="App">
      <h1>React socket.IO Client</h1> 

      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter Message'></input>

      <br></br>
      <br></br>

      <button onClick={sendMessage}>Send</button>

      <br></br>
      
      <div>
        <h2>Message From Flask:</h2> 
        <p>{receivedMessage}</p>  {/* Display the message received from Flask */}
      </div>

      <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder='Enter Number'></input>

      <br></br>
      <br></br>

      <button onClick={sendNumber}>Send Number</button>

      <br></br>
      
      <div>
        <h2>Number From Flask:</h2> 
        <p>{receivedNumber}</p>  
      </div>


    </div>
  );
}

export default App;
