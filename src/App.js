import React, { useState, useEffect } from "react";
import { FormControl, Input } from "@material-ui/core";
import "./App.css";
import Message from "./components/Message/Message";
import db from "./firebase";
import firebase from "firebase/app";
import FlipMove from "react-flip-move";
import SendIcon from "@material-ui/icons/Send";
import { IconButton } from "@material-ui/core";

function App() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    db.collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // console.log(snapshot.docs.map((doc) => doc.data()));
        setMessage(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            message: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    setUsername(prompt("Enter Your Username"));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("messages").add({
      message: input,
      username,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="App">
      <img
        src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100"
        alt="Facebook Messenger Logo"
      />
      <h1>Facebook Messenger</h1>
      {username ? <h2>Welcome {username}</h2> : null}
      <form className="AppForm">
        <FormControl className="AppFormControl">
          <Input
            className="AppInput"
            placeholder="Type a message.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <IconButton
            className="AppIconButton"
            variant="contained"
            disabled={!input}
            color="primary"
            type="submit"
            onClick={sendMessage}
          >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>
      <FlipMove>
        {message.map(({ message, id }) => {
          return <Message message={message} username={username} key={id} />;
        })}
      </FlipMove>
    </div>
  );
}

export default App;
