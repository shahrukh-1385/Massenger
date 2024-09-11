import React, { useEffect, useState } from "react";
import "./App.css";
import Contacts from "../MainBox/ContactsBox/MainSectionContacts/Contacts";
import ChatRoom from "../MainBox/ChatBox/MainSectionChat/ChatRoom";
import Login from '../Register/Login/Login';


const App:any = () => {
  const [user, setUser] = useState<any | null>(null);
  const [show, setShow] = useState(false);
  const [userStatus, setUserStatus] = useState(false);
  const [currentContact, setCurrentContact] = useState<any | null>(null);
  const [token, setToken] = useState<any | null>(null);

  const handleShowChats = (contact: any) => {
    setUserStatus(true);
    setShow(true);
    setCurrentContact(contact);
  };

  const handleLogin = (userData: any | null) => {
    setUser(userData);
  };
  const getToken = (Token :any | null) => {
    setToken(Token)
  }
  return (
    <div className='container'>
      {user ? (
        <>
          <Contacts onContactClick={handleShowChats} />
          <ChatRoom show={show} contact={currentContact} sender={user.username} token={token}/>
        </>
      ) : (
        <Login Login={handleLogin} setUserStatus={setUserStatus} getToken={getToken}/>
      )}
    </div>
  );
}

export default App;
