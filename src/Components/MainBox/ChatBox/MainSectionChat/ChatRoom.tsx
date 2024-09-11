import { useState, useEffect, useRef } from 'react';
import "./ChatRoom.css";
import EmojiPicker from "emoji-picker-react";

interface Message {
   receiver: string;
   text: string;
   date: string;
   sender: string;
   id: number;
}
interface ChatRoomState {
   openEmoji: boolean;
   textEmoji: string | any;
   messages: Message[] | any;
   blockUser: boolean;
}
interface MessageAPI {
   receiver: string;
   text: string;
   date: string;
   sender: string;
   id: number;
}
export default function ChatRoom({ show, contact, sender, contactColors, token }: any) {
   // chat Room states:
   const [state, setState] = useState<ChatRoomState>({
      openEmoji: false,
      textEmoji: "",
      messages: [],
      blockUser: false,
   });

   if (show && contact) {
      if (state.blockUser === false) {
         // fetch API
         const fetchChats = async () => {
            const url = "https://farawin.iran.liara.run/api/chat";
            const token = "JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTAwMDAwMDAwMCUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyMTIzNDU2NzhBYSU0MCUyMiUyQyUyMm5hbWUlMjIlM0ElMjIlRDklODElRDglQjElRDglQTclRDklODglREIlOEMlRDklODYlMjIlMkMlMjJkYXRlJTIyJTNBJTIyMjAyMy0xMC0yNVQwNCUzQTIyJTNBNTYuODMzWiUyMiU3RA==";
            try {
               const response = await fetch(url, {
                  method: 'GET',
                  headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json'
                  }
               });
               if (!response.ok) {
                  throw new Error("اینترنت شما مشکل داره و درخواست شما  برای گرفتن چت ها انجام نشده");
               }
               const data = await response.json();
               setState(prev => ({ ...prev, messages: data.chatList }));
               return data
            } catch (error) {
               console.error('مشکلی در fetch کردن به وجود اومده', error);
            }
         }; fetchChats();
      }

      // This section is for going to the last message continuously

      //   const lastMessageRef = useRef<HTMLDivElement | null>(null);
      //   useEffect(() => {
      //      if (lastMessageRef.current) {
      //         lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      //      }
      //   }, [state.messages])




      // Handle emoji in sand message section , in input
      const EmojisSetValueInput = (e: any) => {
         setState(prev => ({ ...prev, textEmoji: prev.textEmoji + e.emoji }));
      };

      // main section for message sander
      
      const sandMessege = async () => {
         if (state.textEmoji) {
             const newMessage = {
                 receiver: contact.username,
                 text: state.textEmoji,
                 date: new Date().toISOString(),
                 sender: sender,
                 id: state.messages.length + 1
             };
 
             setState(prev => ({
                 ...prev,
                 messages: [...prev.messages, newMessage],
                 textEmoji: ""
             }));
             const token = "JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTAwMDAwMDAwMCUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyMTIzNDU2NzhBYSU0MCUyMiUyQyUyMm5hbWUlMjIlM0ElMjIlRDklODElRDglQjElRDglQTclRDklODglREIlOEMlRDklODYlMjIlMkMlMjJkYXRlJTIyJTNBJTIyMjAyMy0xMC0yNVQwNCUzQTIyJTNBNTYuODMzWiUyMiU3RA==";
 
             await fetch('https://farawin.iran.liara.run/api/chat', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`,
                 },
                 body: JSON.stringify({
                     contactUsername: contact.username,
                     textHtml: state.textEmoji
                 })
             });
         }
     };
      // block handler function
      const blockHandle = () => {
         setState(prev => ({ ...prev, blockUser: !prev.blockUser }));
      };

      const messageContact = state.messages.map((massege: MessageAPI) => {
         const Sender = massege.sender === sender;
         return (
            <div className={`Massages ${Sender ? 'sander-container' : 'Riciver-container'}`}>
               <div className={`${Sender ? 'avetar-hidden' : 'avetar-show'}`}>{Sender ? '' : 's'}</div>
               <div className='texts'>
                  <p className={` ${Sender ? 'sander-massege' : 'riciver-massege'}`}>{massege.text}</p>
                  <span className={`${Sender ? 'time-right' : 'time-left'}`}>14:45</span>
               </div>
            </div>
         )
      });

      // elements ...
      return (
         // top section or chat information
         <div className="Chat-section">
            <div className="chat-info">
               <div className="user-chat">
                  <div className="user-avatar" style={{ backgroundColor: contactColors }}>{contact.name.charAt(0)}</div>
                  <div className="information">
                     <div className="user-name">{contact.name}</div>
                     <div className="user-number">{contact.username}</div>
                  </div>
               </div>
               <button className="block-user" onClick={blockHandle}><i className="fa-solid fa-user-lock"></i> مسدود</button>
            </div>

            {/* chats ce\\section or sander reciver chat */}
            <div className="chat-persons">
               {messageContact}
            </div>

            {/* Down section or sand text section */}
            {!state.blockUser ? (
               <div className="sand-message">
                  <i className="fa-solid fa-paper-plane" onClick={sandMessege}></i>
                  <div className="emoji">
                     <i className="fa-regular fa-face-laugh-beam" onClick={() => setState(prev => ({ ...prev, openEmoji: !prev.openEmoji }))}></i>
                     <div className="picker">
                        <EmojiPicker open={state.openEmoji} onEmojiClick={EmojisSetValueInput} />
                     </div>
                  </div>
                  <input type="text" placeholder="پیام خود را ارسال کنید" className="text-input" onChange={(e) => setState(prev => ({ ...prev, textEmoji: e.target.value }))} value={state.textEmoji} onKeyDown={(e) => { (e.key === 'Enter') ? (e.preventDefault(), sandMessege()) : ('') }} />
                  <span className="material-symbols-outlined icon-attach">attach_file</span>
               </div>
            ) : (
               <div className="sand-message blocked" onClick={blockHandle}>رفع مسدودیت</div>
            )}
         </div>
      )

   } else {
      return (
         <div className="Chat-section no-chat"><div className="No-chat-img"></div></div>
      );
   }
}