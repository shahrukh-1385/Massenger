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
export default function Contacts({ onContactClick, setUserStatus }: any) {
   
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
   const token = "JTdCJTIydXNlcm5hbWUlMjIlM0ElMjIwOTAwMDAwMDAwMCUyMiUyQyUyMnBhc3N3b3JkJTIyJTNBJTIyMTIzNDU2NzhBYSU0MCUyMiUyQyUyMm5hbWUlMjIlM0ElMjIlRDklODElRDglQjElRDglQTclRDklODglREIlOEMlRDklODYlMjIlMkMlMjJkYXRlJTIyJTNBJTIyMjAyMy0xMC0yNVQwNCUzQTIyJTNBNTYuODMzWiUyMiU3RA==";
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
         const userChats = allUsersChat.chatList.filter((chat: any) => chat.receiver === username || chat.sender === username);
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
      }

      // ... for ended text
      const truncateText = (text: string) => {
         return text.length > 36 ? (text.substring(0, 36) + '...') : (text);
      };

      // last massage:
      const getLastMessage = (username: string) => {
         const userChats = allUsersChat.chatList.filter((chat: any) => chat.receiver === username || chat.sender === username);
         return userChats.length > 0 ? (userChats[userChats.length - 1].text) : ('هیچ پیامی وجود ندارد!');
      };

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






   // const filterContacts = contacts.filter(contact =>
   //    contact.name.toLowerCase().includes(findUser.toLowerCase())
   // );
   // const handleSubmit = (e: any) => {
   //    e.preventDefault();
   //    let hasError = false;
   //    if (name.length < 3) {
   //       setNameError('نام باید حداقل ۳ کاراکتر باشد');
   //       hasError = true;
   //    } else {
   //       setNameError('');
   //    }
   //    if (username.length !== 11) {
   //       setUsernameError('شماره باید حتما ۱۱ رقمی باشد');
   //       hasError = true;
   //       console.log("Username:", username.length, "Name:", name);
   //    } else {
   //       setUsernameError('');
   //    }
   //    if (hasError) return;



   //    const user = contactList[0].userList.find(user => user.username === username && user.name === name);
   //    if (user) {
   //       const existingContact = contacts.find(contact => contact.username === username && contact.name === name);
   //       if (existingContact) {
   //          Swal.fire({
   //             icon: "warning",
   //             title: "☹.مخاطبت رو قبلا اضافه کردی",
   //             text: "یعنی تو یک مخاطب جدید نداری؟",
   //          });
   //       } else {
   //          const newContact = { username, name, color: getRandomColor() };
   //          setContacts(prevContacts => [...prevContacts, newContact]);
   //          Swal.fire({
   //             position: "center",
   //             icon: "success",
   //             title: "با موفقیت افزوده شد",
   //             showConfirmButton: false,
   //             timer: 1500
   //          });
   //          setName('');
   //          setUsername('');
   //       }
   //    } else {
   //       Swal.fire({
   //          icon: "error",
   //          title: "اشتباه شد که",
   //          text: "مخاطبی پیدا نشد",
   //       });
   //       console.log("Username:", username, "Name:", name);
   //    }
   // };




   // const getRandomColor = () => {
   //    const colors = ['#9275ff', 'rgba(1, 200, 80, .2)', 'rgba(223, 68, 184, .2)', 'rgba(255, 89, 90, .3)'];
   //    <ChatRoom colors={colors} />
   //    return colors[Math.floor(Math.random() * colors.length)];
   // };
   // const getLastMessage = (username: string) => {
   //    const userChats = ChatsLists.chatList.filter(chat => chat.receiver === username || chat.sender === username);
   //    return userChats.length > 0 ? (userChats[userChats.length - 1].text) : ('هیچ پیامی وجود ندارد!');
   // };
   // const getLastMessageTime = (username: string) => {
   //    const now = new Date();
   //    const today = now.toISOString().split("T")[0];
   //    const userChats = ChatsLists.chatList.filter(chat => chat.receiver === username || chat.sender === username);

   //    if (userChats.length === 0) return null;

   //    const lastChat = userChats[userChats.length - 1];
   //    const chatDate = lastChat.date.split("T")[0];
   //    const time = lastChat.date.split("T")[1].split(":").slice(0, 2).join(":");

   //    if (chatDate === today) {
   //       return time;
   //    } else {
   //       const persianMonths = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
   //       const [year, month, day] = chatDate.split("-");
   //       return `${parseInt(day)} ${persianMonths[parseInt(month) - 1]}`;
   //    }
   // }

   // const truncateText = (text: string, maxLength: number) => {
   //    return text.length > maxLength ? (text.substring(0, maxLength) + '...') : (text);
   // };


   // const contactsMe = filterContacts.map((contact) => (
   // <div className="Contact-info" key={contact.username} onClick={() => { onContactClick(contact); setSelectedContact(contact.name); }}>
   //    <div className="userContact">
   //       <span className="time-texts">{getLastMessageTime(contact.username)}</span>
   //       <div className="name-Contacts">{contact.name}</div>
   //       <div className="avater-Contacts" style={{ backgroundColor: contact.color }}>
   //          {contact.name ? contact.name.charAt(0) : ''}
   //       </div>
   //    </div>
   //    <p className="last-text">{truncateText(getLastMessage(contact.username), 40)}</p>
   // </div>
   // ));


   // const loguot = () => {
   //    let timerInterval: any;
   //    Swal.fire({
   //       title: "برای خروج مطمعن هستید؟؟؟",
   //       icon: "warning",
   //       showCancelButton: true,
   //       confirmButtonColor: "#3085d6",
   //       cancelButtonColor: "#d33",
   //       confirmButtonText: "بله مطمعنم!"
   //    }).then((result) => {
   //       if (result.isConfirmed) {
   //          Swal.fire({
   //             title: "لطفا منتظر بمانید",
   //             html: "...در حال خارج شدن",
   //             timer: 2700,
   //             timerProgressBar: true,
   //             didOpen: () => {
   //                Swal.showLoading();
   //                setTimeout(() => {
   //                   setUserStatus(false);
   //                }, 3000);
   //                const getPopup = Swal.getPopup();
   //                if (getPopup) {
   //                   const timer = getPopup.querySelector("b");
   //                   if (timer) {
   //                      timerInterval = setInterval(() => {
   //                         timer.textContent = `${Swal.getTimerLeft()}`;
   //                      }, 100);
   //                   }
   //                }
   //             },
   //             willClose: () => {
   //                clearInterval(timerInterval);
   //             }
   //          }).then((result) => {
   //             if (result.dismiss === Swal.DismissReason.timer) {
   //                console.log("I was closed by the timer");
   //             }
   //          });
   //       }
   //    });
   // };


   // return (
   //    <div className="Contact-section">
   //       <div className="header-container">
   //          <header className="header">
   //             <div className="search">
   //                <div className="search-bar">
   //                   <i className="fa-solid fa-magnifying-glass"></i>
   //                   <input type="text" placeholder="جست و جو مخاطب" onChange={(e) => setFindUser(e.target.value)} className="search-input" />
   //                </div>
   //             </div>
   //             <i className={`fa-solid fa-plus add`} onClick={() => setPopup(true)}></i>
   //             <i className="fa-solid fa-arrow-right-from-bracket add" onClick={loguot}></i>
   //          </header>
   //          <div className="divider">
   //             <span className="divider-text"> مخاطب ها </span>
   //          </div>
   // {popup && (
   //    <>
   //       <div className="overlay" onClick={() => setPopup(false)}></div>
   //       <div className="popup">
   //          <i className="fa-solid fa-xmark" onClick={() => setPopup(false)}></i>
   //          <form className="register" onSubmit={handleSubmit}>
   //             <h1>افزودن مخاطب</h1>
   //             <div className="input-group-add">
   //                <input type="text" required onChange={(e) => setName(e.target.value)} className={nameError ? 'error' : ''} />
   //                <label>نام</label>
   //                {nameError && <span className="error-message">{nameError}</span>}
   //             </div>
   //             <div className="input-group-add">
   //                <input type="text" required onChange={(e) => setUsername(e.target.value)} className={usernameError ? 'error' : ''} />
   //                <label>شماره</label>
   //                {usernameError && <span className="error-message">{usernameError}</span>}
   //             </div>
   //             <button className='submit-add' type="submit">افزودن</button>
   //          </form>
   //       </div>
   //    </>
   // )}
   //       </div>
   //       <div className="contacts">
   //          {contactsMe}
   //       </div>
   //    </div>
   // );
}
































