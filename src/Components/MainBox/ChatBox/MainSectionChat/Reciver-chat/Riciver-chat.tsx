import { useState } from "react";
import ChatsLists from "../../../../../../ChatsList";
import './Riciver-chat.css'
const RiciverChat = ({ charName, RelatedChats ,color}: any) => {
   // Mouse Event
   const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
   };
   const chatTime = ChatsLists.chatList;
   const chatR = 
   chatTime.filter((chat) => chat.sender === RelatedChats).map((chat) => {
      const chatDate = chat.date.split("T");
      const time = chatDate[1].split(":");
      const formattedTime = `${time[0]}:${time[1]}`;
      return (
         <div className="MSG" key={chat.id}>
            <div className="msg-container">
               <p className="text recipient" onContextMenu={handleRightClick}>{chat.text}</p>
               <span className="time-text">{formattedTime}</span>
            </div>
            <div className="avatar-chat" style={{ backgroundColor: color }}>{charName ? charName.charAt(0) : ''}</div>
         </div>
      );
   });
   return (
      <div>
         {chatR}
      </div>
      )
}
export default RiciverChat;