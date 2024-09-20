import { useState, useEffect } from "react";
import "./Contacts.css";
import Swal from 'sweetalert2';
import ChatRoom from "../../ChatBox/MainSectionChat/ChatRoom.js";
interface Contact {
   username: string | number
   name: string | number
}
interface ChatRoomProps {
   show: boolean;
   contact: string;
   sender: string;
   token: string;
   contactColors: string[];
}
export default function Contacts({ onContactClick, setUserStatus, setUser }: any) {
   
   const [popup, setPopup] = useState(false);
   const [selectedContact, setSelectedContact] = useState<string | null>(null);
   const [contacts, setContacts] = useState<any>([]);
   const [username, setUsername] = useState('');
   const [name, setName] = useState('');
   const [findUser, setFindUser] = useState('');
   const [nameError, setNameError] = useState('');
   const [usernameError, setUsernameError] = useState('');
   const [data, setData] = useState<any>(null);

   // API information
   const token = "JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTM2ODE2MzI5NiUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyc2hhaHJ1a2gxMzg1JTIyJTJDJTIybmFtZSUyMiUzQSUyMnNoYWhydWtoJTIyJTJDJTIyZGF0ZSUyMiUzQSUyMjIwMjQtMDgtMThUMTklM0ExOCUzQTI4Ljk0MVolMjIlN0Q=";
   const [allUsersChat, setAllUsersChat] = useState<any>(null);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchChat = async () => {
         const response = await fetch("https://farawin.iran.liara.run/api/chat", {
            method: 'GET',
            headers: {
               'Authorization': token,
               'Contact-type': 'application/json'
            }
         });
         const result = await response.json();
         setAllUsersChat(result);
         setLoading(false)
      };
      fetchChat();
   }, []);

   if (loading) {
      console.log('درحال بارگذاری')
   } else {
      console.log('دیتا رسیدددددد')
      // filter Contact:
      const filterContacts = data && data.contactList ? contacts.filter((contact: any) =>
         contact.name.toLowerCase().includes(findUser.toLowerCase())
      ) : [];

      // logOut user:
      const loguot = () => {
         let timerInterval: any;
         Swal.fire({
             title: "برای خروج مطمعن هستید؟؟؟",
             icon: "warning",
             showCancelButton: true,
             confirmButtonColor: "#3085d6",
             cancelButtonColor: "#d33",
             confirmButtonText: "بله مطمعنم!"
         }).then((result) => {
             if (result.isConfirmed) {
                 Swal.fire({
                     title: "لطفا منتظر بمانید",
                     html: "...در حال خارج شدن",
                     timer: 2700,
                     timerProgressBar: true,
                     didOpen: () => {
                         Swal.showLoading();
                         setTimeout(() => {
                             setUser(null);
                             setUserStatus(false);
                         }, 3000);
                         const getPopup = Swal.getPopup();
                         if (getPopup) {
                             const timer = getPopup.querySelector("b");
                             if (timer) {
                                 timerInterval = setInterval(() => {
                                     timer.textContent = `${Swal.getTimerLeft()}`;
                                 }, 100);
                             }
                         }
                     },
                     willClose: () => {
                         clearInterval(timerInterval);
                     }
                 }).then((result) => {
                     if (result.dismiss === Swal.DismissReason.timer) {
                         console.log("I was closed by the timer");
                     }
                 });
             }
         });
     };

      // random color:
      const colors = ['#9275ff', 'rgba(1, 200, 80, .2)', 'rgba(223, 68, 184, .2)', 'rgba(255, 89, 90, .3)'];
      const RandomColor = (contactIndex: number) => {
         <ChatRoom contactColors={colors} />
         return colors[contactIndex % colors.length];
      };

      // last massage time: 
      const getLastMessageTime = (username: string) => {
         const now = new Date();
         const today = now.toISOString().split("T")[0];
         const userChats = allUsersChat.chatList.filter((chat: any) => (chat.receiver === username || chat.sender === username) && (chat.receiver === '09368163296' || chat.sender === '09368163296'));
         console.log(userChats)
         if (userChats.length === 0) return null;
         const lastChat = userChats[userChats.length - 1];
         const chatDate = lastChat.date.split("T")[0];
         const time = lastChat.date.split("T")[1].split(":").slice(0, 2).join(":");
         if (chatDate === today) {
            return time;
         } else {
            const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
            const [year, month, day] = chatDate.split("-");
            return `${parseInt(day)} ${persianMonths[parseInt(month) - 1]}`;
         }
      };

      // ... for ended text
      const truncateText = (text: string) => {
         return text.length > 36 ? (text.substring(0, 36) + '...') : (text);
      };

      // last massage:
      const getLastMessage = (username: string) => {
         const userChats = allUsersChat.chatList.filter((chat: any) => (chat.receiver === username || chat.sender === username) && (chat.receiver === '09368163296' || chat.sender === '09368163296'));
         return userChats.length > 0 ? (userChats[userChats.length - 1].text) : ('هیچ پیامی وجود ندارد!');
      };
      console.log(`usernameee... ${username}`)
      // open popup function
      const handleOpenPopup = async () => {
         setPopup(true);

         // API related to contact:
         const response = await fetch("https://farawin.iran.liara.run/api/contact", {
            method: 'GET',
            headers: {
               'Authorization': token,
               'Contact-type': 'application/json'
            }
         });
         const result = await response.json();
         console.log(`test data result 1 : ${JSON.stringify(result)}`);
         setData(result);
         console.log(data)
      }

      // sometime a click on submit
      const handleSubmit = (e: any) => {
         e.preventDefault();
         let hasError = false;

         if (name.length < 3) {
            setNameError('نام باید حداقل ۳ کاراکتر باشد');
            hasError = true;
         } else {
            setNameError('');
         }
         if (username.length !== 11) {
            setUsernameError('شماره باید حتما ۱۱ رقمی باشد');
            hasError = true;
         } else {
            setUsernameError('');
         }
         if (hasError) return;

         const userExists = data.contactList.find((contact: any) => (contact.username === username && contact.name === name));
         console.log(userExists)
         if (userExists) {
            console.log(`contact ma : ${contacts}`)
               const newContact: Contact = { username, name };
            setContacts((prevContacts:any) => [...prevContacts, newContact]);
            Swal.fire({
               position: "center",
               icon: "success",
               title: "با موفقیت افزوده شد",
               showConfirmButton: false,
               timer: 1500
            });
            setName('');
            setUsername(''); 
         } else {
            Swal.fire({
               icon: "error",
               title: "☹مخاطب اشتباه وارد شده که",
               text: "دوباره بزن اسمشو",
            });
         }
      };

      
      // element...
      return (
         <div className="Contact-section">
            <div className="header-container">
               <header className="header">
                  <div className="search">
                     <div className="search-bar">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="جست و جو مخاطب" onChange={(e) => setFindUser(e.target.value)} className="search-input" />
                     </div>
                  </div>
                  <i className={`fa-solid fa-plus add`} onClick={handleOpenPopup}></i>
                  <i className="fa-solid fa-arrow-right-from-bracket add" onClick={loguot}></i>
               </header>
               <div className="divider">
                  <span className="divider-text"> مخاطب ها </span>
               </div>
               {popup && (
                  <>
                     <div className="overlay" onClick={() => setPopup(false)}></div>
                     <div className="popup">
                        <i className="fa-solid fa-xmark" onClick={() => setPopup(false)}></i>
                        <form className="register" onSubmit={handleSubmit}>
                           <h1>افزودن مخاطب</h1>
                           <div className="input-group-add">
                              <input type="text" required onChange={(e) => setName(e.target.value)} className={nameError ? 'error' : ''} />
                              <label>نام</label>
                              {nameError && <span className="error-message">{nameError}</span>}
                           </div>
                           <div className="input-group-add">
                              <input type="text" required onChange={(e) => setUsername(e.target.value)} className={usernameError ? 'error' : ''} />
                              <label>شماره</label>
                              {usernameError && <span className="error-message">{usernameError}</span>}
                           </div>
                           <button className='submit-add' type="submit">افزودن</button>
                        </form>
                     </div>
                  </>
               )}
            </div>
            <div className="contacts">
               {
                  filterContacts.map((contact: any, index: number) => (
                     <div className="Contact-info" key={index} onClick={() => { onContactClick(contact); setSelectedContact(contact.name); }}>
                        <div className="userContact">
                           <span className="time-texts">{getLastMessageTime(contact.username)}</span>
                           <div className="name-Contacts">{contact.name}</div>
                           <div className="avater-Contacts" style={{ backgroundColor: RandomColor(index) }}>
                              {contact.name ? contact.name.charAt(0) : ''}
                           </div>
                        </div>
                        <p className="last-text">{truncateText(getLastMessage(contact.username))}</p>
                     </div>
                  ))
               }
            </div>
         </div>
      );
   }
}