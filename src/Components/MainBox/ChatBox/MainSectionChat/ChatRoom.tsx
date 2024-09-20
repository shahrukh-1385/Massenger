import { useState, useEffect, useRef } from 'react';
import "./ChatRoom.css";
import EmojiPicker from "emoji-picker-react";
import { format } from 'date-fns';
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
   const [SelectedMessageId, setSelectedMessageId] = useState<any>();
   const [editMode, setEditMode] = useState(false);
   const [editText, setEditText] = useState<string>('');
   
   const [menuVisible, setMenuVisible] = useState(false);
   const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
   if (show && contact) {
      if (state.blockUser === false) {
         // fetch API
         const fetchChats = async () => {
            const url = "https://farawin.iran.liara.run/api/chat";
            const token = "JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTM2ODE2MzI5NiUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyc2hhaHJ1a2gxMzg1JTIyJTJDJTIybmFtZSUyMiUzQSUyMnNoYWhydWtoJTIyJTJDJTIyZGF0ZSUyMiUzQSUyMjIwMjQtMDgtMThUMTklM0ExOCUzQTI4Ljk0MVolMjIlN0Q=";
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
            const token = "JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTM2ODE2MzI5NiUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyc2hhaHJ1a2gxMzg1JTIyJTJDJTIybmFtZSUyMiUzQSUyMnNoYWhydWtoJTIyJTJDJTIyZGF0ZSUyMiUzQSUyMjIwMjQtMDgtMThUMTklM0ExOCUzQTI4Ljk0MVolMjIlN0Q=";

            try {
               const response = await fetch('https://farawin.iran.liara.run/api/chat', {
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

               switch (response.status) {
                  case 200:
                     console.log("پیام با موفقیت ارسال شد.");
                     if (response.status === 200) {
                        return (
                           <div className={`Messages sander-container`} key={state.messages.id}>
                              <div className={`avatar-hidden`}></div>
                              <div className='texts'>
                                 <p className={`sender-message`}>{state.messages.text}</p>
                                 <span className={`'time-right`}>{new Date(state.messages.date).toLocaleTimeString()}</span>
                              </div>
                           </div>
                        );
                     }
                     break;
                  case 400:
                     console.log("درخواست نادرست است.");
                     break;
                  case 401:
                     console.log("دسترسی غیرمجاز.");
                     break;
                  case 403:
                     console.log("دسترسی ممنوع.");
                     break;
                  case 404:
                     console.log("یافت نشد.");
                     break;
                  case 500:
                     console.log("خطای داخلی سرور.");
                     break;
                  default:
                     console.log("وضعیت ناشناخته.");
               }
            } catch (error) {
               console.error("خطا در ارسال درخواست:", error);
            }

         }

      };
      // block handler function
      const blockHandle = () => {
         setState(prev => ({ ...prev, blockUser: !prev.blockUser }));
      };

      // ContextMenu
      const handleContextMenu = (event: any, messageId: any, messageText:any) => {
         event.preventDefault();
         setMenuPosition({ top: event.clientY, left: event.clientX });
         setMenuVisible(true);
         setSelectedMessageId(messageId);
         setEditText(messageText)
      };

      const handleDeleteMessage = async () => {
         if (!SelectedMessageId) return;
         const token = 'JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTM2ODE2MzI5NiUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyc2hhaHJ1a2gxMzg1JTIyJTJDJTIybmFtZSUyMiUzQSUyMnNoYWhydWtoJTIyJTJDJTIyZGF0ZSUyMiUzQSUyMjIwMjQtMDgtMThUMTklM0ExOCUzQTI4Ljk0MVolMjIlN0Q=';
         try {
            const response = await fetch(`https://farawin.iran.liara.run/api/chat/`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({ id: SelectedMessageId })
            });

            if (!response.ok) {
               throw new Error('مشکل اینترنت وجود دارد');
            }
            const data = await response.json();
            console.log('حذف با موفقیت انجام شد', data);
            setMenuVisible(false);
         } catch (error) {
            console.error('):حذف نشد', error);
         }
      };


      const handleEditMessage = (messageText: string) => {
         setEditMode(true);
     }

     const handleSendEdit = async () => {
      if (!SelectedMessageId) return;
      const token = 'JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTM2ODE2MzI5NiUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyc2hhaHJ1a2gxMzg1JTIyJTJDJTIybmFtZSUyMiUzQSUyMnNoYWhydWtoJTIyJTJDJTIyZGF0ZSUyMiUzQSUyMjIwMjQtMDgtMThUMTklM0ExOCUzQTI4Ljk0MVolMjIlN0Q=';
      try {
          const response = await fetch(`https://farawin.iran.liara.run/api/chat/`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ id: SelectedMessageId, textHtml: editText })
          });
  
          if (!response.ok) {
              throw new Error('مشکل اینترنت وجود دارد');
          }
          const data = await response.json();
          console.log('ویرایش با موفقیت انجام شد', data);
          setEditMode(false);
          setMenuVisible(false);
          setEditText('');
      } catch (error) {
          console.error('ویرایش نشد', error);
      }
  };

      const filterMessageContact = state.messages.filter((message: any) => {
         return (message.sender === sender || message.receiver === sender) &&
            (message.sender === contact.username || message.receiver === contact.username);
      });


      const messageContact = filterMessageContact.length === 0 ? (
         <div className="container-no-messages">
            <div className="no-messages"><span className='text-no-messages'>پیامی ندارید</span></div>
         </div>
      ) : (
         filterMessageContact.map((message: MessageAPI) => {
            const isSender = message.sender === sender;
            const formattedDate = format(new Date(message.date), 'HH:mm');
            return (
               <div className={`Messages ${isSender ? 'sander-container' : 'receiver-container'}`} onContextMenu={(event) => { handleContextMenu(event, message.id, message.text); }} key={message.id}>
                  <div className={`${isSender ? 'avatar-hidden' : 'avatar-show'}`}>
                     {isSender ? '' : contact.name.charAt(0)}
                  </div>
                  <div className='texts'>
                     <p className={`${isSender ? 'sender-message' : 'receiver-message'}`}>{message.text}</p>
                     <span className={`${isSender ? 'time-right' : 'time-left'}`}>{formattedDate}</span>
                  </div>
               </div>
            );
         })
      );

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
                  <i className="fa-solid fa-paper-plane" onClick={editMode ? handleSendEdit : sandMessege }></i>
                  <div className="emoji">
                     <i className="fa-regular fa-face-laugh-beam" onClick={() => setState(prev => ({ ...prev, openEmoji: !prev.openEmoji }))}></i>
                     <div className="picker">
                        <EmojiPicker open={state.openEmoji} onEmojiClick={EmojisSetValueInput} />
                     </div>
                  </div>
                  {editMode ? (
                     <input type="text" placeholder="پیام خود را ویرایش کنید"className="text-input" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { (e.key === 'Enter') ? (e.preventDefault(), handleSendEdit()) : ('') }}/>
                     ) : (
                     <input type="text" placeholder="پیام خود را ارسال کنید" className="text-input" onChange={(e) => setState(prev => ({ ...prev, textEmoji: e.target.value }))} value={state.textEmoji} onKeyDown={(e) => { (e.key === 'Enter') ? (e.preventDefault(), sandMessege()) : ('') }} />
                     )}
                  <span className="material-symbols-outlined icon-attach">attach_file</span>
               </div>
            ) : (
               <div className="sand-message blocked" onClick={blockHandle}>رفع مسدودیت</div>
            )}
            {menuVisible && menuPosition && (
               <div className="context-menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
                  <button onClick={handleDeleteMessage} className='Delete'>حذف &nbsp;<i className="fa-solid fa-trash"></i></button>
                  <button onClick={handleEditMessage} className='Edit'>ویرایش &nbsp;<i className="fa-solid fa-pen"></i></button>
               </div>
            )}
         </div>

      )

   } else {
      return (
         <div className="Chat-section no-chat"><div className="No-chat-img"></div></div>
      );
   }
}