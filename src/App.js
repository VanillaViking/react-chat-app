import './App.css';
import { useState, useEffect } from "react";

const ws = new WebSocket('ws://182.239.143.172:9000');

function Loading() {
  return (
    <div>
      <h1>Loading please wait</h1>
    </div>
  );
}

function EnterName(props) {
  
  return (
    <div>
      <h1>Enter Name</h1>
      <input onChange={(event) => props.setName(event.target.value)}></input>

      <button onClick={props.handleClick}>Submit</button>
    </div>
  );
}

function Lobby(props) {

  return (
    <div className="grid-container">
      <div className="heading"> 
        Lobby
      </div>
      <div className="lobby">
        Users:
        <ul>
          {props.players}
        </ul>
      </div>
      <div className="text">
        <ul>
          {props.chat.split("|").map((i) => <li>{i}</li>)}
        </ul>
      </div>

      <div id="foot" className="footer">
        <input value={props.text} onChange={(event) => props.setText(event.target.value) }></input><button onClick={props.handleSend}>Send</button>
      </div>
    
    </div>
  );
}


function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState('');
  const [text, setText] = useState('');


  useEffect(() => {
    ws.addEventListener('open', () => setLoading(false));
    ws.addEventListener('message', (msg) => {
      console.log(msg.data);
      let message = JSON.parse(msg.data);

      switch (message.type) {
        case 'list':
          setPlayers(message.list.map(i => <li>{i}</li>))
          break;
        case 'outText':
          setChat(c => c + "|" +message.text);
          break;
        default:
          console.log(message.type);
          
      }
    })
  }, [])

  const handleClick = () => {
    if (name === '') {
      return;
    }
    ws.send(JSON.stringify({type: 'name', name: name}));
    setDone(true);
  }

  const handleSend = () => {
    if (text === '') {
      return;
    }
    ws.send(JSON.stringify({type: 'inText', name: name, text: text}));
    setText('');
  }

  return (
    <div className="App">
        {
          loading ? <Loading /> :
            done ? 
            <Lobby players={players} chat={chat} setText={setText} text={text} handleSend={handleSend}/> : 
              <EnterName handleClick={handleClick} setName={setName} />}
    </div>
  );
}


export default App;
